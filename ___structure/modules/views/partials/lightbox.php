<?php
	/**  
	 * The lightbox for users without Javascript enabled.
	 * 
	*/

    /* Determine the navigation (index, previous and next images) for a lightbox. */
    $lightbox_navigation = lightbox_navigation($images ?? [], $_GET['display'] ?? '');

    /* If there's not a file at the URL specified,
        try searching from _media/images/ instead */
    $lightbox_path = (is_file($rootpath.$_GET['display']))
        ? $_GET['display']
        : '_media/images/'.$_GET['display'] ;

    echo '<div id="lightbox" class="lightbox">
        <h2 id="caption"><span>'.strip_tags($_GET['title'] ?? '', '<i><em><b><strong>').'</span></h2>
        <img id="lightboxImage" src="'.$lightbox_path.'" alt="" />
        <nav class="displayControls">'
            .(
                !empty($lightbox_navigation)
                ? '<a class="prev" role="button" title="Previous image"
                    href="?display='.$lightbox_navigation['prev']['filename']
                    .'&title='.urldecode($lightbox_navigation['prev']['title']).'">
                        &#10094;
                    </a>'
                : ''
            ).
            '<a class="close cursor" role="button" title="Close image"
                href="'.$path.(isset($lightbox_navigation['index']) ? '#item'.$lightbox_navigation['index'] : '').'">
                &times;
            </a>'
            .(
                !empty($lightbox_navigation)
                ? '<a class="next" role="button" title="Next image"
                    href="?display='.$lightbox_navigation['next']['filename']
                    .'&title='.urldecode($lightbox_navigation['next']['title']).'">
                        &#10095;
                    </a>'
                : ''
            ).
        '</nav>
    </div>';
?>