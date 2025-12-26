<?php
declare(strict_types=1);

// Always load Composer autoloader first
require_once __DIR__ . '/../../vendor/autoload.php';

// Project root
define('PROJECT_ROOT', realpath(__DIR__ . '/..'));

// Load app code
require_once PROJECT_ROOT . '/modules/_bootstrap.php';

// Base test case with common utilities
require_once __DIR__ . '/TestCaseWithTmpRoot.php';

?>