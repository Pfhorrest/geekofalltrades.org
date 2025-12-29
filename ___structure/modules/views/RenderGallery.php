<?php
    function render_gallery(array $images = []): string {
        $rootpath = rtrim($GLOBALS['rootpath'], '/') . '/';
        $path = trim($GLOBALS['path'], '/') . '/';
        $html = '';
        /* If no images are provided, search for images in the rootpath. */
        if(empty($images)) {
            if (!function_exists('is_image_file')) {
                function is_image_file(string $path): bool
                {
                    return is_file($path) && is_readable($path) && @exif_imagetype($path);
                }
            }
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

        /**
         * Recursively count all images in a subgallery.
         *
         * @param string $subdir Path to the subgallery directory or __main.php file.
         * @return int Total number of images found (including nested subgalleries).
         */

        if (!function_exists('get_subgallery_image_count')) {
            function get_subgallery_image_count($subdir) {
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
                        $count += get_subgallery_image_count($nestedPath);
                    }
                }

                return $count;
            }
        }


        foreach ($images as $key => $image) {
            /**
             * Path to the file specified in $images array.
             * 
             * If the file doesn't exist at the rootpath, 
             * tries searching from _media/images/ instead.
             * 
             * @var string
             * @uses $rootpath
             * @uses $images
             */
            if (!isset($image['filename'])) {
                $image['filename'] = '';
            }
            $filepath = (is_file($rootpath.$image['filename']))
                ? $image['filename']
                : '_media/images/'.$image['filename'] ;

            /**
             * Path to the alternate link specified in $images array.
             * 
             * If the file doesn't exist at the rootpath, 
             * tries searching from _media/images/ instead.
             * 
             * @var string
             * @uses $rootpath
             * @uses $images
             */
            if (!isset($image['altlink'])) {
                $image['altlink'] = '';
            }
            $altpath = (is_file($rootpath.$image['altlink']))
                ? $image['altlink']
                : '_media/images/'.$image['altlink'] ;

            /**
             * Parts (root and suffix) of the filename specified in $images array.
             * 
             * @var array
             * @uses $images
             */
            $filenameParts = explode('.',$image['filename']);

            /**
             * Suffix of the filename specified in $images array.
             * 
             * @var string
             * @uses $filenameParts
             */
            $filenameSuffix = array_pop($filenameParts);

            /**
             * Base of the filename specified in $images array.
             * 
             * Depends on being defined after $filenameSuffix 
             * because that pops the suffix part off the end of $filenameParts.
             * 
             * @var string
             * @uses $filenameParts
             * @see $filenameSuffic
             */
            $filenameBase = implode($filenameParts);

            /**
             * Name of the thumbnail.
             * 
             * @var string
             * @uses $filenameBase
             * @uses $filenameSuffix
             */
            $thumbname = $filenameBase.'-thumb.'.$filenameSuffix;

            /**
             * Path to the thumbnail.
             * 
             * If the file doesn't exist at the rootpath, 
             * tries searching from _media/images/ instead.

            * @var string
            * @uses $filenameBase
            * @uses $filenameSuffix
            */
            $thumbpath = (is_file($rootpath.$thumbname))
                ? $thumbname
                : ((is_file($rootpath.'_media/images/'.$thumbname))
                    ? '_media/images/'.$thumbname
                    : $filepath);

            /* Need to install imagick on host
            if (!is_file($thumbpath) && is_file($filepath)) {
                $imagick = new Imagick(realpath($filepath));
                $imagick->setImageFormat('jpeg');
                $imagick->setImageCompression(Imagick::COMPRESSION_JPEG);
                $imagick->setImageCompressionQuality(90);
                $imagick->thumbnailImage(256, 256, true, false);
                file_put_contents($filenameBase.'-thumb.jpg', $imagick);
            }
            */

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
                    <img src="'.$thumbpath.'" alt="">
                    <p class="description">'.
                        (!empty($image['description'])
                            ? $image['description']
                            : 'No description.'
                        ).
                    '</p>';
                    
                    // Handle "more" link logic
                    if (!empty($image['morelink'])) {
                        $count = get_subgallery_image_count($rootpath . $image['morelink']) ?: $image['morecount'] ?? 0;
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