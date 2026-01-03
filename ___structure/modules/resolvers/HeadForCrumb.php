<?php
/**
 * Extracts metadata from the head file for a given crumb.
 * 
 * @param string $root The root path to the document structure.
 * @param string $crumb The crumb path relative to the root.
 * @return array An associative array of metadata extracted from the head file.
 */
function head_for_crumb(string $root, string $crumb): array {
    $headpath = $root . $crumb . "__head.php";
    if (!$headpath || !is_file($headpath)) return [];
    $vars = (function () use ($headpath) {
        include $headpath;
        return get_defined_vars();
    })();
    unset ($vars['headpath']);
    return $vars;
}
?>