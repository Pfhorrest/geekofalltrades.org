from unittest.mock import MagicMock, patch

from process_photos import config  # For package_dir
from process_photos.process_photos import parse_arguments, process_photos


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

    process_photos(parse_arguments(["--retroactive"]))

    assert img.thumbnail.called


@patch("process_photos.process_photos.Image.open")
@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_generate_gallery_called(mock_walk, mock_gallery, mock_image, isolated_base_dir):
    gallery_dir = isolated_base_dir / "2024" / "01"
    gallery_dir.mkdir(parents=True)
    mock_walk.return_value = [
        (str(gallery_dir), [], ["a.jpg"]),
    ]

    # Neutralize PIL
    mock_img = MagicMock()
    mock_img.size = (4000, 3000)
    mock_image.return_value.__enter__.return_value = mock_img

    mock_gallery.return_value = [{"filename": "a.jpg"}]

    process_photos(parse_arguments(["--retroactive"]))

    mock_gallery.assert_called_once_with(gallery_dir, {"delay": 15})


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


@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_existing_gallery_delegates_retroactive_maintenance(
    mock_walk, mock_generate, isolated_base_dir
):
    gallery_dir = isolated_base_dir / "2024" / "01" / "02"
    gallery_dir.mkdir(parents=True)

    # Existing galleries are maintained by generate_gallery now; the
    # process module should delegate rather than parse/sort/write the array.
    main_path = gallery_dir / "__main.php"
    main_path.write_text("<?php $images = array(); ?>\\n", encoding="utf-8")

    mock_walk.return_value = [
        (str(gallery_dir), [], ["__main.php"]),
    ]

    process_photos(parse_arguments(["--retroactive"]))

    mock_generate.assert_called_once_with(
        gallery_dir, {"delay": 15}, retroactive=True
    )

@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_existing_month_gallery_skips_retroactive_enrichment(
    mock_walk, mock_generate, isolated_base_dir
):
    gallery_dir = isolated_base_dir / "2024" / "01"
    gallery_dir.mkdir(parents=True)

    main_path = gallery_dir / "__main.php"
    main_path.write_text(
        "<?php $images = array(); ?>\n",
        encoding="utf-8",
    )

    mock_walk.return_value = [
        (str(gallery_dir), [], ["__main.php"]),
    ]

    process_photos(parse_arguments(["--retroactive"]))

    mock_generate.assert_not_called()


@patch("process_photos.process_photos.generate_gallery")
@patch("process_photos.process_photos.os.walk")
def test_existing_year_gallery_skips_retroactive_enrichment(
    mock_walk, mock_generate, isolated_base_dir
):
    gallery_dir = isolated_base_dir / "2024"
    gallery_dir.mkdir(parents=True)

    main_path = gallery_dir / "__main.php"
    main_path.write_text(
        "<?php $images = array(); ?>\n",
        encoding="utf-8",
    )

    mock_walk.return_value = [
        (str(gallery_dir), [], ["__main.php"]),
    ]

    process_photos(parse_arguments(["--retroactive"]))

    mock_generate.assert_not_called()