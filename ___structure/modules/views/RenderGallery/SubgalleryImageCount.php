<?php
/**
 * Recursively count all images in a subgallery.
 *
 * @param string $subdir Path to the subgallery directory.
 * @return int Total number of images found (including nested subgalleries).
 */
function subgallery_image_count($subdir): int
{
    $mainfile = rtrim($subdir, '/').'/__main.php';
    if (!is_file($mainfile)) return 0;

    $content = file_get_contents($mainfile);
    if (!$content) return 0;

    $images = [];

    // Match render_gallery($images = array(...);
    if (preg_match('/\$images\s*=\s*array\s*\((.*)\);\s*/sU', $content, $matches)) {
        $arrayContent = $matches[1];

        // Match all individual image arrays: array(...)
        preg_match_all('/array\s*\((.*?)\),/s', $arrayContent, $imageBlocks);

        foreach ($imageBlocks[1] as $block) {
            $img = [];

            // Match key => value pairs with single quotes, handling escaped quotes
            preg_match_all("/'((?:\\\\'|[^'])+)'\s*=>\s*'((?:\\\\'|[^'])*)'/", $block, $kvMatches, PREG_SET_ORDER);

            foreach ($kvMatches as $kv) {
                $key = str_replace("\\'", "'", $kv[1]);
                $val = str_replace("\\'", "'", $kv[2]);
                $img[$key] = $val;
            }

            if ($img) {
                $images[] = $img;
            }
        }
    }

    // Count images, recursively counting nested subgallery 'morelink's
    $count = 0;
    foreach ($images as $img) {
        $count++;
        if (!empty($img['morelink'])) {
            $nestedPath = rtrim($subdir, '/').'/'.$img['morelink'];
            $count += subgallery_image_count($nestedPath);
        }
    }

    return $count;
}
?>