import sys
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import os
import time
import argparse
from pathlib import Path
from datetime import datetime
from PIL import Image
from tqdm import tqdm
from . import config # For image_extensions, THUMB_SUFFIX, THUMB_SIZE, base_dir, package_dir, subimage_threshold
from .parse_images_from_php import parse_images_from_php
from .generate_gallery import generate_gallery
from .write_gallery import write_gallery

# Force stdout to be line-buffered
sys.stdout.reconfigure(line_buffering=True)

def parse_arguments(args_list=None):
    parser = argparse.ArgumentParser(description="Process photos to generate thumbnails and galleries.")
    parser.add_argument("-r", "--retroactive", action="store_true", help="Check and fix existing thumbnails and galleries.")
    return parser.parse_args(args_list)

def process_photos(args=None):
    """Process photos in the base directory, generating thumbnails and galleries.

    Returns:
        None
    """

    # Persistent state across all items
    state = {
        "args": args,
        "last_run": {
            "inat": time.monotonic(),
            "nominatim": time.monotonic(),
            "overpass": time.monotonic(),
        },
    }

    # Gather (dirpath, dirs, filenames) from os.walk
    walk_data = [
        (d, dirs, files)
        for d, dirs, files in os.walk(config.base_dir)
        # Skip the folder containing this code
        if not Path(d).resolve().is_relative_to(config.package_dir.resolve())
    ]

    # Sort by depth (deepest first)
    walk_data.sort(key=lambda x: len(Path(x[0]).parts), reverse=True)

    for dirpath, _, filenames in tqdm(walk_data, desc="Processing folders", unit="folder", file=sys.stdout):
        dirpath = Path(dirpath)
        relpath = dirpath.relative_to(config.base_dir)

        # -- MAKE THUMBNAILS --
        for filename in tqdm(filenames, desc=f"Thumbnails in {relpath}", unit="file", leave=False, file=sys.stdout):
            filename = Path(filename)
            filepath = dirpath / filename
            relfile = filepath.relative_to(config.base_dir)
            name = filename.stem
            ext = filename.suffix

            if ext.lower() not in config.image_extensions:
                continue

            # If in retroactive mode...
            if getattr(args, "retroactive", False):

                # Delete malformed thumbnails
                if f"_{config.THUMB_SUFFIX}" in name or name.replace('_', '-').split('-').count(config.THUMB_SUFFIX) > 1:
                    tqdm.write(f"Deleting malformed thumbnail: {relfile}")
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        tqdm.write(f"Error deleting {relfile}: {e}")
                    continue

                # Delete thumbnails with no originals
                original_filename = (name[:-len(f"-{config.THUMB_SUFFIX}")] + ext if name.endswith(f"-{config.THUMB_SUFFIX}") else None)
                original_path = dirpath / original_filename if original_filename else None

                if original_path and not original_path.exists():
                    tqdm.write(f"Deleting orphan thumbnail: {relfile}")
                    try:
                        os.remove(filepath)
                    except Exception as e:
                        tqdm.write(f"Error deleting {relfile}: {e}")
                    continue

            # Skip (remaining) existing thumbnails
            if filename.stem.endswith(f"-{config.THUMB_SUFFIX}"):
                continue
    
            # Skip original if thumbnail already exists
            thumb_filename = f"{name}-{config.THUMB_SUFFIX}{ext}"
            thumb_path = dirpath / thumb_filename
            relthumb = thumb_path.relative_to(config.base_dir)

            if thumb_path.exists():
                # If retroactive mode is enabled, check thumbnail size too
                if getattr(args, "retroactive", False):
                    try:
                        with Image.open(thumb_path) as thumb_img:
                            w, h = thumb_img.size
                            if not (w >= config.THUMB_SIZE or h >= config.THUMB_SIZE):
                                tqdm.write(f"Deleting undersized existing thumbnail: {relthumb}")
                                os.remove(thumb_path)
                            else:
                                continue
                    except Exception as e:
                        tqdm.write(f"Error checking existing thumb {relthumb}: {e}")
                # Otherwise, just move on
                else:
                    continue

            # Create thumbnail
            try:
                with Image.open(filepath) as img:
                    img.thumbnail((config.THUMB_SIZE, config.THUMB_SIZE))
                    img.save(thumb_path)
                    tqdm.write(f"Created thumbnail: {relthumb}")
            except Exception as e:
                tqdm.write(f"Error creating thumbnail for {relfile}: {e}")

        # -- MAKE GALLERIES --

        def extract_date_text(path: Path):
            """Return the display date and granularity for YYYY[/MM[/DD]] paths."""
            parts = path.parts
            if not parts or any(not part.isdigit() for part in parts):
                return None, "whatever"
            nums = list(map(int, parts))
            if len(nums) == 1 and 1000 <= nums[0] <= 9999:
                return str(nums[0]), "year"
            if len(nums) == 2 and 1 <= nums[1] <= 12:
                date = datetime(nums[0], nums[1], 1)
                return f"{date.strftime('%B')} {nums[0]}", "month"
            if len(nums) == 3:
                try:
                    date = datetime(*nums)
                except ValueError:
                    return None, "whatever"
                day = nums[2]
                suffix = 'th' if 11 <= day % 100 <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
                return f"{day}{suffix} of {date.strftime('%B')} {nums[0]}", "day"
            return None, "whatever"

        head_path = dirpath / "__head.php"
        main_path = dirpath / "__main.php"
        date_text, date_granularity = extract_date_text(relpath)
        if date_granularity == "whatever":
            continue
        if not (getattr(args, "retroactive", False)) and head_path.exists() and main_path.exists():
            continue

        title_text = f"{date_text + ' ' if date_text else ''}Photography"

        # Make __head.php if necessary
        if not head_path.exists():
            head_path.write_text(f'<?php $title = "{title_text}" ?>\n', encoding="utf-8")
            tqdm.write(f"Created: {head_path.relative_to(config.base_dir)}")

        # Existing galleries are maintained from their own entries. New galleries
        # are generated from files, with parent galleries assembled from children.
        if main_path.exists():
            if getattr(args, "retroactive", False) and date_granularity == "day":
                result = generate_gallery(dirpath, state)
                # If no $images array existed, retroactive generation returns
                # fresh entries; the gallery module owns inserting them.
                if isinstance(result, list) and result:
                    write_gallery(main_path, result)
            continue

        images = generate_gallery(dirpath, state)
        if not images:
            # Try to build from children if month/year folder
            subimages = []
            tqdm.write(f"Building gallery from children of {relpath}:")
            for sub in tqdm(sorted(dirpath.iterdir(), reverse=True), desc=f"Child folders in {relpath}", unit="folder", leave=False, file=sys.stdout):
                if not sub.is_dir() or not sub.name.isdigit():
                    continue
                sub_main = sub / "__main.php"
                if not sub_main.exists():
                    continue
                child_images = parse_images_from_php(sub_main)
                if not child_images:
                    continue

                # Always include the first image
                first_img = child_images[0].copy()
                if 'filename' in first_img:
                    first_img['filename'] = f"{sub.name}/{first_img['filename']}"

                # Add morelink/moretext if this child gallery has enough images
                if len(child_images) >= config.subimage_threshold:
                    first_img['morelink'] = sub.name
                    if date_granularity == "month":
                        day_num = int(sub.name)
                        suffix = 'th' if 11 <= day_num % 100 <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(day_num % 10, 'th')
                        first_img['moretext'] = f"the {day_num}{suffix}"
                    elif date_granularity == "year":
                        first_img['moretext'] = datetime(2000, int(sub.name), 1).strftime('%B')
                subimages.append(first_img)

                # If the gallery has fewer than threshold images, just include them all
                if len(child_images) < config.subimage_threshold:
                    for child_image in child_images[1:]:
                        next_image = child_image.copy()
                        if 'filename' in next_image:
                            next_image['filename'] = f"{sub.name}/{next_image['filename']}"
                        subimages.append(next_image)
            images = subimages or None

        main_content = f"""\
            <section>
            \t<h2>{title_text}</h2>
            \t<p class="description">
            \t\tBest of the {date_granularity}
            \t</p>
            \t<?php
            \t\techo render_gallery();
            \t?>
            </section>
        """
        main_content = "\n".join(line.lstrip(" ") for line in main_content.splitlines())
        write_gallery(main_path, images or [], content=main_content)
        tqdm.write(f"Created: {main_path.relative_to(config.base_dir)}")
