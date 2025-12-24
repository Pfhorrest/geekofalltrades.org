<?php

use PHPUnit\Framework\TestCase;

final class PathFromURLTest extends TestCase
{
    public function test_root_path(): void
    {
        $this->assertSame('/', path_from_url('/'));
    }

    public function test_strips_query_string(): void
    {
        $this->assertSame(
            '/photos/2019/03/',
            path_from_url('/photos/2019/03/?foo=bar')
        );
    }

    public function test_preserves_file_path(): void
    {
        $this->assertSame(
            '/index.php',
            path_from_url('/index.php?x=1')
        );
    }

    public function test_no_query_string(): void
    {
        $this->assertSame(
            '/about/',
            path_from_url('/about/')
        );
    }

    public function test_empty_query_only(): void
    {
        $this->assertSame(
            '/',
            path_from_url('/?')
        );
    }

}

?>