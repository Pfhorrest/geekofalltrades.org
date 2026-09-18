import pytest
from pathlib import Path
from PIL import Image
import piexif

from process_photos.extract_exif_data import extract_exif_data
from process_photos import config # For base_dir


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def create_image_with_exif(path: Path, exif_dict=None):
    """
    Create a tiny JPEG image with optional EXIF data.
    """
    img = Image.new("RGB", (1, 1), color="white")

    if exif_dict:
        exif_bytes = piexif.dump(exif_dict)
        img.save(path, format="JPEG", exif=exif_bytes)
    else:
        img.save(path, format="JPEG")

    img.close()


# ------------------------------------------------------------
# Tests
# ------------------------------------------------------------

def test_raises_if_file_missing(isolated_base_dir):
    missing = isolated_base_dir / "missing.jpg"

    with pytest.raises(FileNotFoundError):
        extract_exif_data(missing)


def test_image_with_no_exif(isolated_base_dir):
    img_path = isolated_base_dir / "no_exif.jpg"
    create_image_with_exif(img_path)

    result = extract_exif_data(img_path)

    assert result == {
        "camera": None,
        "date": None,
        "gps": None,
        "timestamp": None,
        'f_number': None,
        'focal_length': None,
        'iso': None,
        'lens': None,
        'shutter': None
    }


def test_extracts_camera_and_date(isolated_base_dir):
    img_path = isolated_base_dir / "camera_date.jpg"

    exif_dict = {
        "0th": {
            piexif.ImageIFD.Model: b"Canon EOS Test",
            piexif.ImageIFD.DateTime: b"2025:06:10 14:37:22",
        }
    }

    create_image_with_exif(img_path, exif_dict)

    result = extract_exif_data(img_path)

    assert result["camera"] == "Canon EOS Test"
    assert result["date"] == "2025-06-10"
    assert result["timestamp"] == "2025-06-10T14:37:22"
    assert result["gps"] is None


def test_extracts_gps_coordinates(isolated_base_dir):
    img_path = isolated_base_dir / "gps.jpg"

    exif_dict = {
        "GPS": {
            piexif.GPSIFD.GPSLatitudeRef: b"N",
            piexif.GPSIFD.GPSLatitude: [(34, 1), (30, 1), (0, 1)],   # 34.5
            piexif.GPSIFD.GPSLongitudeRef: b"W",
            piexif.GPSIFD.GPSLongitude: [(120, 1), (0, 1), (0, 1)], # -120.0
        }
    }

    create_image_with_exif(img_path, exif_dict)

    result = extract_exif_data(img_path)

    assert result["gps"] == (34.5, -120.0)


def test_invalid_date_is_handled_gracefully(isolated_base_dir):
    img_path = isolated_base_dir / "bad_date.jpg"

    exif_dict = {
        "0th": {
            piexif.ImageIFD.DateTime: b"not a date",
        }
    }

    create_image_with_exif(img_path, exif_dict)

    result = extract_exif_data(img_path)

    assert result["date"] is None
    assert result["timestamp"] is None


def test_exception_returns_empty_dict(isolated_base_dir):
    """
    Force an exception during Image.open to ensure
    the function fails safely.
    """

    img_path = isolated_base_dir / "broken.jpg"
    img_path.write_text("not an image")

    result = extract_exif_data(img_path)

    assert result == {}
