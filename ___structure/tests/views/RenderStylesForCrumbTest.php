<?php

use PHPUnit\Framework\TestCase;

final class RenderStylesForCrumbTest extends TestCase
{
    private string $tmpRoot;

    protected function setUp(): void
    {
        $this->tmpRoot = sys_get_temp_dir() . '/test_root_' . uniqid();
        mkdir($this->tmpRoot . '/photos/2025/12/__styles', 0777, true);
        file_put_contents($this->tmpRoot . '/photos/2025/12/__styles/styles.css', 'body{}');
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
        $this->assertSame('', render_styles_for_crumb($this->tmpRoot, $crumb));
    }

    public function test_returns_link_tags_for_existing_file(): void
    {
        $crumb = '/photos/2025/12/';
        $output = render_styles_for_crumb($this->tmpRoot, $crumb);

        $this->assertStringContainsString('<link href="/photos/2025/12/__styles/styles.css?v=', $output);
        $this->assertStringContainsString('rel="preload"', $output);
        $this->assertStringContainsString('rel="stylesheet"', $output);
    }
}

?>