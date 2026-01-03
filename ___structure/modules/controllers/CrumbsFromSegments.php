<?php
/**
 * Generate an array of crumbs from path segments
 *
 * @param array $segments The path segments
 * @return array The array of crumbs
 */
function crumbs_from_segments(array $segments): array {
    $crumbs = ['/'];

    foreach ($segments as $segment) {
        $last = $crumbs[array_key_last($crumbs)];
        $crumb = $last . $segment;
        $crumbs[] = $crumb . '/';
    }

    return $crumbs;
}
?>