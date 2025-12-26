<?php

use PHPUnit\Framework\TestCase;

abstract class TestCaseWithTmpRoot extends TestCase
{
    protected string $tmpRoot;

    protected function setUp(): void
    {
        parent::setUp();

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
}
