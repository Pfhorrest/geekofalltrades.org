<?php

/**
 * Bootstrap file to load all necessary modules.
 *
 */

/* Controller modules */
require_once __DIR__ . '/models/RootDetermination.php';
require_once __DIR__ . '/controllers/PathFromURL.php';
require_once __DIR__ . '/controllers/SegmentsFromPath.php';
require_once __DIR__ . '/models/CrumbsFromSegments.php';
require_once __DIR__ . '/controllers/TitleResolution.php';
require_once __DIR__ . '/controllers/LightboxShouldDisplay.php';

/* Model modules */
/* TBD */

/* View modules */
/* TBD */

?>