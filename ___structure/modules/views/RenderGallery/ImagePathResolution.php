<?php
/**
 * Resolve the correct image path, checking both the provided path
 * and the fallback _media/images/ directory.
 *
 * @param string $filename The original image filename or path.
 * @return string Resolved image path.
 */
function image_path_resolution(string $filename): string
{
    $rootpath = rtrim($GLOBALS['rootpath'], '/') . '/';
    return (!empty($filename)
        ? is_file($rootpath.$filename)
            ? $filename
            : '_media/images/'.$filename
        : ''
    );
}
?>