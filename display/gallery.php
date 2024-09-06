<?php
    if ($_SERVER['HTTPS']) {
        $protocol = 'https' ;
    } else {
        $protocol = 'http' ;
    }
    $basepath = $protocol
        . '://'
        . $_SERVER['SERVER_NAME']
        . dirname($_SERVER['PHP_SELF'])
        . '/' ;

    echo '<div class="gallery expansive">';
    foreach ($images as $image) {
        $filepath = (is_file($image['filename']))
            ? $image['filename']
            : 'images/'.$image['filename'] ;
        $altpath = (is_file($image['altlink']))
            ? $image['altlink']
            : 'images/'.$image['altlink'] ;
        $filenameParts = explode('.',$image['filename']);
        $filenameSuffix = array_pop($filenameParts);
        $filenameBase = implode($filenameParts);
        $thumbname = $filenameBase.'-thumb.jpg';
        $thumbpath = (is_file($thumbname))
            ? $thumbname
            : ((is_file('images/'.$thumbname))
                ? 'images/'.$thumbname
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
            <div class=item>
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
                                ? ' href="'.$basepath.$image['morelink'].'"'
                                : ''
                            ).'>'
                                .$image['moretext'].
                            '</a>
                        </p>'
                    : ''
                ).'
                <a class=cover
                    href="'.(($image['altlink'])
                        ? $basepath.$altpath.'" rel="external"'
                        : '/display/?image='.$basepath.$filepath
                            .'&title='.urlencode($image['title']).'"'
                    ).'>
                    View '.$image['title'].'
                </a>
            </div>
        ';
    }
    unset($image);
    echo '</ul>';
?>