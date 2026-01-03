<?php

/**
 * Discover images in a directory.
 *
 * @param string $path The directory to search for images.
 * @return array An array of image file paths.
 */
function images_discovered(string $path): array
{
    $segments = array_filter(explode('/', $path));
    $path = rtrim($path, '/') . '/';

    $result = [
        'images' => [],
        'count' => 0,
    ];

    foreach (scandir($path) as $file) {
        if (
            str_starts_with($file, '.') ||
            str_starts_with($file, '_') ||
            preg_match('/-thumb(?=\.[^.]+$)/', $file)
        ) {
            continue;
        }

        $image = [
            'title' => $file,
            'description' => 'No description.',
        ];

        /* Leaf image */
        if (is_image_file($path.$file)) {
            $image['filename'] = $file;
            $result['images'][] = $image;
            $result['count']++;
            continue;
        } 

        /* Subgallery */
        if (is_dir($path.$file)) {
            $subdir = $path . $file . '/';
            $sub = images_discovered($subdir);

            if (!empty($sub['images'])) {
                $image['title'] = $sub['images'][0]['filename'];
                $image['filename'] = $file.'/'.$sub['images'][0]['filename'];

                if ($sub['count'] > 1) {
                    $image['morecount'] = $sub['count'];
                    $image['moretext'] = $segments[array_key_last($segments)] . '/' . $file;
                    $image['morelink'] = $file;
                }

                $result['images'][] = $image;
                $result['count'] += $sub['count'];
            }
        }
    }
    // Reverse order and reindex
    $result['images'] = array_values(array_reverse($result['images']));
    return $result;
}
?>