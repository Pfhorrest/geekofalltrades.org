<?php
    echo '<div class="gallery expansive">';
    foreach ($images as $key => $image) {
        $filepath = (is_file($rootpath.$image['filename']))
            ? $image['filename']
            : '_media/images/'.$image['filename'] ;
        $altpath = (is_file($rootpath.$image['altlink']))
            ? $image['altlink']
            : '_media/images/'.$image['altlink'] ;
        $filenameParts = explode('.',$image['filename']);
        $filenameSuffix = array_pop($filenameParts);
        $filenameBase = implode($filenameParts);
        $thumbname = $filenameBase.'-thumb'.$filenameSuffix;
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