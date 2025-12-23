<?php

/**
 * Convert a path string into an array of its segments.
 *
 * Examples:
 *  "/"                → []
 *  "/photos"          → ["photos"]
 *  "/photos/2019/03/" → ["photos", "2019", "03"]
 *  "/a//b///c/"       → ["a", "b", "c"]
 * 
 * @param string $path The path string to convert.
 * @return array An array of path segments.
 *
 */

function path_to_segments(string $path): array
{
    return array_values(
        array_filter(
            explode('/', $path),
            fn ($segment) => $segment !== ''
        )
    );
}
