<?php
    echo '<section>
        <h2>'.$path.'</h2>
        <p class="description">Directory Listing</p>
        <ul>';
        $files = scandir($root . $path);
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