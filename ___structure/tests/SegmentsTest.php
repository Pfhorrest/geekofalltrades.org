<?php

use PHPUnit\Framework\TestCase;

final class SegmentsTest extends TestCase
{
    public function test_root_path_has_no_segments(): void
    {
        $this->assertSame([], path_to_segments('/'));
    }

    public function test_single_segment(): void
    {
        $this->assertSame(['photos'], path_to_segments('/photos'));
    }

    public function test_multiple_segments(): void
    {
        $this->assertSame(
            ['photos', '2019', '03'],
            path_to_segments('/photos/2019/03/')
        );
    }

    public function test_redundant_slashes_are_removed(): void
    {
        $this->assertSame(
            ['a', 'b', 'c'],
            path_to_segments('/a//b///c/')
        );
    }

    public function test_empty_string(): void
    {
        $this->assertSame([], path_to_segments(''));
    }
}
