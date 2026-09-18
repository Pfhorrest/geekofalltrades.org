import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import os
import re
import json
from pathlib import Path
from datetime import datetime
from PIL import Image
from tqdm import tqdm
from . import config # For image_extensions, THUMB_SUFFIX, THUMB_SIZE, base_dir, package_dir, subimage_threshold
from .parse_images_from_php import parse_images_from_php
from .generate_gallery import generate_gallery
from .extract_exif_data import extract_exif_data


def _find_matching_paren(text, open_index):
    """Return the index of the ')' that matches the '(' at open_index in
    text, accounting for nesting. Returns None if unbalanced.
    """
    depth = 0
    for i in range(open_index, len(text)):
        if text[i] == '(':
            depth += 1
        elif text[i] == ')':
            depth -= 1
            if depth == 0:
                return i
    return None


def process_photos():
    """Process photos in the base directory, generating thumbnails and galleries.

    Returns:
        None
    """
    # Gather (dirpath, dirs, filenames) from os.walk
    walk_data = [
        (d, dirs, files)
        for d, dirs, files in os.walk(config.base_dir)
        # Skip the folder containing this code
        if not Path(d).resolve().is_relative_to(config.package_dir.resolve())
    ]

    # Sort by depth (deepest first)
    walk_data.sort(key=lambda x: len(Path(x[0]).parts), reverse=True)

    for dirpath, _, filenames in tqdm(walk_data, desc="Processing folders", unit="folder"):
        dirpath = Path(dirpath)
        relpath = dirpath.relative_to(config.base_dir)

        # -- MAKE THUMBNAILS --
        for filename in tqdm(filenames, desc=f"Thumbnails in {relpath}", unit="file", leave=False):
            filename = Path(filename)
            filepath = dirpath / filename
            relfile = filepath.relative_to(config.base_dir)
            name = filename.stem
            ext = filename.suffix

            if ext.lower() not in config.image_extensions:
                continue

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

            # Skip remaining existing thumbnails
            if filename.stem.endswith(f"-{config.THUMB_SUFFIX}"):
                continue
    
            # Skip if thumbnail exists and is valid size
            thumb_filename = f"{name}-{config.THUMB_SUFFIX}{ext}"
            thumb_path = dirpath / thumb_filename
            relthumb = thumb_path.relative_to(config.base_dir)

            if thumb_path.exists():
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

            # Create thumbnail
            try:
                with Image.open(filepath) as img:
                    img.thumbnail((config.THUMB_SIZE, config.THUMB_SIZE))
                    img.save(thumb_path)
                    tqdm.write(f"Created thumbnail: {relthumb}")
            except Exception as e:
                tqdm.write(f"Error creating thumbnail for {relfile}: {e}")

        # -- MAKE GALLERIES --
    
        # Generate title of gallery
        def extract_date_text(path: Path):
            """Extract a human-readable date text from a path.
                Only allows:
                    base_dir/YYYY/
                    base_dir/YYYY/MM/
                    base_dir/YYYY/MM/DD/

            Args:
                path (Path): Path object representing the directory.

            Returns:
                tuple: A tuple containing the human-readable date text and its granularity.
            """            

            parts = path.parts
            if not parts:
                return None, "whatever"
            for p in parts:
                if not p.isdigit():
                    return None, "whatever"
            nums = list(map(int, parts))
            if len(nums) == 1:
                year = nums[0]
                if 1000 <= year <= 9999:
                    return f"{year}", "year"
            elif len(nums) == 2:
                year, month = nums
                if 1 <= month <= 12:
                    date = datetime(year, month, 1)
                    return f"{date.strftime('%B')} {year}", "month"
            elif len(nums) == 3:
                year, month, day = nums
                try:
                    date = datetime(year, month, day)
                except ValueError:
                    return None, "whatever"

                def ordinal(n):
                    """Convert a number to an ordinal string.

                    Args:
                        n (int): The number to convert.

                    Returns:
                        str: The ordinal string representation of the number.
                    """
                    return f"{n}{'th' if 11 <= n % 100 <= 13 else {1:'st',2:'nd',3:'rd'}.get(n%10,'th')}"
                return f"{ordinal(day)} of {date.strftime('%B')} {year}", "day"
            return None, "whatever"

        date_text, date_granularity = extract_date_text(relpath)
        title_text = f"{date_text + ' ' if date_text else ''}Photography"

        if date_granularity != "whatever":
    
            # Make __head.php if necessary
            head_path = dirpath / "__head.php"
            if not head_path.exists():
                head_content = f'<?php $title = "{title_text}" ?>\n'
                with open(head_path, 'w') as f:
                    f.write(head_content)
                tqdm.write(f"Created: {head_path.relative_to(config.base_dir)}")

            # Make __main.php if necessary
            main_path = dirpath / "__main.php"
            relmain = main_path.relative_to(config.base_dir)
            if not main_path.exists():
                needs_images = True
            else:
                with open(main_path, "r", encoding="utf-8") as f:
                    existing_content = f.read()
                needs_images = not re.search(r'\$images\s*=\s*array\s*\(', existing_content)

            def php_escape(s):
                """Escape a string for use in a PHP string.

                Args:
                    s (str): The string to escape.

                Returns:
                    str: The escaped string.
                """
                return json.dumps(s)[1:-1].replace('"', '\\"').replace("'", "\\'")

            if needs_images:
                images = generate_gallery(dirpath)
                if not images:
                    # Try to build from children if month/year folder
                    subimages = []
                    tqdm.write(f"Building gallery from children of {relpath}:")
                    for sub in tqdm(sorted(dirpath.iterdir(), reverse=True), desc=f"Child folders in {relpath}", unit="folder", leave=False):
                        if not sub.is_dir() or not sub.name.isdigit():
                            continue
                        sub_main = sub / "__main.php"
                        if sub_main.exists():
                            tqdm.write(f"  Found child __main.php: {sub_main.relative_to(config.base_dir)}")
                            child_images = parse_images_from_php(sub_main)
                            tqdm.write(f"    Parsed child images: {child_images}")
                            if child_images:
                                # Always include the first image
                                first_img = child_images[0].copy()
                                if 'filename' in first_img:
                                    first_img['filename'] = f"{sub.name}/{first_img['filename']}"

                                # Add morelink/moretext if this child gallery has enough images
                                if len(child_images) >= config.subimage_threshold:
                                    first_img['morelink'] = sub.name
                                    if date_granularity == "month":
                                        day_num = int(sub.name)
                                        suffix = 'th' if 11<=day_num%100<=13 else {1:'st',2:'nd',3:'rd'}.get(day_num%10, 'th')
                                        first_img['moretext'] = f"the {day_num}{suffix}"
                                    elif date_granularity == "year":
                                        month_name = datetime(2000, int(sub.name), 1).strftime('%B')
                                        first_img['moretext'] = f"{month_name}"
                                subimages.append(first_img)
                                tqdm.write(f"    Using first image: {child_images[0]}")

                                # If the gallery has fewer than threshold images, include them all
                                # Otherwise, just include the first image (with "more" link)
                                if len(child_images) < config.subimage_threshold:
                                    for n in range(1, len(child_images)):
                                        next_img = child_images[n].copy()
                                        if 'filename' in next_img:
                                            next_img['filename'] = f"{sub.name}/{next_img['filename']}"
                                        subimages.append(next_img)
                                        tqdm.write(f"     And image {n+1}: {child_images[n]}")
                    if subimages:
                        images = subimages

                php_array_str = ""
                if images:
                    php_array_str = "$images = array(\n"
                    for img in tqdm(images, desc=f"Writing images array for {relmain}", unit="img", leave=False):
                        php_array_str += "\t\t\tarray(\n"
                        for key, val in img.items():
                            php_array_str += f"\t\t\t\t'{key}' => '{php_escape(val)}',\n"
                        php_array_str += "\t\t\t),\n"
                    php_array_str += "\t\t)\n\n"

                if not main_path.exists():
                    main_content = f"""\
                        <section>
                        \t<h2>{title_text}</h2>
                        \t<p class="description">
                        \t\tBest of the {date_granularity}
                        \t</p>
                        \t<?php
                        \t\techo render_gallery({php_array_str.rstrip()});
                        \t?>
                        </section>
                    """
                    main_content = "\n".join(line.lstrip(" ") for line in main_content.splitlines())
                    with open(main_path, 'w', encoding="utf-8") as f:
                        f.write(main_content)
                    tqdm.write(f"Created: {relmain}")
                else:
                    lines = existing_content.splitlines()
                    new_lines = []
                    inserted = False
                    for line in lines:
                        if not inserted and 'render_gallery' in line:
                            if php_array_str:
                                new_lines.append("\t\t" + php_array_str.rstrip())
                            inserted = True
                        new_lines.append(line)
                    updated_content = "\n".join(new_lines)
                    with open(main_path, 'w', encoding="utf-8") as f:
                        f.write(updated_content)
                    tqdm.write(f"Updated: {relmain} with $images array")

            else:
                # If $images array already exists, ensure it is sorted reverse-chronologically

                def resort_images(images):
                    """Sort images in reverse-chronological order.

                    Args:
                        images (list): List of image dictionaries.

                    Returns:
                        list: Sorted list of image dictionaries.
                    """
                    sort_data = []
                    for img in tqdm(images, desc=f"Resorting images in {relpath}", unit="img", leave=False):
                        fn = img.get("filename", "")
                        path_parts = fn.split("/")
                        path_key = []
                        for part in path_parts:
                            try:
                                path_key.append((0, int(part)))
                            except ValueError:

                        # Compute or fetch timestamp
                                path_key.append((1, part))
                        ts = img.get("_sort_timestamp")
                        if not ts:
                            filepath = dirpath / Path(fn)
                            if filepath.is_file():
                                try:
                                    exif = extract_exif_data(filepath)
                                    ts = exif.get("timestamp")
                                except Exception as e:
                                    tqdm.write(f"Warning: could not extract EXIF from {fn}: {e}")
                        if not ts:
                            desc = img.get("description", "")
                            m = re.search(r"\d{4}-\d{2}-\d{2}", desc)
                            if m:
                                ts = m.group(0)

                        # Cache the timestamp on the image itself. A photo's EXIF
                        # capture date never changes, so once this is written back
                        # into the PHP array, the next run finds it via
                        # img.get("_sort_timestamp") above and never has to touch
                        # extract_exif_data (or the file itself) again for this
                        # image. Rebinding img to a NEW dict (rather than mutating
                        # it in place) matters: images/existing_images below and
                        # sorted_images share the same dict objects, so an in-place
                        # mutation would show up on both sides of the
                        # sorted_images != existing_images check and the write
                        # would never trigger, even the first time.
                        if ts:
                            img = {**img, "_sort_timestamp": ts}

                        # Normalize timestamp
                        if ts:
                            try:
                                dt = datetime.fromisoformat(ts)
                            except ValueError:
                                try:
                                    dt = datetime.strptime(ts, "%Y-%m-%d")
                                except ValueError:
                                    dt = datetime.min
                        else:
                            dt = datetime.min
                        sort_data.append((path_key, dt, img))
                    sorted_images = [
                        img for path_key, dt, img in sorted(
                            sort_data,
                            key=lambda x: (x[0], x[1]),
                            reverse=True
                        )
                    ]
                    return sorted_images

                existing_images = parse_images_from_php(main_path)
                if existing_images:
                    sorted_images = resort_images(existing_images)
                    if sorted_images != existing_images:
                        # Independent sanity check: existing_images came from
                        # parse_images_from_php(main_path), which is exactly what
                        # a bad test mock replaced before — comparing against it
                        # wouldn't have caught that, since resort_images only ever
                        # permutes its input and so can never come out shorter
                        # than whatever (real or fake) list it was given. Counting
                        # entries in the raw file text instead is independent of
                        # that whole path. process_photos should only ever create
                        # or resort this array, never shrink it.
                        on_disk_count = existing_content.count("'filename' =>")
                        if len(sorted_images) < on_disk_count:
                            tqdm.write(
                                f"Refusing to update {relmain}: about to write "
                                f"{len(sorted_images)} images but the file on disk "
                                f"has {on_disk_count} — this looks like it would "
                                f"delete data, not resort it."
                            )
                        else:
                            php_array_str = "$images = array(\n"
                            for img in tqdm(sorted_images, desc=f"Writing sorted images for {relmain}", unit="img", leave=False):
                                php_array_str += "\t\t\tarray(\n"
                                for key, val in img.items():
                                    php_array_str += f"\t\t\t\t'{key}' => '{php_escape(val)}',\n"
                                php_array_str += "\t\t\t),\n"
                            php_array_str += "\t\t)"

                            # Replace only through the array's OWN matching closing
                            # paren, not past it. The old approach
                            # (re.sub(r'...array\(.*?\);', ...)) matched up to the
                            # FIRST literal "');'" it found — but this array is
                            # nested inside render_gallery($images = array(...));,
                            # so the array's own single ')' is immediately followed
                            # by ANOTHER ')' (render_gallery's) before the ';'. The
                            # old regex swallowed that second paren as if it were
                            # part of the array, and never put it back — that's the
                            # dropped closing paren / syntax error.
                            match = re.search(r'\$images\s*=\s*array\s*\(', existing_content)
                            close_index = _find_matching_paren(existing_content, match.end() - 1) if match else None

                            if match and close_index is not None:
                                updated_content = (
                                    existing_content[:match.start()]
                                    + php_array_str
                                    + existing_content[close_index + 1:]
                                )
                                with open(main_path, 'w', encoding="utf-8") as f:
                                    f.write(updated_content)
                                tqdm.write(f"Updated: {relmain} (re-sorted)")
                            else:
                                tqdm.write(f"Could not locate a matching closing paren for $images in {relmain}; leaving it untouched.")