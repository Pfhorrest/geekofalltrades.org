<?php

/**
 * Determine the navigation (previous and next images) for a lightbox.
 *
 * @param array $images An array of images, each being an associative array with at least a 'filename' key.
 * @param string $display The filename of the currently displayed image.
 * @return array An associative array with keys 'index', 'prev', and 'next'.
 */

function lightbox_navigation(?array $images, string $display): array
{
    $lightbox_navigation = ['index' => null, 'prev' => null, 'next' => null];

    foreach ($images as $key => $image) {
        if ($image['filename'] == $display) {
            $lightbox_navigation['index'] = $key;
            break;
        }
    }

    if ($lightbox_navigation['index'] !== null) {
        $lightbox_navigation['prev'] = $lightbox_navigation['index'] == 0
            ? $images[(array_key_last($images))]
            : $images[($lightbox_navigation['index'] - 1)];

        $lightbox_navigation['next'] = $lightbox_navigation['index'] == array_key_last($images)
            ? $images[0]
            : $images[($lightbox_navigation['index'] + 1)];
    }

    if ($lightbox_navigation['index'] === null) {
        return [];
    }

    return $lightbox_navigation;

}