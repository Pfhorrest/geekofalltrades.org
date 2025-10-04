import os
import re
import json
from pathlib import Path
from datetime import datetime
from PIL import Image
from .config import image_extensions, THUMB_SUFFIX, THUMB_SIZE, base_dir, package_dir, subimage_threshold
from .parse_images_from_php import parse_images_from_php
from .generate_gallery import generate_gallery
from .extract_exif_data import extract_exif_data

def process_photos():
    
    # Gather (dirpath, dirs, filenames) from os.walk
    walk_data = [
        (d, dirs, files)
        for d, dirs, files in os.walk(base_dir)
        # Skip the folder containing this code
        if not Path(d).resolve().is_relative_to(package_dir.resolve())
    ]

    # Sort by depth (deepest first)
    walk_data.sort(key=lambda x: len(Path(x[0]).parts), reverse=True)

    for dirpath, _, filenames in walk_data:
        dirpath = Path(dirpath) # Convert to Path for easier handling
        relpath = dirpath.relative_to(base_dir)


        # -- MAKE THUMBNAILS --
    
        for filename in filenames:
            filename = Path(filename)
            filepath = dirpath / filename
            relfile = filepath.relative_to(base_dir)
            name = filename.stem
            ext = filename.suffix
    
            # Skip if it's not an image file
            if ext.lower() not in image_extensions:
                continue
    
            # Delete malformed thumbnails (with underscored/multiple suffixes)
            if f"_{THUMB_SUFFIX}" in name or name.replace('_', '-').split('-').count(THUMB_SUFFIX) > 1:
                print(f"Deleting malformed thumbnail: {relfile}")
                try:
                    os.remove(filepath)
                except Exception as e:
                    print(f"Error deleting {relfile}: {e}")
                continue
    
            # Delete thumbnails with no originals
            original_filename = (name[:-len(f"-{THUMB_SUFFIX}")] + ext if name.endswith(f"-{THUMB_SUFFIX}") else None)
            original_path = dirpath / original_filename if original_filename else None

            if original_path and not original_path.exists():
                print(f"Deleting orphan thumbnail: {relfile}")
                try:
                    os.remove(filepath)
                except Exception as e:
                    print(f"Error deleting {relfile}: {e}")
                continue
    
            # Skip over remaining existing thumbnails
            if filename.stem.endswith(f"-{THUMB_SUFFIX}"):
                continue
    
            # Skip if thumbnail exists and is valid size
            thumb_filename = f"{name}-{THUMB_SUFFIX}{ext}"
            thumb_path = dirpath / thumb_filename
            relthumb = thumb_path.relative_to(base_dir)

            if thumb_path.exists():
                try:
                    with Image.open(thumb_path) as thumb_img:
                        w, h = thumb_img.size
                        if not (w >= THUMB_SIZE or h >= THUMB_SIZE):
                            print(f"Deleting undersized existing thumbnail: {relthumb}")
                            os.remove(thumb_path)
                        else:
                            continue
                except Exception as e:
                    print(f"Error checking existing thumb {relthumb}: {e}")
    
            # Otherwise, create thumbnail!
            try:
                with Image.open(filepath) as img:
                    img.thumbnail((THUMB_SIZE, THUMB_SIZE))
                    img.save(thumb_path)
                    print(f"Created thumbnail: {relthumb}")
            except Exception as e:
                print(f"Error creating thumbnail for {relfile}: {e}")


        # -- MAKE GALLERIES --
    
        # Generate title of gallery
        def extract_date_text(path: Path):
            """
            Returns (text, granularity) or (None, "whatever") if invalid.
            Only allows:
                base_dir/YYYY/
                base_dir/YYYY/MM/
                base_dir/YYYY/MM/DD/
            """

            parts = path.parts
            if not parts:
                return None, "whatever"

            # Reject folders with extra non-numeric parts
            for p in parts:
                if not p.isdigit():
                    return None, "whatever"

            # Convert parts to integers
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
                    return f"{n}{'th' if 11 <= n % 100 <= 13 else {1:'st',2:'nd',3:'rd'}.get(n%10,'th')}"
                return f"{ordinal(day)} of {date.strftime('%B')} {year}", "day"

            return None, "whatever"

        date_text, date_granularity = extract_date_text(relpath)
        title_text = f"{date_text + ' ' if date_text else ''}Photography"

        if date_granularity != "whatever":
    
            # Make __head.php if necessary
            head_path = dirpath / "__head.php"
            if not head_path.exists():
                head_content = f'<?php $title = "{title_text} by Forrest Cameranesi" ?>\n'
                with open(head_path, 'w') as f:
                    f.write(head_content)
                print(f"Created: {head_path.relative_to(base_dir)}")
        
            # Make __main.php if necessary
            main_path = dirpath / "__main.php"
            relmain = main_path.relative_to(base_dir)
            if not main_path.exists():
                needs_images = True
            else:
                with open(main_path, "r", encoding="utf-8") as f:
                    existing_content = f.read()
                needs_images = not re.search(r'\$images\s*=\s*array\s*\(', existing_content)

            if needs_images:
                # Generate gallery
                images = generate_gallery(dirpath)

                if not images:
                    # Try to build from children if month/year folder
                    subimages = []
                    print(f"Building gallery from children of {relpath}:")
                    for sub in sorted(dirpath.iterdir()):
                        if not sub.is_dir():
                            continue

                        # Only accept numeric subfolders
                        if not sub.name.isdigit():
                            continue

                        sub_main = sub / "__main.php"
                        if sub_main.exists():
                            print(f"  Found child __main.php: {sub_main.relative_to(base_dir)}")
                            child_images = parse_images_from_php(sub_main)
                            print(f"    Parsed child images: {child_images}")
                            if child_images:
                                # Always include the first image
                                first_img = child_images[0].copy()
                                if 'filename' in first_img:
                                    first_img['filename'] = f"{sub.name}/{first_img['filename']}"

                                # Add morelink/moretext if this child gallery has enough images
                                if len(child_images) >= subimage_threshold:
                                    first_img['morelink'] = sub.name
                                    if date_granularity == "month":
                                        day_num = int(sub.name)
                                        suffix = 'th' if 11<=day_num%100<=13 else {1:'st',2:'nd',3:'rd'}.get(day_num%10, 'th')
                                        first_img['moretext'] = f"More from the {day_num}{suffix}"
                                    elif date_granularity == "year":
                                        month_name = datetime(2000, int(sub.name), 1).strftime('%B')
                                        first_img['moretext'] = f"More from {month_name}"
                                subimages.append(first_img)
                                print(f"    Using first image: {child_images[0]}")

                                # If the gallery has fewer than threshold images, include them all
                                # Otherwise, just include the first image (with "more" link)
                                if len(child_images) < subimage_threshold:
                                    for n in range(1, len(child_images)):
                                        next_img = child_images[n].copy()
                                        if 'filename' in next_img:
                                            next_img['filename'] = f"{sub.name}/{next_img['filename']}"
                                        subimages.append(next_img)
                                        print(f"     And image {n+1}: {child_images[n]}")
                    if subimages:
                        images = subimages


                php_array_str = ""
                if images:
                    php_array_str = "$images = array(\n"
                    def php_escape(s):
                        return json.dumps(s)[1:-1].replace('"', '\\"').replace("'", "\\'")
                    for img in images:
                        php_array_str += "\t\t\tarray(\n"
                        for key, val in img.items():
                            php_array_str += f"\t\t\t\t'{key}' => '{php_escape(val)}',\n"
                        php_array_str += "\t\t\t),\n"
                    php_array_str += "\t\t);\n\n"

                if not main_path.exists():
                    # Write a fresh file
                    main_content = f"""\
                        <section>
                        \t<h2>{title_text}</h2>
                        \t<p class="description">
                        \t\tBest of the {date_granularity}
                        \t</p>
                        \t<?php
                        \t\t{php_array_str.rstrip()}
                        \t\trequire "modules/gallery.php";
                        \t?>
                        </section>
                    """
                    main_content = "\n".join(line.lstrip(" ") for line in main_content.splitlines())
                    with open(main_path, 'w', encoding="utf-8") as f:
                        f.write(main_content)
                    print(f"Created: {relmain}")
                else:
                    # Insert $images array right above first require line
                    lines = existing_content.splitlines()
                    new_lines = []
                    inserted = False
                    for line in lines:
                        if not inserted and 'require "modules/gallery.php"' in line:
                            if php_array_str:
                                new_lines.append("\t\t" + php_array_str.rstrip())
                            inserted = True
                        new_lines.append(line)
                    updated_content = "\n".join(new_lines)

                    with open(main_path, 'w', encoding="utf-8") as f:
                        f.write(updated_content)
                    print(f"Updated: {relmain} with $images array")

            else:
                # If $images array already exists, ensure it is sorted reverse-chronologically

                def resort_images(images):
                    sort_data = []

                    for img in images:
                        fn = img.get("filename", "")
                        path_parts = fn.split("/")

                        # Keep folder parts as-is
                        path_key = []
                        for part in path_parts:
                            try:
                                path_key.append((0, int(part)))  # numeric part
                            except ValueError:
                                path_key.append((1, part))       # non-numeric part

                        # Compute or fetch timestamp
                        ts = img.get("_sort_timestamp")
                        if not ts:
                            filepath = dirpath / Path(fn)
                            if filepath.is_file():
                                try:
                                    exif = extract_exif_data(filepath)
                                    ts = exif.get("timestamp")
                                except Exception as e:
                                    print(f"Warning: could not extract EXIF from {fn}: {e}")

                        if not ts:
                            desc = img.get("description", "")
                            m = re.search(r"\d{4}-\d{2}-\d{2}", desc)
                            if m:
                                ts = m.group(0)

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

                    # Single sorted() call: reverse=True gives descending folders + newest-first timestamps
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
                        # print(f"Resorting existing $images in {relmain}")
                        php_array_str = "$images = array(\n"
                        def php_escape(s):
                            return json.dumps(s)[1:-1].replace('"', '\\"').replace("'", "\\'")
                        for img in sorted_images:
                            php_array_str += "\t\t\tarray(\n"
                            for key, val in img.items():
                                php_array_str += f"\t\t\t\t'{key}' => '{php_escape(val)}',\n"
                            php_array_str += "\t\t\t),\n"
                        php_array_str += "\t\t);\n\n"

                        updated_content = re.sub(
                            r'\$images\s*=\s*array\s*\(.*?\);\s*',
                            lambda m: php_array_str,
                            existing_content,
                            flags=re.DOTALL
                        )

                        with open(main_path, 'w', encoding="utf-8") as f:
                            f.write(updated_content)
                        print(f"Updated: {relmain} (re-sorted)")
