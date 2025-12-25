<?php 

use PHPUnit\Framework\TestCase;

final class HeadPathForCrumbTest extends TestCase
{
    private string $tmpRoot;

    protected function setUp(): void
    {
        $this->tmpRoot = sys_get_temp_dir() . '/test_root_' . uniqid();
        mkdir($this->tmpRoot . '/photos/2025/12', 0777, true);
    }

    protected function tearDown(): void
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->tmpRoot, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($files as $fileinfo) {
            $fileinfo->isDir()
                ? rmdir($fileinfo->getRealPath())
                : unlink($fileinfo->getRealPath());
        }
        rmdir($this->tmpRoot);
    }

    public function test_returns_path_when_head_exists(): void
    {
        file_put_contents(
            $this->tmpRoot . '/photos/2025/12/__head.php',
            '<?php $title = "Test";'
        );

        $this->assertSame(
            $this->tmpRoot . '/photos/2025/12/__head.php',
            head_path_for_crumb($this->tmpRoot, '/photos/2025/12/')
        );
    }

    public function test_returns_empty_string_when_head_missing(): void
    {
        $this->assertSame(
            '',
            head_path_for_crumb($this->tmpRoot, '/photos/2025/12/')
        );
    }
}

?>