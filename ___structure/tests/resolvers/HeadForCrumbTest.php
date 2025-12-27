<?php

use PHPUnit\Framework\TestCase;

final class HeadForCrumbTest extends TestCaseWithTmpRoot
{
    public function test_returns_empty_array_when_head_missing(): void
    {
        $this->assertSame(
            [],
            head_for_crumb($this->tmpRoot, '/photos/2025/12/')
        );
    }

    public function test_extracts_title_from_head_file(): void
    {
        $this->createTmpFile('/photos/2025/12/__head.php',
            '<?php $title = "March 2025";'
        );

        $this->assertSame(
            ['title' => 'March 2025'],
            head_for_crumb($this->tmpRoot, '/photos/2025/12/')
        );
    }

    public function test_extracts_multiple_metadata_fields(): void
    {
        $this->createTmpFile('/photos/2025/12/__head.php',
            '<?php $title = "March"; $description = "Photos";'
        );

        $this->assertSame(
            [
                'title' => 'March',
                'description' => 'Photos'
            ],
            head_for_crumb($this->tmpRoot, '/photos/2025/12/')
        );
    }

    public function test_deeper_crumb_overrides_shallow(): void
    {
        $this->createTmpFile('/photos/__head.php',
            '<?php $title = "Photos";'
        );

        $this->createTmpFile('/photos/2025/12/__head.php',
            '<?php $title = "December 2025";'
        );

        $head = [];
        foreach (['/photos/', '/photos/2025/12/'] as $crumb) {
            $head = array_merge($head, head_for_crumb($this->tmpRoot, $crumb));
        }

        $this->assertSame(
            ['title' => 'December 2025'],
            $head
        );
    }

}

?>