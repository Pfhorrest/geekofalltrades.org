<?php
    echo '<div class="gallery expansive">';
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
        $thumbname = $filenameBase.'-thumb'.$filenameSuffix;

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

        echo '
            <div class=item id="item'.$key.'">
                <p class=title>'.$image['title'].'</p>
                <img src="'.$thumbpath.'"
                    alt="">
                <p class=description>
                    '.$image['description'].'
                </p>'
                .(
                    $image['moretext']
                    ?   '<p class=more>
                            <a'.(
                                ($image['morelink'])
                                ? ' href="'.$_SERVER['REQUEST_URI'].$image['morelink'].'"'
                                : ''
                            ).'>'
                                .$image['moretext'].
                            '</a>
                        </p>'
                    : ''
                ).'
                <a class=cover
                    href="'.(($image['altlink'])
                        ? ($path.$altpath.'" rel="external"')
                        : (
                            '?display='.$image['filename']
                            .'&title='.urlencode($image['title'])
                            .'"')
                    ).'>
                    View '.$image['title'].'
                </a>
            </div>
        ';
    }
    unset($image);
    echo '</ul>';
?>