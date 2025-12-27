<?php
    $safePath = rtrim($path, '/') . '/';
    $escapedPath = htmlspecialchars($safePath, ENT_QUOTES);
    echo '<section>
        <h2>'.$escapedPath.'</h2>
        <p class="description">Directory Listing</p>
        <ul>';
        /** 
         * Files in the current directory.
         * 
         * @var array
         * @uses $rootpath
         */
        $files = array_diff(scandir($rootpath), ['.']);
        foreach ($files as $file) {
            $escapedFile = htmlspecialchars($file, ENT_QUOTES);
            echo '<li>
                <a href="'.$safePath.$escapedFile.'">'
                .$escapedFile.
                '</a>
            </li>';
        }
    echo '</ul>
    </section>';
?>