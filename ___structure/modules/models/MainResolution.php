<?php

function main_resolution(string $rootpath, bool $indexes): array
{
    if (is_file($rootpath . '__main.md')) {
        return ['type' => 'main', 'format' => 'md'];
    }
    if (is_file($rootpath . '__main.php')) {
        return ['type' => 'main', 'format' => 'php'];
    }
    /**
     * NOTE:
     * __main.md is a planned future content format.
     * Current resolution logic is intentionally PHP-only
     * until core routing, metadata, and rendering are stabilized.
     */

    if (is_dir($rootpath)) {
        if (is_file($rootpath . 'index.php')) {
            return ['type' => 'redirect', 'target' => 'index.php'];
        }

        if (is_file($rootpath . 'index.html')) {
            return ['type' => 'redirect', 'target' => 'index.html'];
        }

        if ($indexes) {
            return ['type' => 'directory'];
        }
    }

    return ['type' => 'error'];
}

?>