<?php
/**
 * msp-proxy.php — CORS proxy for MSP staging
 *
 * REMOVE THIS FILE before deploying to the live MSP site (or just leave it,
 * it's harmless there since modern.js only calls it when MSP_CONTENT_ROOT
 * is set, which is only in the staging config).
 *
 * Usage (set in msp-staging-config.js):
 *   window.MSP_PROXY = "/msp-modernized/msp-proxy.php";
 *
 * Requests arrive as: msp-proxy.php?url=mainpage.html
 * The proxy prepends MSP_ORIGIN and fetches it server-side, returning the
 * response body with the correct Content-Type so fetch() in modern.js can
 * read it without CORS errors.
 */

define("MSP_ORIGIN", "https://marathon.bungie.org/story/");

// ── Validate the requested path ───────────────────────────────────────────────

$path = isset($_GET["url"]) ? $_GET["url"] : "";

// Strip any leading slashes or attempts to escape the story directory
$path = ltrim($path, "/");

// Strip full MSP origin prefix if the client sent an absolute URL —
// rewriteFrameDoc may pass absolute URLs that proxyHref didn't fully reduce.
$origin = MSP_ORIGIN;
if (strpos($path, $origin) === 0) {
    $path = substr($path, strlen($origin));
}

// Also handle https://marathon.bungie.org/ without the /story/ path
$host = "https://marathon.bungie.org/";
if (strpos($path, $host) === 0) {
    $path = substr($path, strlen($host));
}

// Reject remaining absolute URLs, empty paths, and traversal attempts
if (empty($path) || preg_match('/^https?:\/\//i', $path) || strpos($path, "..") !== false) {
    http_response_code(400);
    header("Content-Type: text/plain");
    exit("Bad request: " . htmlspecialchars($path));
}

$upstream = MSP_ORIGIN . $path;

// ── Fetch from upstream ───────────────────────────────────────────────────────

$ctx = stream_context_create([
    "http" => [
        "method"          => "GET",
        "timeout"         => 15,
        "follow_location" => 1,
        "max_redirects"   => 5,
        "header"          => implode("\r\n", [
            "User-Agent: Mozilla/5.0 (compatible; MSP-staging-proxy/1.0)",
            "Accept: text/html,image/*,*/*",
        ]),
    ],
    "ssl" => [
        // Some local PHP installs don't have CA bundles configured.
        // For a local dev proxy this is acceptable; remove for production use.
        "verify_peer"      => false,
        "verify_peer_name" => false,
    ],
]);

$body = @file_get_contents($upstream, false, $ctx);

if ($body === false) {
    // Provide a more informative error for debugging
    $err = error_get_last();
    http_response_code(502);
    header("Content-Type: text/plain");
    exit("Could not fetch: " . htmlspecialchars($upstream) . "\n" .
         ($err ? $err["message"] : "Unknown error"));
}

// ── Relay response ────────────────────────────────────────────────────────────

$contentType = "application/octet-stream";
if (!empty($http_response_header)) {
    foreach ($http_response_header as $h) {
        if (stripos($h, "Content-Type:") === 0) {
            $contentType = trim(substr($h, strlen("Content-Type:")));
            break;
        }
    }
}

header("Content-Type: " . $contentType);
header("Access-Control-Allow-Origin: *");
header("Cache-Control: max-age=300");

echo $body;