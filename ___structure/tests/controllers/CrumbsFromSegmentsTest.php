<?php

use PHPUnit\Framework\TestCase;

final class CrumbsFromSegmentsTest extends TestCase
{
    public function test_simple_segments(): void
    {
        $segments = ['photos', '2025', '12'];
        $expected = ['/', '/photos/', '/photos/2025/', '/photos/2025/12/'];
        $this->assertSame($expected, crumbs_from_segments($segments));
    }
}

?>