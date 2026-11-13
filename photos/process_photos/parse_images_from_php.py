import re
from tqdm import tqdm
from .find_images_array import find_images_array

def split_php_array_elements(array_content):
    """Split PHP array contents into top-level elements.
    Respects nested parentheses and quoted strings.

    Args:
        array_content (str): The content of a PHP array.

    Returns:
        list: The array elements.
    """
    elements = []
    start = 0
    depth = 0
    quote = None
    escaped = False

    for index, char in enumerate(array_content):
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue

        if char in ("'", '"'):
            quote = char
        elif char == "(":
            depth += 1
        elif char == ")":
            depth -= 1
        elif char == "," and depth == 0:
            element = array_content[start:index].strip()
            if element:
                elements.append(element)
            start = index + 1

    element = array_content[start:].strip()
    if element:
        elements.append(element)

    return elements

def parse_images_from_php(main_php_path):
    """Parse image metadata from a PHP file defining an array of images.

    Args:
        main_php_path (str or Path): Path to the PHP file containing image definitions.

    Returns:
        list: A list of dictionaries, each representing an image and its metadata.
    """
    images = []
    try:
        with open(main_php_path, 'r', encoding='utf-8') as f:
            content = f.read()

        bounds = find_images_array(content)
        if not bounds:
            return images

        start, end = bounds
        open_index = content.index("(", start, end)
        array_content = content[open_index + 1:end - 1]

        image_blocks = split_php_array_elements(array_content)
        
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
        tqdm.write(f"Error parsing {main_php_path}: {e}")

    return images
