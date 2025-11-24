<?php
    /** 
     * Segments of the external request path minus the last one
     * (to use for link back to "parent directory" in error message).
     * 
     * @var array
     * @uses $segments
     */
    $parentSegments = $segments;
    array_pop($parentSegments);

    /** 
     * Path to parent directory of requested file *or* directory
     * (to use for link back to "parent directory" in error message).
     * 
     * @var string
     * @uses $parentSegments
     */
    $parentPath = implode("/", $parentSegments);
    echo '<section>
        <h2>File Not Found</h2>
        <p class="description">No such file as '.$path.'</p>
        <p>
            You can try going <a href="javascript:history.back()">back</a>,
            or see if you can find what you\'re looking for in the
            <a href="/'.$parentPath.'">parent directory</a>.
        </p>
    </section>';
?>