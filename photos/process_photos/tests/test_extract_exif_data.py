import pytest
from pathlib import Path
from PIL import Image
import piexif

from process_photos.extract_exif_data import extract_exif_data
from process_photos import extract_exif_data as module_under_test


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

def test_raises_if_file_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    missing = tmp_path / "missing.jpg"

    with pytest.raises(FileNotFoundError):
        extract_exif_data(missing)


def test_image_with_no_exif(tmp_path, monkeypatch):
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    img_path = tmp_path / "no_exif.jpg"
    create_image_with_exif(img_path)

    result = extract_exif_data(img_path)

    assert result == {
        "camera": None,
        "date": None,
        "gps": None,
        "timestamp": None,
    }


def test_extracts_camera_and_date(tmp_path, monkeypatch):
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    img_path = tmp_path / "camera_date.jpg"

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


def test_extracts_gps_coordinates(tmp_path, monkeypatch):
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    img_path = tmp_path / "gps.jpg"

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


def test_invalid_date_is_handled_gracefully(tmp_path, monkeypatch):
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    img_path = tmp_path / "bad_date.jpg"

    exif_dict = {
        "0th": {
            piexif.ImageIFD.DateTime: b"not a date",
        }
    }

    create_image_with_exif(img_path, exif_dict)

    result = extract_exif_data(img_path)

    assert result["date"] is None
    assert result["timestamp"] is None


def test_exception_returns_empty_dict(tmp_path, monkeypatch):
    """
    Force an exception during Image.open to ensure
    the function fails safely.
    """
    monkeypatch.setattr(module_under_test, "base_dir", tmp_path)

    img_path = tmp_path / "broken.jpg"
    img_path.write_text("not an image")

    result = extract_exif_data(img_path)

    assert result == {}
