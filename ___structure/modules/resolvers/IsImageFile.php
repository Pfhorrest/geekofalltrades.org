<?php
/**
 * Check if a given file is an image file
 *
 * @param string $path The file path to check
 * @return bool True if the file is an image, false otherwise
 */
function is_image_file(string $path): bool
{
    return is_file($path) && is_readable($path) && @exif_imagetype($path);
}
?>