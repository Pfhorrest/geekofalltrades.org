<?php

/**
 * Bootstrap file to load all necessary modules.
 *
 */

/* Controller modules */
require_once __DIR__ . '/controllers/RootDetermination.php';
require_once __DIR__ . '/controllers/PathFromURL.php';
require_once __DIR__ . '/controllers/SegmentsFromPath.php';
require_once __DIR__ . '/controllers/CrumbsFromSegments.php';
require_once __DIR__ . '/controllers/TitleResolution.php';
require_once __DIR__ . '/controllers/LightboxShouldDisplay.php';
require_once __DIR__ . '/controllers/HeadForCrumb.php';

/* Model modules */
/* TBD */

/* View modules */
require_once __DIR__ . '/views/RenderStylesForCrumb.php';
require_once __DIR__ . '/views/RenderScriptsForCrumb.php';

?>