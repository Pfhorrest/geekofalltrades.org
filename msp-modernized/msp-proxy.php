<?php
/**
 * msp-proxy.php — CORS proxy for MSP staging
 *
 * STAGING ONLY — remove this file (or just the script tag in msp-staging-config.js)
 * before deploying to the live MSP site. On the live server, modern.js makes
 * only same-origin requests and needs no proxy.
 *
 * Usage: set window.MSP_PROXY = "/msp-modernized/msp-proxy.php" in msp-staging-config.js.
 * Requests arrive as: msp-proxy.php?url=mainpage.html
 *
 * The proxy fetches from MSP_ORIGIN server-side so fetch() in modern.js
 * can read the response without hitting CORS restrictions.
 *
 * Binary media (video, audio) is redirected directly to the upstream URL
 * rather than being streamed through PHP.
 */

define("MSP_ORIGIN", "https://marathon.bungie.org/story/");

// ── Validate the requested path ───────────────────────────────────────────────

$path = isset($_GET["url"]) ? $_GET["url"] : "";
$path = ltrim($path, "/");

// Strip absolute URL prefixes if the client sent one
foreach ([MSP_ORIGIN, "https://marathon.bungie.org/"] as $prefix) {
    if (strpos($path, $prefix) === 0) {
        $path = substr($path, strlen($prefix));
        break;
    }
}

// Reject remaining absolute URLs, empty paths, and traversal attempts
if (empty($path) || preg_match('/^https?:\/\//i', $path) || strpos($path, "..") !== false) {
    http_response_code(400);
    header("Content-Type: text/plain");
    exit("Bad request: " . htmlspecialchars($path));
}

$upstream = MSP_ORIGIN . $path;

// ── Redirect binary media directly to upstream ────────────────────────────────
// The browser can load media cross-origin natively; only JS fetch() is blocked.
// Redirecting avoids streaming large files through PHP.

$media_exts = ["mp4","webm","ogv","ogg","mp3","wav","flac","mov","avi","mkv"];
$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
if (in_array($ext, $media_exts)) {
    header("Location: " . $upstream);
    exit;
}

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
        // Local PHP installs often lack CA bundle config; disable verification
        // for this dev-only proxy (do not use this in production).
        "verify_peer"      => false,
        "verify_peer_name" => false,
    ],
]);

$body = @file_get_contents($upstream, false, $ctx);

if ($body === false) {
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