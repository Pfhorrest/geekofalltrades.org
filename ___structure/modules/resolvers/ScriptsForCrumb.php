<?php 

/**
 * Renders the script links for a given crumb if a scripts.js file exists
 * in the __scripts/ subdirectory of that crumb.
 * 
 * @param string $root The root path to the document structure.
 * @param string $crumb The crumb path relative to the root.
 * 
 * @return string The HTML script tags for the script, or an empty string
 *                if no stylesheet exists for the crumb.
 */

function scripts_for_crumb(string $root, string $crumb): string {
    /* Relative path to the scripts file from the crumb root */
    $scriptpath = $crumb . "__scripts/scripts.js";
    /* Absolute path to the scripts file on the server */
    $scriptfile = $root . $scriptpath;
    if (!is_file($scriptfile)) return '';
    /* Put modified date of scripts file in script src to prevent excessive cacheing */
    $scriptdated = $scriptpath . '?v=' . filemtime($scriptfile);
    return '<script src="' . $scriptdated . '" type="module"></script>';
}

?>