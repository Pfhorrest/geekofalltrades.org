from process_photos.parse_images_from_php import parse_images_from_php

def test_parse_images_basic(tmp_path):
    php = tmp_path / "__main.php"
    php.write_text("""
    <?php
    $images = array(
        array(
            'filename' => 'a.jpg',
            'maybe' => 'Cat',
            'description' => 'Nikon'
        ),
        array(
            'filename' => 'b.jpg',
            'maybe' => 'Dog'
        ),
    );
    """)

    images = parse_images_from_php(php)

    assert len(images) == 2
    assert images[0]["filename"] == "a.jpg"
    assert images[1]["maybe"] == "Dog"


def test_escaped_quotes(tmp_path):
    php = tmp_path / "__main.php"
    php.write_text("""
    <?php
    $images = array(
        array(
            'maybe' => 'Cat\\'s Cradle',
            'filename' => 'cat.jpg'
        ),
    );
    """)

    images = parse_images_from_php(php)

    assert images[0]["maybe"] == "Cat's Cradle"


def test_no_images_array(tmp_path):
    php = tmp_path / "__main.php"
    php.write_text("<?php echo 'hello';")

    images = parse_images_from_php(php)

    assert images == []


def test_empty_images_array(tmp_path):
    php = tmp_path / "__main.php"
    php.write_text("<?php $images = array();")

    images = parse_images_from_php(php)

    assert images == []


def test_invalid_php_does_not_crash(tmp_path):
    php = tmp_path / "__main.php"
    php.write_text("<?php $images = array(")  # truncated

    images = parse_images_from_php(php)

    assert images == []
