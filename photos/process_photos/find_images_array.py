import re

def find_images_array(text):
    """Find the bounds of `$images = array(...)`, respecting quoted strings.
    
    Args:
        text (str): The PHP source code.

    Returns:
        tuple: Start and end index of `$images = array(...)`.
    """
    match = re.search(r"\$images\s*=\s*array\s*\(", text)
    if not match:
        return None
    open_index = match.end() - 1
    depth = 0
    quote = None
    escaped = False
    for index in range(open_index, len(text)):
        char = text[index]
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
            if depth == 0:
                return match.start(), index + 1
    return None
