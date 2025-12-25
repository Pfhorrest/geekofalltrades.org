<?php 

/**
 * Renders the style links for a given crumb if a styles.css file exists
 * in the __styles/ subdirectory of that crumb.
 * 
 * @param string $root The root path to the document structure.
 * @param string $crumb The crumb path relative to the root.
 * 
 * @return string The HTML link tags for the stylesheet, or an empty string
 *                if no stylesheet exists for the crumb.
 */

function render_styles_for_crumb(string $root, string $crumb): string {
    /* Relative path to the styles file from the crumb root */
    $stylepath = $crumb . "__styles/styles.css";
    /* Absolute path to the styles file on the server */
    $stylefile = $root . $stylepath;
    if (!is_file($stylefile)) return '';
    /* Put modified date of styles file in link href to prevent excessive cacheing */
    $styledated = $stylepath . '?v=' . filemtime($stylefile);
    /* Preload the styles file to prevent a flash of unstyled content */
    return '<link href="' . $styledated . '" rel="preload" as="style" />'
         . '<link href="' . $styledated . '" rel="stylesheet" />';
}

?>