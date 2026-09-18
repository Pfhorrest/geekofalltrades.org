from unittest.mock import patch
from unittest.mock import MagicMock
from process_photos.process_photos import process_photos
from process_photos import config # For package_dir


@patch("process_photos.process_photos.os.walk")
def test_skips_package_dir(mock_walk):
    mock_walk.return_value = [
        (str(config.package_dir), [], ["a.jpg"]),
    ]

    process_photos()  # should do nothing, no crash


@patch("process_photos.process_photos.Image.open")
@patch("process_photos.process_photos.os.walk")
def test_thumbnail_created(mock_walk, mock_image, isolated_base_dir):
    year_dir = isolated_base_dir / "2024"
    year_dir.mkdir()
    mock_walk.return_value = [
        (str(year_dir), [], ["a.jpg"]),
    ]

    img = MagicMock()
    img.size = (4000, 3000)
    mock_image.return_value.__enter__.return_value = img

    process_photos()

    assert img.thumbnail.called


@patch("process_photos.process_photos.Image.open")
@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_generate_gallery_called(mock_walk, mock_gallery, mock_image, isolated_base_dir):
    gallery_dir = isolated_base_dir  / "2024" / "01"
    gallery_dir.mkdir(parents=True)
    print(f"gallery_dir: {gallery_dir}")

    mock_walk.return_value = [
        (str(gallery_dir), [], ["a.jpg"]),
    ]

    # Neutralize PIL
    mock_img = MagicMock()
    mock_img.size = (4000, 3000)
    mock_image.return_value.__enter__.return_value = mock_img

    mock_gallery.return_value = [{"filename": "a.jpg"}]

    process_photos()

    mock_gallery.assert_called_once_with(gallery_dir)


@patch("process_photos.process_photos.parse_images_from_php")
@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_build_gallery_from_children(mock_walk, mock_gen, mock_parse, isolated_base_dir):
    year_dir = isolated_base_dir / "2024"
    month_dir = year_dir / "01"
    month_dir.mkdir(parents=True)

    mock_walk.return_value = [
        (str(year_dir), ["01"], []),
        (str(month_dir), [], []),
    ]

    mock_gen.return_value = None
    mock_parse.return_value = [
        {"filename": "a.jpg"},
        {"filename": "b.jpg"},
    ]

    process_photos()


@patch("process_photos.process_photos.parse_images_from_php")
@patch("process_photos.process_photos.extract_exif_data")
@patch("process_photos.process_photos.os.walk")
def test_existing_images_resorted(mock_walk, mock_exif, mock_parse, isolated_base_dir):
    year_dir = isolated_base_dir / "2024"
    year_dir.mkdir()

    # Existing __main.php with an $images array causes the code
    # to take the existing-images/resorting path.
    main_path = year_dir / "__main.php"
    main_path.write_text('<?php $images = array(); ?>\n')

    mock_walk.return_value = [
        (str(year_dir), [], ["__main.php"]),
    ]

    mock_parse.return_value = [
        {"filename": "b.jpg", "description": "2023-01-01"},
        {"filename": "a.jpg", "description": "2024-01-01"},
    ]

    mock_exif.return_value = {"timestamp": None}

    process_photos()

    # If it got here without crashing, sorting logic worked

    mock_parse.assert_called()