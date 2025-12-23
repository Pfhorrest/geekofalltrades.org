<?php

use PHPUnit\Framework\TestCase;

final class PathTest extends TestCase
{
    public function test_root_path(): void
    {
        $this->assertSame('/', parse_request_path('/'));
    }

    public function test_strips_query_string(): void
    {
        $this->assertSame(
            '/photos/2019/03/',
            parse_request_path('/photos/2019/03/?foo=bar')
        );
    }

    public function test_preserves_file_path(): void
    {
        $this->assertSame(
            '/index.php',
            parse_request_path('/index.php?x=1')
        );
    }

    public function test_no_query_string(): void
    {
        $this->assertSame(
            '/about/',
            parse_request_path('/about/')
        );
    }

    public function test_empty_query_only(): void
    {
        $this->assertSame(
            '/',
            parse_request_path('/?')
        );
    }

}
