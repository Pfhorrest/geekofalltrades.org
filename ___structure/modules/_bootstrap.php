<?php

/**
 * Bootstrap file to load all necessary modules.
 *
 */

/* Controller modules */
require_once __DIR__ . '/controllers/PathFromUrl.php';
require_once __DIR__ . '/controllers/SegmentsFromPath.php';
require_once __DIR__ . '/controllers/LightboxShouldDisplay.php';
require_once __DIR__ . '/controllers/TitleResolution.php';

/* Model modules */
require_once __DIR__ . '/models/RootDetermination.php';

/* View modules */
/* TBD */

?>