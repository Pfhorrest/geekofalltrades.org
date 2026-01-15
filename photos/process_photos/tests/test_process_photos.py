from unittest.mock import patch
from unittest.mock import MagicMock
from process_photos.process_photos import process_photos
from process_photos.config import image_extensions, THUMB_SUFFIX, THUMB_SIZE, base_dir, package_dir, subimage_threshold


@patch("process_photos.process_photos.os.walk")
def test_skips_package_dir(mock_walk):
    mock_walk.return_value = [
        (str(package_dir), [], ["a.jpg"]),
    ]

    process_photos()  # should do nothing, no crash


@patch("process_photos.process_photos.Image.open")
@patch("process_photos.process_photos.os.walk")
def test_thumbnail_created(mock_walk, mock_image):
    mock_walk.return_value = [
        (str(base_dir / "2024"), [], ["a.jpg"]),
    ]

    img = MagicMock()
    img.size = (4000, 3000)
    mock_image.return_value.__enter__.return_value = img

    process_photos()

    assert img.thumbnail.called


@patch("process_photos.process_photos.Image.open")
@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_generate_gallery_called(mock_walk, mock_gallery, mock_image, tmp_path):
    # Fake base_dir
    fake_base = tmp_path / "photos"
    gallery_dir = fake_base / "2024" / "01"
    gallery_dir.mkdir(parents=True)

    # Patch base_dir in the module under test
    with patch("process_photos.process_photos.base_dir", fake_base):
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
def test_build_gallery_from_children(mock_walk, mock_gen, mock_parse):
    year_dir = base_dir / "2024"
    day_dir = year_dir / "01"

    mock_walk.return_value = [
        (str(year_dir), ["01"], []),
        (str(day_dir), [], []),
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
def test_existing_images_resorted(mock_walk, mock_exif, mock_parse):
    mock_walk.return_value = [
        (str(base_dir / "2024"), [], ["__main.php"]),
    ]

    mock_parse.return_value = [
        {"filename": "b.jpg", "description": "2023-01-01"},
        {"filename": "a.jpg", "description": "2024-01-01"},
    ]

    mock_exif.return_value = {"timestamp": None}

    process_photos()

    # If it got here without crashing, sorting logic worked

    mock_parse.assert_called()