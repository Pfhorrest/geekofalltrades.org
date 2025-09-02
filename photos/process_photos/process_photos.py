import os
import re
import json
import textwrap
from pathlib import Path
from datetime import datetime
from PIL import Image
from .config import image_extensions, THUMB_SUFFIX, THUMB_SIZE, base_dir, package_dir
from .generate_gallery import generate_gallery

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


        # -- MAKE THUMBNAILS --
    
        for filename in filenames:
            filename = Path(filename)
            filepath = dirpath / filename
            name = filename.stem
            ext = filename.suffix
    
            # Skip if it's not an image file
            if ext.lower() not in image_extensions:
                continue
    
            # Delete malformed thumbnails (with underscored/multiple suffixes)
            if f"_{THUMB_SUFFIX}" in name or name.replace('_', '-').split('-').count(THUMB_SUFFIX) > 1:
                print(f"Deleting malformed thumbnail: {filepath}")
                try:
                    os.remove(filepath)
                except Exception as e:
                    print(f"Error deleting {filepath}: {e}")
                continue
    
            # Delete thumbnails with no originals
            original_filename = (name[:-len(f"-{THUMB_SUFFIX}")] + ext if name.endswith(f"-{THUMB_SUFFIX}") else None)
            original_path = dirpath / original_filename if original_filename else None

            if original_path and not original_path.exists():
                print(f"Deleting orphan thumbnail: {filepath}")
                try:
                    os.remove(filepath)
                except Exception as e:
                    print(f"Error deleting {filepath}: {e}")
                continue
    
            # Skip over remaining existing thumbnails
            if filename.stem.endswith(f"-{THUMB_SUFFIX}"):
                continue
    
            # Skip if thumbnail exists and is valid size
            thumb_filename = f"{name}-{THUMB_SUFFIX}{ext}"
            thumb_path = dirpath / thumb_filename

            if thumb_path.exists():
                try:
                    with Image.open(thumb_path) as thumb_img:
                        w, h = thumb_img.size
                        if not (w >= THUMB_SIZE or h >= THUMB_SIZE):
                            print(f"Deleting undersized existing thumbnail: {thumb_path}")
                            os.remove(thumb_path)
                        else:
                            continue
                except Exception as e:
                    print(f"Error checking existing thumb {thumb_path}: {e}")
    
            # Otherwise, create thumbnail!
            try:
                with Image.open(filepath) as img:
                    img.thumbnail((THUMB_SIZE, THUMB_SIZE))
                    img.save(thumb_path)
                    print(f"Created thumbnail: {thumb_path}")
            except Exception as e:
                print(f"Error creating thumbnail for {filepath}: {e}")


        # -- MAKE GALLERIES --
    
        # Generate title of gallery
        def extract_date_text(path: Path):
            parts = path.parts[-3:]

            # Require the folder itself to be numeric
            if not path.name.isdigit():
                print(f"Skipping non-date folder: {path}")
                return None, "whatever"

            numeric_parts = [p for p in parts if p.isdigit()]

            for i in range(3, 0, -1):
                if len(numeric_parts) >= i:
                    try:
                        subset = numeric_parts[-i:]
                        subset = list(map(int, subset))
                        if i == 3:
                            year, month, day = subset
                            date = datetime(year, month, day)

                            def ordinal(n):
                                return f"{n}{'th' if 11<=n%100<=13 else {1:'st',2:'nd',3:'rd'}.get(n%10, 'th')}"

                            return f"{ordinal(day)} of {date.strftime('%B')} {year}", "day"

                        elif i == 2:
                            year, month = subset
                            date = datetime(year, month, 1)
                            return f"{date.strftime('%B')} {year}", "month"

                        elif i == 1:
                            year = subset[0]
                            if 1000 <= year <= 9999:
                                return f"{year}", "year"

                    except Exception as e:
                        print(f"Error generating date text for {subset}: {e}")
                        continue

            return None, "whatever"

        date_text, date_granularity = extract_date_text(dirpath)
        title_text = f"{date_text + ' ' if date_text else ''}Photography"

        if date_granularity != "whatever":
    
            # Make __head.php if necessary
            head_path = dirpath / "__head.php"
            if not head_path.exists():
                head_content = f'<?php $title = "{title_text} by Forrest Cameranesi" ?>\n'
                with open(head_path, 'w') as f:
                    f.write(head_content)
                print(f"Created: {head_path}")
        
            # Make __main.php if necessary
            main_path = dirpath / "__main.php"
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

                    def parse_images_from_php(main_php_path):
                        images = []
                        try:
                            with open(main_php_path, 'r', encoding='utf-8') as f:
                                content = f.read()

                            # Use regex with DOTALL to capture everything inside the array(...)
                            match = re.search(r'\$images\s*=\s*array\s*\((.*?)\);\s*', content, re.DOTALL)
                            if not match:
                                return images

                            array_content = match.group(1)

                            # Split by "array(" to get individual image blocks
                            # Each image array starts with 'array(' and ends with '),'
                            image_blocks = re.findall(r'array\s*\((.*?)\),', array_content, re.DOTALL)
                            
                            for block in image_blocks:
                                img = {}
                                # Extract each key => 'value' pair inside the array block
                                for line in block.splitlines():
                                    line = line.strip().rstrip(',')
                                    m = re.match(r"'([^']+)'\s*=>\s*'([^']*)'", line)
                                    if m:
                                        key, val = m.groups()
                                        img[key] = val
                                if img:
                                    images.append(img)
                        except Exception as e:
                            print(f"Error parsing {main_php_path}: {e}")

                        return images

                    subimages = []
                    print(f"Building gallery from children of {dirpath}:")
                    for sub in sorted(dirpath.iterdir()):
                        if not sub.is_dir():
                            continue

                        # Only accept numeric subfolders
                        if not sub.name.isdigit():
                            continue

                        sub_main = sub / "__main.php"
                        if sub_main.exists():
                            print(f"  Found child __main.php: {sub_main}")
                            child_images = parse_images_from_php(sub_main)
                            print(f"    Parsed child images: {child_images}")
                            if child_images:
                                first_img = child_images[0].copy()
                                if 'filename' in first_img:
                                    first_img['filename'] = f"{sub.name}/{first_img['filename']}"
                                first_img['morelink'] = sub.name
                                if date_granularity == "month":
                                    day_num = int(sub.name)  # safe now, only digits allowed
                                    suffix = 'th' if 11<=day_num%100<=13 else {1:'st',2:'nd',3:'rd'}.get(day_num%10, 'th')
                                    first_img['moretext'] = f"More from the {day_num}{suffix}"
                                elif date_granularity == "year":
                                    month_name = datetime(2000, int(sub.name), 1).strftime('%B')
                                    first_img['moretext'] = f"More from {month_name}"
                                subimages.append(first_img)
                                print(f"    Using first image: {child_images[0]}")
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
                    print(f"Created: {main_path}")
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
                    print(f"Updated: {main_path} with $images array")
