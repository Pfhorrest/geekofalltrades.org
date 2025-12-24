<?php

function crumbs_from_segments(array $segments): array {
    $crumbs = ['/'];

    foreach ($segments as $segment) {
        $last = $crumbs[array_key_last($crumbs)];
        $crumb = $last . $segment;
        $crumbs[] = $crumb . '/';
    }

    return $crumbs;
}
