<?php
    $errorSegments = $segments;
    array_pop($errorSegments);
    $parentPath = implode("/", $errorSegments);
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