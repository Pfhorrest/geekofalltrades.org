<?php

use PHPUnit\Framework\TestCase;

final class SegmentsFromPathTest extends TestCase
{
    public function test_root_path_has_no_segments(): void
    {
        $this->assertSame([], segments_from_path('/'));
    }

    public function test_single_segment(): void
    {
        $this->assertSame(['photos'], segments_from_path('/photos'));
    }

    public function test_multiple_segments(): void
    {
        $this->assertSame(
            ['photos', '2019', '03'],
            segments_from_path('/photos/2019/03/')
        );
    }

    public function test_redundant_slashes_are_removed(): void
    {
        $this->assertSame(
            ['a', 'b', 'c'],
            segments_from_path('/a//b///c/')
        );
    }

    public function test_empty_string(): void
    {
        $this->assertSame([], segments_from_path(''));
    }
}

?>