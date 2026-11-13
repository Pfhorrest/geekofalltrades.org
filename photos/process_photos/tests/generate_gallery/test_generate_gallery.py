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
# Existing generation tests
# -----------------------
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_single_image_full_metadata(mock_exif, mock_subject, mock_location, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)
    mock_exif.return_value = {
        "camera": "Canon EOS",
        "date": "2024-01-01",
        "gps": (34.4, -119.7),
        "timestamp": "2024-01-01T23:59:59",
        "focal_length": 50,
        "f_number": 1.8,
        "iso": 100,
        "shutter": 0.002,
        "lens": None,
    }
    mock_subject.return_value = "moon jelly"
    mock_location.return_value = ["at Mission Canyon"]
    result = generate_gallery(tmp_path)
    assert result[0]["title"] == "Moon Jelly at Mission Canyon"
    assert result[0]["subjects"] == "moon jelly"
    assert result[0]["locations"] == "at Mission Canyon"
    assert result[0]["description"] == "Canon EOS, 2024-01-01"
    assert result[0]["filename"] == "photo.jpg"
    assert result[0]["times"] == "winter, night"
    assert result[0]["technicals"] == "Canon EOS, 50mm, f/1.8, ISO 100, 1/500s"


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_times_without_gps(mock_exif, mock_subject, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)
    mock_exif.return_value = {"timestamp": "2024-06-21T06:30:00"}
    mock_subject.return_value = "oak tree"
    result = generate_gallery(tmp_path)
    # Season should always be present; time of day absent without GPS
    assert result[0]["times"] == "summer"


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_technicals_without_optional_fields(mock_exif, mock_subject, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)
    mock_exif.return_value = {
        "camera": "Canon EOS",
        "timestamp": None,
        "focal_length": None,
        "f_number": None,
        "iso": None,
        "shutter": None,
        "lens": None,
    }
    mock_subject.return_value = "oak tree"
    result = generate_gallery(tmp_path)
    assert result[0]["technicals"] == "Canon EOS"


@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_subject_only(mock_exif, mock_subject, tmp_path):
    img = tmp_path / "photo.jpg"
    touch(img)
    mock_exif.return_value = {"timestamp": None}
    mock_subject.return_value = "oak tree"
    result = generate_gallery(tmp_path)
    assert result[0]["title"] == "Oak Tree"
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
    mock_location.return_value = ["in Santa Barbara"]
    mock_subject.return_value = None
    result = generate_gallery(tmp_path)
    assert result[0]["title"] == "Santa Barbara"


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


# -----------------------
# Retroactive maintenance tests
# -----------------------
@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_retroactive_enrichment_preserves_existing_values_and_custom_keys(
    mock_exif, mock_location, mock_subject, mock_parse, tmp_path
):
    photo = tmp_path / "photo.jpg"
    touch(photo)
    main_path = tmp_path / "__main.php"
    original_php = """<?php
$images = array(
    array('filename' => 'photo.jpg'),
);
echo render_gallery($images);
?>
"""
    main_path.write_text(original_php, encoding="utf-8")

    existing = {
        "filename": "photo.jpg",
        "title": "My manually curated title",
        "custom": "keep this",
    }
    mock_parse.return_value = [existing]
    mock_exif.return_value = {
        "camera": "Canon EOS",
        "date": "2024-01-01",
        "timestamp": "2024-06-21T06:30:00",
        "gps": None,
        "focal_length": 50,
    }
    mock_subject.return_value = "oak tree"
    mock_location.return_value = []

    result = generate_gallery(tmp_path, retroactive=True)

    assert result is True
    mock_parse.assert_called_once_with(main_path)

    updated_php = main_path.read_text(encoding="utf-8")
    assert "'title' => 'My manually curated title'" in updated_php
    assert "'custom' => 'keep this'" in updated_php
    assert "'description' => 'Canon EOS, 2024-01-01'" in updated_php
    assert "'subjects' => 'oak tree'" in updated_php
    assert "'times' => 'summer'" in updated_php
    assert "'technicals' => 'Canon EOS, 50mm'" in updated_php
    assert "'_sort_timestamp' => '2024-06-21T06:30:00'" in updated_php
    assert "echo render_gallery($images);" in updated_php


@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
def test_retroactive_maintenance_refuses_to_write_if_parser_loses_entries(
    mock_parse, tmp_path
):
    main_path = tmp_path / "__main.php"
    original_php = """<?php
$images = array(
    array('filename' => 'first.jpg'),
    array('filename' => 'second.jpg'),
);
echo render_gallery($images);
?>
"""
    main_path.write_text(original_php, encoding="utf-8")
    mock_parse.return_value = [{"filename": "first.jpg"}]

    result = generate_gallery(tmp_path, retroactive=True)

    assert result is False
    assert main_path.read_text(encoding="utf-8") == original_php


@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
def test_retroactive_maintenance_preserves_entries_without_local_files(
    mock_parse, tmp_path
):
    main_path = tmp_path / "__main.php"
    original_php = """<?php
$images = array(
    array(
        'filename' => 'manually-added.jpg',
        'custom' => 'retain',
    ),
);
echo render_gallery();
?>
"""
    main_path.write_text(original_php, encoding="utf-8")
    mock_parse.return_value = [
        {"filename": "manually-added.jpg", "custom": "retain"},
    ]

    result = generate_gallery(tmp_path, retroactive=True)

    # No metadata or ordering changed, so there is no reason to rewrite the file.
    assert result is False
    updated_php = main_path.read_text(encoding="utf-8")
    assert "'filename' => 'manually-added.jpg'" in updated_php
    assert "'custom' => 'retain'" in updated_php
    assert "echo render_gallery();" in updated_php


@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_retroactive_enrichment_skips_generation_for_existing_fields(
    mock_exif, mock_location, mock_subject, mock_parse, tmp_path
):
    photo = tmp_path / "photo.jpg"
    touch(photo)
    main_path = tmp_path / "__main.php"
    original_php = """<?php
$images = array(
    array('filename' => 'photo.jpg'),
);
echo render_gallery($images);
?>
"""
    main_path.write_text(original_php, encoding="utf-8")
    mock_parse.return_value = [{
        "filename": "photo.jpg",
        "title": "Existing title",
        "description": "Existing description",
        "subjects": "existing subject",
        "locations": "at Existing Place",
        "times": "summer",
        "technicals": "Existing camera details",
        "_sort_timestamp": "2024-06-21T06:30:00",
    }]

    result = generate_gallery(tmp_path, retroactive=True)

    assert result is False
    mock_exif.assert_not_called()
    mock_subject.assert_not_called()
    mock_location.assert_not_called()
    assert main_path.read_text(encoding="utf-8") == original_php


@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_retroactive_enrichment_generates_only_missing_subjects(
    mock_exif, mock_location, mock_subject, mock_parse, tmp_path
):
    photo = tmp_path / "photo.jpg"
    touch(photo)
    main_path = tmp_path / "__main.php"
    main_path.write_text(
        "<?php $images = array(array('filename' => 'photo.jpg')); ?>",
        encoding="utf-8",
    )
    mock_parse.return_value = [{
        "filename": "photo.jpg",
        "title": "Existing title",
        "description": "Existing description",
        "locations": "at Existing Place",
        "times": "summer",
        "technicals": "Existing camera details",
        "_sort_timestamp": "2024-06-21T06:30:00",
    }]
    mock_subject.return_value = "new subject"

    result = generate_gallery(tmp_path, retroactive=True)

    assert result is True
    mock_subject.assert_called_once_with(photo)
    mock_exif.assert_not_called()
    mock_location.assert_not_called()
    assert "'subjects' => 'new subject'" in main_path.read_text(encoding="utf-8")


@patch("process_photos.generate_gallery.generate_gallery.parse_images_from_php")
@patch("process_photos.generate_gallery.generate_gallery.identify_subject")
@patch("process_photos.generate_gallery.generate_gallery.identify_location")
@patch("process_photos.generate_gallery.generate_gallery.extract_exif_data")
def test_retroactive_enrichment_generates_only_missing_exif_metadata(
    mock_exif, mock_location, mock_subject, mock_parse, tmp_path
):
    photo = tmp_path / "photo.jpg"
    touch(photo)
    main_path = tmp_path / "__main.php"
    main_path.write_text(
        "<?php $images = array(array('filename' => 'photo.jpg')); ?>",
        encoding="utf-8",
    )
    mock_parse.return_value = [{
        "filename": "photo.jpg",
        "title": "Existing title",
        "description": "Existing description",
        "subjects": "existing subject",
        "locations": "at Existing Place",
        "times": "summer",
        "_sort_timestamp": "2024-06-21T06:30:00",
    }]
    mock_exif.return_value = {
        "camera": "Canon EOS",
        "focal_length": 50,
        "timestamp": "2024-06-21T06:30:00",
    }

    result = generate_gallery(tmp_path, retroactive=True)

    assert result is True
    mock_exif.assert_called_once_with(photo)
    mock_subject.assert_not_called()
    mock_location.assert_not_called()
    assert "'technicals' => 'Canon EOS, 50mm'" in main_path.read_text(encoding="utf-8")
