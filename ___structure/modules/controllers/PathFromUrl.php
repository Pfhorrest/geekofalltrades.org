<?php
/**
 * Extract and normalize the path portion of a request URL.
 *
 * Examples:
 *  "/photos/2019/03/?foo=bar" → "/photos/2019/03/"
 *  "/index.php?x=1"           → "/index.php"
 *  "/"                        → "/"
 * 
 * @param string $requestUri The full request URL.
 * @return string The normalized path portion of the URL.
 *
 */

function path_from_url(string $requestURL): string
{
    $path = parse_url($requestURL, PHP_URL_PATH);
    return $path === '' ? '/' : $path;
}
?>