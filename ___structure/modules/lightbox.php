<?php
    $item_id = 0;
    if ($images) {
        foreach ($images as $key => $image) {
            if ($image['filename'] == $display) {
                $item_id = $key;
            }
        }
        $display = (is_file($basepath.$display))
            ? $display
            : '_media/images/'.$display ;
        $prev = $images[($item_id - 1)];
        $next = $images[($item_id + 1)];
    }
    echo '<figure class="display">
        <h2>'.$_GET["title"].'</h2>
        <img src="'.$display.'" alt="" />
        <nav class="displayControls">'
            .(
                $images
                ? '<a class="prev"
                    href="?display='.$prev['filename']
                    .'&title='.urldecode($prev['title']).'">
                        &#10094;
                    </a>'
                : ''
            ).
            '<a class="close cursor"
                href="'.$path.'#item'.$item_id.'">
                &times;
            </a>'
            .(
                $images
                ? '<a class="next"
                    href="?display='.$next['filename']
                    .'&title='.urldecode($next['title']).'">
                        &#10095;
                    </a>'
                : ''
            ).
        '</nav>
    </figure>';
?>