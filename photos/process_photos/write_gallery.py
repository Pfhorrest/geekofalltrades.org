import re
from pathlib import Path
from .find_images_array import find_images_array

def write_gallery(path, images, content=None):
    """Write or update a gallery's PHP `$images` array without replacing its markup.

    If `content` is supplied and the file does not yet exist, it is used as the
    surrounding page template. Otherwise an existing array is replaced, or a
    missing array is inserted immediately before the first render_gallery call.

    Args:
        path (Path): Path to the PHP file.
        images (list): List of image dictionaries.
        content (str, optional): Surrounding page template for new files. Defaults to None.
    
    Raises:
        ValueError: If the file does not exist and no content is provided, or if
                    the file does not contain a render_gallery() call when inserting a new array.
    
    Returns:
        None
    """
    path = Path(path)
    def serialize_images(images):
        """Serialize image dictionaries as the PHP array expected by the site.
        
        Args:
            images (list): List of image dictionaries.

        Returns:
            str: The serialized PHP array.
        """
        lines = ["$images = array("]
        for image in images:
            lines.append("\t\t\tarray(")
            for key, value in image.items():
                value = "" if value is None else str(value)
                escaped = value.replace("\\", "\\\\").replace("'", "\\'")
                lines.append(f"\t\t\t\t'{key}' => '{escaped}',")
            lines.append("\t\t\t),")
        lines.append("\t\t)")
        return "\n".join(lines)

    array_text = serialize_images(images) if images else ""
    if not path.exists():
        if content is None:
            raise ValueError(f"Cannot create {path} without page content")
        updated_content = content
        marker = "/* IMAGES_ARRAY */"
        if marker in updated_content:
            updated_content = updated_content.replace(marker, array_text, 1)
        elif array_text:
            match = re.search(r"(?m)^.*render_gallery\s*\(", updated_content)
            if match:
                updated_content = updated_content[:match.end()] + array_text + "\n" + updated_content[match.end():]
        path.write_text(updated_content, encoding="utf-8")
        return

    existing_content = path.read_text(encoding="utf-8")
    bounds = find_images_array(existing_content)
    if bounds:
        start, end = bounds
        updated_content = existing_content[:start] + array_text + existing_content[end:]
    elif array_text:
        match = re.search(r"(?m)^.*render_gallery\s*\(", existing_content)
        if not match:
            raise ValueError(f"Could not find render_gallery() in {path}; leaving it untouched")
        updated_content = existing_content[:match.end()] + array_text + "\n" + existing_content[match.end():]
    else:
        return
    path.write_text(updated_content, encoding="utf-8")

