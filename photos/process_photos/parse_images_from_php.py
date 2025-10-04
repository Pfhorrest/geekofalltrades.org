import re

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
            # Match key => value pairs where both are quoted PHP strings
            # Handles escaped single quotes correctly (\' inside string)
            for m in re.finditer(r"'((?:\\'|[^'])+)'\s*=>\s*'((?:\\'|[^'])*)'", block):
                key = m.group(1).replace("\\'", "'")
                val = m.group(2).replace("\\'", "'")
                img[key] = val
            if img:
                images.append(img)
    except Exception as e:
        print(f"Error parsing {main_php_path}: {e}")

    return images
