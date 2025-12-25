<?php

/**
 * Includes the head file for a given crumb if it exists.
 * 
 * @param string $root The root path to the document structure.
 * @param string $crumb The crumb path relative to the root.
 * @return string The path to the head file if it exists, otherwise an empty string.
 */

function head_path_for_crumb(string $root, string $crumb): string {
    $headpath = $root . $crumb . "__head.php";
    return (is_file($headpath)) ? $headpath : '';
}

?>