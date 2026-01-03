<?php
    /**
     * Render a gallery of images.
     *
     * @param array $images An array of images to display in the gallery.
     *                      Each image is an associative array with keys:
     *                      - 'filename': The image file name (required).
     *                      - 'title': The title of the image (optional).
     *                      - 'maybe': A guess at the image content (optional).
     *                      - 'description': A description of the image (optional).
     *                      - 'altlink': An alternate link for the image (optional).
     *                      - 'morelink': A link to a subgallery (optional).
     *                      - 'moretext': Text describing the subgallery (optional).
     *                      - 'morecount': Number of images in the subgallery (optional).
     * @return string The HTML markup for the gallery.
     */
    function render_gallery(array $images = []): string
    {
        $rootpath = rtrim($GLOBALS['rootpath'], '/') . '/';
        $path = trim($GLOBALS['path'], '/') . '/';
        $html = '';
        /* If no images are provided, search for images in the current path. */
        if(empty($images)) {
            $images = images_discovered($rootpath)['images'];
        }
        $html .= '<div class="gallery expansive">';
        foreach ($images as $key => $image) {
            $filepath = image_path_resolution($image['filename'] ?? '');
            $altpath = image_path_resolution($image['altlink'] ?? '');
            $thumbpath = image_path_resolution(preg_replace('/(?=\.[^.]+$)/', '-thumb', $image['filename'] ?? ''));
            $html .= '
                <div class="item" id="item'.$key.'">
                    <p class="title">'.
                        (!empty($image['title'])
                            ? $image['title']
                            : 'Untitled' .
                                (!empty($image['maybe'])
                                    ? '<span class="maybe">(Maybe: '.$image['maybe'].')</span>'
                                    : '')
                        ).
                    '</p>
                    <img src="'.(is_image_file($rootpath.$thumbpath) ? $thumbpath : $filepath).'" alt="">
                    <p class="description">'.
                        (!empty($image['description'])
                            ? $image['description']
                            : 'No description.'
                        ).
                    '</p>';
                    
                    // Handle "more" link logic
                    if (!empty($image['morelink'])) {
                        $count = subgallery_image_count($rootpath . $image['morelink']) ?? $image['morecount'] ?? 0;
                        if ($count > 0) {
                            $count_text = ($count - 1) . ' more';
                            $from_text = (!empty($image['moretext'])) ? ' from ' . $image['moretext'] : '' ;
                            $html .= '
                            <p class="more">
                                <a href="/'.$path.$image['morelink'].'">'
                                    .$count_text.$from_text.
                                '</a>
                            </p>';
                        } else {
                            // No images found in subgallery
                            $html .= '
                            <p class="more">
                                <a href="/'.$path.$image['morelink'].'">More'.
                                    (!empty($image['moretext']) ? ' from ' . $image['moretext'] : '').
                                '</a>
                            </p>';
                        }
                        // If exactly one item, skip (erroneous)
                    }

                    $html .= '
                    <a class="cover" href="'.(
                        !empty($image['altlink'])
                            ? ($path.$altpath.'" rel="external"')
                            : ('?display='.$image['filename'].'&title='.urlencode((string)($image['title'] ?? "Maybe: ".$image['maybe'])).'"')
                    ).'>
                        View '.(!empty($image['title']) ? $image['title'] : 'Untitled').'
                    </a>
                </div>
            ';
        }
        unset($image);
        $html .= '</div>';
        return $html;
    }
?>