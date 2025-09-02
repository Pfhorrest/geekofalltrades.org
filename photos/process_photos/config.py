import os
import pathlib

image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'}
THUMB_SUFFIX = "thumb"
THUMB_SIZE = 512

package_dir = pathlib.Path(__file__).resolve().parent
base_dir = package_dir.parent

LOCATION_CACHE_FILE = package_dir / "_caches" / "locations.json"
SUBJECT_CACHE_FILE = package_dir / "_caches" / "subjects.json"

credentials_path = package_dir / "_keys" / "vision.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)

# Minimum number of images to link to sub-gallery
# for more instead of just including them all
subimage_threshold = 3
