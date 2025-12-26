<?php

use PHPUnit\Framework\TestCase;

final class RenderStylesForCrumbTest extends TestCaseWithTmpRoot
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->createTmpFile('/photos/2025/12/__styles/styles.css', 'body{}');
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