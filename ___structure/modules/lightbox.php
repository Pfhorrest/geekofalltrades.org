<?php
	/**  
	 * The lightbox for users without Javascript enabled.
     * Takes $images array provided by gallery.php, if present,
     * and builds navigation arrows to cycle through them from that.
	 * 
	*/

	/**  
	 * Id of the image to view in $images.
	 * 
	 * @var string
	*/
    $item_id = 0;
    if ($images) {
        foreach ($images as $key => $image) {
            /**
             * The 'display' URL parameter (defined in html.php).
             * 
             *  @var string $display
            */
            if ($image['filename'] == $display) {
                /* Set the item_id to the key of the image array item
                   with a filename matching the 'display' URL parameter */
                $item_id = $key;
            }
        }

        /* If there's not a file URL specified,
           try searching from _media/images/ instead */
        $imagepath = (is_file($rootpath.$display))
            ? $display
            : '_media/images/'.$display ;

        /**
         * Link to the previous item in the gallery
         * (or if currently on the first item, link to the last item).
         * 
         *  @var int $prev
        */
        $prev = $item_id == 0
            ? $images[(array_key_last($images))]
            : $images[($item_id - 1)];

        /**
         * Link to the next item in the gallery
         * (or if currently on the last item, link to the first item).
         * 
         *  @var int $next
        */
        $next = $item_id == array_key_last($images)
            ? $images[0]
            : $images[($item_id + 1)];
    }
    echo '<div id="lightbox" class="lightbox">
        <h2 id="caption">'.$_GET["title"].'</h2>
        <img id="lightboxImage" src="'.$imagepath.'" alt="" />
        <nav class="displayControls">'
            .(
                $images
                ? '<a class="prev" role="button" title="Previous image">
                    href="?display='.$prev['filename']
                    .'&title='.urldecode($prev['title']).'">
                        &#10094;
                    </a>'
                : ''
            ).
            '<a class="close cursor" role="button" title="Close image"
                href="'.$path.'#item'.$item_id.'">
                &times;
            </a>'
            .(
                $images
                ? '<a class="next" role="button" title="Next image"
                    href="?display='.$next['filename']
                    .'&title='.urldecode($next['title']).'">
                        &#10095;
                    </a>'
                : ''
            ).
        '</nav>
    </div>';
?>