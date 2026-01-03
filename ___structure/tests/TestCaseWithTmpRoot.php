<?php

use PHPUnit\Framework\TestCase;

abstract class TestCaseWithTmpRoot extends TestCase
{

    protected array $originalGlobals = [];

    protected string $tmpRoot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->originalGlobals['rootpath'] = $GLOBALS['rootpath'] ?? null;
        $this->originalGlobals['path'] = $GLOBALS['path'] ?? null;

        $this->tmpRoot = sys_get_temp_dir() . '/test_root_' . uniqid();
        mkdir($this->tmpRoot, 0777, true);
    }

    protected function tearDown(): void
    {
        if (!is_dir($this->tmpRoot)) {
            return;
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator(
                $this->tmpRoot,
                RecursiveDirectoryIterator::SKIP_DOTS
            ),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($iterator as $file) {
            if ($file->isLink() || $file->isFile()) {
                unlink($file->getPathname());
            } elseif ($file->isDir()) {
                rmdir($file->getPathname());
            }
        }

        rmdir($this->tmpRoot);

        if ($this->originalGlobals['path'] === null) {
            unset($GLOBALS['path']);
        } else {
            $GLOBALS['path'] = $this->originalGlobals['path'];
        }

        if ($this->originalGlobals['rootpath'] === null) {
            unset($GLOBALS['rootpath']);
        } else {
            $GLOBALS['rootpath'] = $this->originalGlobals['rootpath'];
        }

        parent::tearDown();
    }

    /**
     * Creates a file under tmpRoot, creating intermediate directories as needed.
     *
     * @param string $relativePath Path relative to tmpRoot
     * @param string $contents Optional file contents
     * @return string Absolute path to the created file
     */
    protected function createTmpFile(string $relativePath, string $contents = ''): string
    {
        $fullPath = $this->tmpRoot . '/' . ltrim($relativePath, '/');
        $dir = dirname($fullPath);

        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        file_put_contents($fullPath, $contents);

        return $fullPath;
    }
    /**
     * Creates a minimal PNG image file under tmpRoot, creating intermediate directories as needed.
     *
     * @param string $relativePath Path relative to tmpRoot
     * @return string Absolute path to the created image file
     */
    protected function createTmpImage(string $relativePath): string
    {
        $fullPath = $this->tmpRoot . '/' . ltrim($relativePath, '/');
        $dir = dirname($fullPath);

        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        // Create a 1x1 truecolor image
        $img = imagecreatetruecolor(1, 1);
        imagesavealpha($img, true);
        $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
        imagefill($img, 0, 0, $transparent);

        imagepng($img, $fullPath);
        imagedestroy($img);

        return $fullPath;
    }
}
