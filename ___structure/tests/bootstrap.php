<?php
declare(strict_types=1);

// Always load Composer autoloader first
require_once __DIR__ . '/../../vendor/autoload.php';

// Project root
define('PROJECT_ROOT', realpath(__DIR__ . '/..'));

// Manually load app code (for now)
require_once PROJECT_ROOT . '/modules/controllers/path.php';
require_once PROJECT_ROOT . '/modules/controllers/segments.php';

?>