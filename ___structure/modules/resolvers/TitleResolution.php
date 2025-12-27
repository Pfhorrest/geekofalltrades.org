<?php

/**
 * Determine the page title based on various inputs.
 *
 * Priority:
 * 1. Query string 'title' parameter
 * 2. Meta title set in __head.php
 * 3. Breadcrumb-style title from URL segments
 * 4. Domain name
 * 5. "Untitled" fallback
 *
 * @param string $domain_name The domain name of the site.
 * @param array $segments The URL path segments.
 * @param string $meta_title The meta title if set.
 * @param array $query The query string parameters.
 * @param string $tagline_suffix An optional tagline suffix to append.
 * @return string The resolved page title.
 */

function title_resolution(
    string $domain_name = '',
    array $segments = [],
    string $meta_title = '',
    array $query = [],
    string $tagline_suffix = ''
): string {

    $title = '';

    // 1. Query string override
    if (!empty($query['title'])) {
        $title = trim(htmlspecialchars($query['title'], ENT_QUOTES));
    }
    // 2. Title set by __head.php cascade
    elseif (!empty($meta_title)) {
        $title = trim($meta_title);
    }
    // 3. Breadcrumb fallback
    elseif (!empty($segments)) {
        $parts = array_map(fn($segment) => ucfirst($segment), $segments);
        $title = trim(implode(' → ', $parts));
    }
    // 4. Domain name fallback
    elseif (!empty($domain_name)) {
        $title = trim($domain_name);
    }
    // 5. Untitled fallback
    else {
        $title = 'Untitled';
    }

    return trim($title . ' ' . $tagline_suffix);

}