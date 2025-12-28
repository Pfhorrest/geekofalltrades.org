<?php

/**
 * Bootstrap file to load all necessary modules.
 *
 */

$modules = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(
        new DirectoryIterator(__DIR__),
    )
);

foreach ($modules as $module) {
    if (
            strpos($module->getPathname(), '.php') !== false
            &&
            strpos($module->getPathname(), '/modules/') !== false
            &&
            strpos($module->getPathname(), 'partials') === false
        )
    {
        require_once $module->getPathname();
    }
}

?>