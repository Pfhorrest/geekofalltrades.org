<?php
    $protocol = ($_SERVER['HTTPS']) ? 'https' : 'http' ;
    $uri = $queryless ;
    $basepath = $_SERVER['DOCUMENT_ROOT'] . $uri ;

    echo '<div class="gallery expansive">';
    foreach ($images as $key => $image) {
        $filepath = (is_file($basepath.$image['filename']))
            ? $image['filename']
            : '__images/'.$image['filename'] ;
        $altpath = (is_file($basepath.$image['altlink']))
            ? $image['altlink']
            : '__images/'.$image['altlink'] ;
        $filenameParts = explode('.',$image['filename']);
        $filenameSuffix = array_pop($filenameParts);
        $filenameBase = implode($filenameParts);
        $thumbname = $filenameBase.'-thumb'.$filenameSuffix;
        $thumbpath = (is_file($basepath.$thumbname))
            ? $thumbname
            : ((is_file($basepath.'__images/'.$thumbname))
                ? '__images/'.$thumbname
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
                        ? ($uri.$altpath.'" rel="external"')
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