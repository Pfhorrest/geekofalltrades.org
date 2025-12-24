<?php

use PHPUnit\Framework\TestCase;

final class RootDeterminationTest extends TestCase
{
    public function test_cli_server_uses_parent_directory(): void
    {
        $root = root_determination(
            'cli-server',
            '/var/www/html',
            '/project/___structure'
        );

        $this->assertSame(
            '/project',
            $root
        );
    }

    public function test_cli_server_handles_trailing_slash(): void
    {
        $root = root_determination(
            'cli-server',
            '/var/www/html',
            '/project/___structure/'
        );

        $this->assertSame('/project', $root);
    }

    public function test_cli_server_root_directory_remains_root(): void
    {
        $root = root_determination(
            'cli-server',
            '/var/www/html',
            '/'
        );

        $this->assertSame('/', $root);
    }

    public function test_cli_server_empty_current_dir_returns_dot(): void
    {
        $root = root_determination(
            'cli-server',
            '/var/www/html',
            ''
        );

        $this->assertSame('.', $root);
    }

    public function test_non_cli_server_uses_document_root(): void
    {
        $root = root_determination(
            'apache2handler',
            '/var/www/html',
            '/project/___structure'
        );

        $this->assertSame(
            '/var/www/html',
            $root
        );
    }

    public function test_empty_document_root_is_returned_as_is(): void
    {
        $root = root_determination(
            'apache2handler',
            '',
            '/project/___structure'
        );

        $this->assertSame('', $root);
    }

}

?>