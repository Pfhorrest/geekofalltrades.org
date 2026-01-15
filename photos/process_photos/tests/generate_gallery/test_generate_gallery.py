import pytest
from pathlib import Path
from unittest.mock import patch

from process_photos.generate_gallery.generate_gallery import generate_gallery


# -----------------------
# Helpers
# -----------------------

def touch(path: Path):
    path.write_text("fake")


# -----------------------
# Tests
# -----------------------

@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_single_image_full_metadata(
    mock_exif, mock_subject, mock_location, tmp_path
):
    img = tmp_path / "photo.jpg"
    touch(img)

    mock_exif.return_value = {
        "camera": "Canon EOS",
        "date": "2024-01-01",
        "gps": (34.4, -119.7),
        "timestamp": "2024-01-01T12:00:00",
    }
    mock_subject.return_value = "moon jelly"
    mock_location.return_value = ("Mission Canyon", "at")

    result = generate_gallery(tmp_path)

    assert result == [
        {
            "maybe": "Moon Jelly at Mission Canyon",
            "alternatives": "moon jelly",
            "description": "Canon EOS, 2024-01-01",
            "filename": "photo.jpg",
        }
    ]


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_subject_only(mock_exif, mock_subject, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)

    mock_exif.return_value = {"timestamp": None}
    mock_subject.return_value = "oak tree"

    result = generate_gallery(tmp_path)

    assert result[0]["maybe"] == "Oak Tree"
    assert "description" not in result[0]

@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_location_only(mock_exif, mock_location, mock_subject, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)

    mock_exif.return_value = {
        "gps": (34.4, -119.7),
        "timestamp": None,
    }
    mock_location.return_value = ("Santa Barbara", "in")
    mock_subject.return_value = None

    result = generate_gallery(tmp_path)

    assert result[0]["maybe"] == "Santa Barbara"


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_skip_thumbnail_and_non_images(mock_exif, mock_subject, tmp_path):
    touch(tmp_path / "image-thumb.jpg")
    touch(tmp_path / "document.txt")
    touch(tmp_path / "real.jpg")

    mock_exif.return_value = {"timestamp": None}
    mock_subject.return_value = None

    result = generate_gallery(tmp_path)

    assert len(result) == 1
    assert result[0]["filename"] == "real.jpg"


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_sorting_by_timestamp(mock_exif, mock_subject, tmp_path):
    img1 = tmp_path / "a.jpg"
    img2 = tmp_path / "b.jpg"
    touch(img1)
    touch(img2)

    def fake_exif(path):
        if path.name == "a.jpg":
            return {"timestamp": "2024-01-01T10:00:00"}
        return {"timestamp": "2025-01-01T10:00:00"}
    mock_exif.side_effect = fake_exif
    mock_subject.return_value = None

    result = generate_gallery(tmp_path)

    assert result[0]["filename"] == "b.jpg"
    assert result[1]["filename"] == "a.jpg"


def test_empty_directory_returns_none(tmp_path):
    result = generate_gallery(tmp_path)
    assert result is None
