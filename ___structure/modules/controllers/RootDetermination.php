<?php
/**
 * Determine the project root directory based on the server API.
 *
 * @param string $sapi_name The PHP SAPI name (e.g., 'cli-server', 'apache2handler').
 * @param string $document_root The document root from the server environment.
 * @param string $current_dir The current directory of the calling script.
 * @return string The determined project root directory.
 */
function root_determination(
    string $sapi_name,
    string $document_root,
    string $current_dir
): string {
    if ($sapi_name === 'cli-server') {
        return dirname($current_dir) ?: '.';
    }

    return $document_root;
}
?>