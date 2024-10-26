<?php
    echo '<section>
        <h2>'.$path.'</h2>
        <p class="description">Directory Listing</p>
        <ul>';
        /** 
         * Files in the current directory.
         * 
         * @var array
         * @uses $rootpath
         */
        $files = scandir($rootpath);
        foreach ($files as $file) {
            echo '<li>
                <a href="'.$path.$file.'">'
                .$file.
                '</a>
            </li>';
        }
    echo '</ul>
    </section>';
?>