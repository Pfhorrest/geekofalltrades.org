<?php
    /**
     * Render a gallery of images.
     *
     * @param array $images An array of images to display in the gallery.
     *                      Each image is an associative array with keys:
     *                      - 'filename': The image file name (required).
     *                      - 'title': The title of the image (optional).
     *                      - 'description': A description of the image (optional).
     *                      - 'altlink': An alternate link for the image (optional).
     *                      - 'morelink': A link to a subgallery (optional).
     *                      - 'moretext': Text describing the subgallery (optional).
     *                      - 'morecount': Number of images in the subgallery (optional).
     * @return string The HTML markup for the gallery.
     */
    function render_gallery(array $images = []): string {
        $rootpath = rtrim($GLOBALS['rootpath'], '/') . '/';
        $path = trim($GLOBALS['path'], '/') . '/';
        $html = '';
        /* If no images are provided, search for images in the rootpath. */
        if(empty($images)) {
            foreach (scandir($rootpath) as $file) {
                if (!str_starts_with($file, '.') && !str_starts_with($file, '_') && !preg_match('/-thumb(?=\.[^.]+$)/', $file)) {
                    // $html .= '<p>'.$file.':
                    //     is_file? ('.is_file($rootpath.$file).')
                    //     is_image_file?: ['.is_image_file($rootpath.$file).']
                    //     is_dir? ('.is_dir($rootpath.$file).')
                    //     </p>';
                    $image = [
                        'title' => 'Untitled',
                        'description' => 'No description.'
                    ];
                    if (is_image_file($rootpath.$file)) {
                        if (empty($image['filename'])) {
                            $image['filename'] = $file;
                        }
                    } elseif (is_dir($rootpath.$file)) {
                        $subfiles_image_count = 0;
                        foreach (scandir($rootpath.$file) as $subfile) {
                            if (
                                !str_starts_with($subfile, '.') &&
                                !str_starts_with($subfile, '_') &&
                                !preg_match('/-thumb(?=\.[^.]+$)/', $subfile)
                            ) {
                                // $html .= '<p>-- '.$file.'/'.$subfile.':
                                //     is_file? ('.is_file($rootpath.$file.'/'.$subfile).')
                                //     is_image_file?: ['.is_image_file($rootpath.$file.'/'.$subfile).']
                                //     is_dir? ('.is_dir($rootpath.$file.'/'.$subfile).')
                                //     </p>';
                                if (
                                    is_image_file($rootpath.$file.'/'.$subfile)
                                ) {
                                    // $html .= "<!-- counted $rootpath$file/$subfile -->";
                                    $subfiles_image_count++;
                                    if (empty($image['filename'])) {
                                        $image['filename'] = $file.'/'.$subfile;
                                    }
                                } elseif (is_dir($rootpath.$file.'/'.$subfile)) {
                                    foreach (scandir($rootpath.$file.'/'.$subfile) as $grandfile) {
                                        if (
                                            !str_starts_with($grandfile, '.') &&
                                            !str_starts_with($grandfile, '_') &&
                                            !preg_match('/-thumb(?=\.[^.]+$)/', $grandfile)
                                        ) {
                                            // $html .= '<p>-- -- '.$file.'/'.$subfile.'/'.$grandfile.':
                                            //     is_file? ('.is_file($rootpath.$file.'/'.$subfile.'/'.$grandfile).')
                                            //     is_image_file?: ['.is_image_file($rootpath.$file.'/'.$subfile.'/'.$grandfile).']
                                            //     is_dir? ('.is_dir($rootpath.$file.'/'.$subfile.'/'.$grandfile).')
                                            //     </p>';
                                            if (is_image_file($rootpath.$file.'/'.$subfile.'/'.$grandfile)) {
                                                // $html .= "<!-- counted $rootpath$file/$subfile/$grandfile -->";
                                                $subfiles_image_count++;
                                                if (empty($image['filename'])) {
                                                    $image['filename'] = $file.'/'.$subfile.'/'.$grandfile;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (!empty($image['filename'])) {
                        if ($subfiles_image_count > 1) {
                            $image['morecount'] = ($subfiles_image_count);
                            $image['moretext'] = $segments[array_key_last($segments)] . '/' . $file;
                            $image['morelink'] = $file;
                        }
                        // $html .= "<!-- adding image for $rootpath$file -->";
                        $images[] = $image;
                    }
                }
            }
            // Reverse order and reindex
            $images = array_values(array_reverse($images));
        }

        // print_r($images);

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
                    <img src="'.(is_image_file($thumbpath) ? $thumbpath : $filepath).'" alt="">
                    <p class="description">'.
                        (!empty($image['description'])
                            ? $image['description']
                            : 'No description.'
                        ).
                    '</p>';
                    
                    // Handle "more" link logic
                    if (!empty($image['morelink'])) {
                        $count = subgallery_image_count($rootpath . $image['morelink']) ?: $image['morecount'] ?? 0;
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