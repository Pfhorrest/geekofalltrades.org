<?php

/**
 * Determine whether to display the lightbox based on query parameters.
 *
 * @param array $query The query parameters from the request.
 * @return bool True if the lightbox should be displayed, false otherwise.
 */

function should_display_lightbox(array $query): bool
{
    if (!array_key_exists('display', $query)) {
        return false;
    }

    return filter_var(
        $query['display'],
        FILTER_VALIDATE_BOOLEAN,
        FILTER_NULL_ON_FAILURE
    ) === true;
}

?>