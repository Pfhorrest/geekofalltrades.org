<?php
/**
 * Extract and normalize the path portion of a request URI.
 *
 * Examples:
 *  "/photos/2019/03/?foo=bar" → "/photos/2019/03/"
 *  "/index.php?x=1"           → "/index.php"
 *  "/"                        → "/"
 * 
 * @param string $requestUri The full request URI.
 * @return string The normalized path portion of the URI.
 *
 */

function parse_request_path(string $requestUri): string
{
    $path = parse_url($requestUri, PHP_URL_PATH);
    return $path === '' ? '/' : $path;
}
?>