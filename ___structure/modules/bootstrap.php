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

/* Resolver modules */
require_once __DIR__ . '/resolvers/StylesForCrumb.php';
require_once __DIR__ . '/resolvers/ScriptsForCrumb.php';
require_once __DIR__ . '/resolvers/HeadForCrumb.php';
require_once __DIR__ . '/resolvers/TitleResolution.php';
require_once __DIR__ . '/resolvers/MainResolution.php';
require_once __DIR__ . '/resolvers/LightboxShouldDisplay.php';

/* View modules */
require_once __DIR__ . '/views/RenderGallery.php';

?>