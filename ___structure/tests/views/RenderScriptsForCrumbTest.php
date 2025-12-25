<?php

use PHPUnit\Framework\TestCase;

final class RenderScriptsForCrumbTest extends TestCase
{
    private string $tmpRoot;

    protected function setUp(): void
    {
        $this->tmpRoot = sys_get_temp_dir() . '/test_root_' . uniqid();
        mkdir($this->tmpRoot . '/photos/2025/12/__scripts', 0777, true);
        file_put_contents($this->tmpRoot . '/photos/2025/12/__scripts/scripts.js', 'console.log("hi");');
    }

    protected function tearDown(): void
    {
        // Clean up temp files
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->tmpRoot, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($files as $fileinfo) {
            $fileinfo->isDir() ? rmdir($fileinfo->getRealPath()) : unlink($fileinfo->getRealPath());
        }
        rmdir($this->tmpRoot);
    }

    public function test_returns_empty_when_no_file(): void
    {
        $crumb = '/nonexistent/';
        $this->assertSame('', render_scripts_for_crumb($this->tmpRoot, $crumb));
    }

    public function test_returns_script_tag_for_existing_file(): void
    {
        $crumb = '/photos/2025/12/';
        $output = render_scripts_for_crumb($this->tmpRoot, $crumb);

        $this->assertStringContainsString('<script src="/photos/2025/12/__scripts/scripts.js?v=', $output);
        $this->assertStringContainsString('type="module"', $output);
    }
}

?>