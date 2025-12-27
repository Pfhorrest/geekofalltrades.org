<?php

use PHPUnit\Framework\TestCase;

final class RenderScriptsForCrumbTest extends TestCaseWithTmpRoot
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->createTmpFile('/photos/2025/12/__scripts/scripts.js', 'console.log("hi");');
    }

    public function test_returns_empty_when_no_file(): void
    {
        $crumb = '/nonexistent/';
        $this->assertSame('', scripts_for_crumb($this->tmpRoot, $crumb));
    }

    public function test_returns_script_tag_for_existing_file(): void
    {
        $crumb = '/photos/2025/12/';
        $output = scripts_for_crumb($this->tmpRoot, $crumb);

        $this->assertStringContainsString('<script src="/photos/2025/12/__scripts/scripts.js?v=', $output);
        $this->assertStringContainsString('type="module"', $output);
    }
}

?>