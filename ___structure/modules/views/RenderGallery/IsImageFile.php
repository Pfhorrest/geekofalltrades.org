<?php
/**
 * Check if a given file is an image file
 *
 * @param string $path The file path to check
 * @return bool True if the file is an image, false otherwise
 */
function is_image_file(string $path): bool
{
    $rootpath = rtrim($GLOBALS['rootpath'], '/') . '/';
    $fullpath = $rootpath . ltrim($path, '/');
    return is_file($fullpath) && is_readable($fullpath) && @exif_imagetype($fullpath);
}
?>