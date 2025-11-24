<?php
/**
 * Router script for PHP built-in server to emulate Apache .htaccess rewrites.
 */

$root = realpath(__DIR__ . '/../'); // Project root
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestedPath = $root . $requestUri;

// Suppress warnings and notices
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

// If the requested path is a directory and the URL lacks a trailing slash,
// redirect to the slash version (like Apache does).
if (is_dir($requestedPath) && substr($requestUri, -1) !== '/') {
    header('Location: ' . $requestUri . '/');
    exit;
}

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
chdir($root.'/___structure');
require 'html.php';
