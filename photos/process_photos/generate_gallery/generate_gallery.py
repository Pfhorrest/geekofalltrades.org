from pathlib import Path
from tqdm import tqdm
from ..config import image_extensions, THUMB_SUFFIX
from ..extract_exif_data import extract_exif_data
from .identify_subject import identify_subject
from .identify_location import identify_location

def generate_gallery(path):
    images = []
    for filepath in path.iterdir():
        if not filepath.is_file():
            continue

        # Skip thumbnails
        if filepath.stem.endswith(f"-{THUMB_SUFFIX}"):
            continue

        # Skip non-images
        if filepath.suffix.lower() not in image_extensions:
            continue

        try:
            exif = extract_exif_data(filepath)

            # Get subject name
            subject = identify_subject(filepath)

            # Get location name
            location, prefix = (None, None)
            if exif.get("gps"):
                location, prefix = identify_location(*exif["gps"])

            # Compose title
            if subject and location:
                title = f"{subject} {prefix} {location}"
            elif subject:
                title = subject
            elif location:
                title = location
            else:
                title = "Untitled"

            # Capitalize all words except short prepositions, unless first word
            def smart_title_case(text):
                skip_words = {"at", "in", "on", "to", "for", "by", "of", "and", "but", "or", "nor", "a", "an", "the", "near"}
                words = text.split()
                if not words:
                    return "Untitled"
                titled = [words[0].capitalize()]  # Always capitalize the first word
                for word in words[1:]:
                    if word.lower() in skip_words:
                        titled.append(word.lower())
                    else:
                        titled.append(word.capitalize())
                return " ".join(titled)

            title = smart_title_case(title)

            # Compose description
            desc_parts = []
            if exif.get("camera"):
                desc_parts.append(exif["camera"])
            if exif.get("date"):
                desc_parts.append(exif["date"])
            description = ", ".join(desc_parts) if desc_parts else "No description"

            # Add to array
            images.append({
                "title": title,
                "filename": filepath.name,
                "description": description,
                "_sort_timestamp": exif.get("timestamp")  # ISO 8601 expected
            })

        except Exception as e:
            tqdm.write(f"Warning: Skipping file {filepath} due to error: {e}")

    # SORT: sort by _sort_timestamp (None last)
    images.sort(
        key=lambda img: (img["_sort_timestamp"] is None, img["_sort_timestamp"]),
        reverse=True
    )

    # REMOVE _sort_timestamp before returning
    for img in images:
        img.pop("_sort_timestamp", None)

    return images if images else None
