<?php
/**
 * dev-router.php (inside ___structure)
 * Router script for PHP built-in server to emulate Apache .htaccess rewrites.
 */

$root = realpath(__DIR__ . '/../'); // Project root
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestedPath = $root . $requestUri;

// Serve static files if they exist
if (is_file($requestedPath)) {
    return false;
}

// Special rule: __scripts requests to .js files
if (preg_match('#^/__scripts/.+#', $requestUri) && !is_file($requestedPath)) {
    $jsFile = $requestedPath . '.js';
    if (is_file($jsFile)) {
        header('Content-Type: application/javascript');
        readfile($jsFile);
        exit;
    }
}

// Otherwise, route everything else to html.php
require $root . '/___structure/html.php';
