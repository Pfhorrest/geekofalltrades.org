<?php

use PHPUnit\Framework\TestCase;

final class MainResolutionTest extends TestCaseWithTmpRoot
{
    public function test_main_php_file_takes_precedence(): void
    {
        mkdir($this->tmpRoot . '/page', 0777, true);
        file_put_contents($this->tmpRoot . '/page/__main.php', '<?php');

        $result = main_resolution(
            $this->tmpRoot . '/page/',
            false
        );

        $this->assertSame(
            ['type' => 'main', 'format' => 'php'],
            $result
        );
    }

    public function test_index_php_redirects(): void
    {
        mkdir($this->tmpRoot . '/dir', 0777, true);
        file_put_contents($this->tmpRoot . '/dir/index.php', '<?php');

        $result = main_resolution(
            $this->tmpRoot . '/dir/',
            false
        );

        $this->assertSame(
            ['type' => 'redirect', 'target' => 'index.php'],
            $result
        );
    }

    public function test_index_html_redirects(): void
    {
        mkdir($this->tmpRoot . '/dir', 0777, true);
        file_put_contents($this->tmpRoot . '/dir/index.html', '<!doctype html>');

        $result = main_resolution(
            $this->tmpRoot . '/dir/',
            false
        );

        $this->assertSame(
            ['type' => 'redirect', 'target' => 'index.html'],
            $result
        );
    }

    public function test_directory_listing_when_indexes_enabled(): void
    {
        mkdir($this->tmpRoot . '/dir', 0777, true);

        $result = main_resolution(
            $this->tmpRoot . '/dir/',
            true
        );

        $this->assertSame(
            ['type' => 'directory'],
            $result
        );
    }

    public function test_directory_without_indexes_is_error(): void
    {
        mkdir($this->tmpRoot . '/dir', 0777, true);

        $result = main_resolution(
            $this->tmpRoot . '/dir/',
            false
        );

        $this->assertSame(
            ['type' => 'error'],
            $result
        );
    }

    public function test_missing_path_is_error(): void
    {
        $result = main_resolution(
            $this->tmpRoot . '/missing/',
            true
        );

        $this->assertSame(
            ['type' => 'error'],
            $result
        );
    }
    public function test_main_php_overrides_index_files(): void
    {
        mkdir($this->tmpRoot . '/page', 0777, true);

        file_put_contents($this->tmpRoot . '/page/__main.php', '<?php');
        file_put_contents($this->tmpRoot . '/page/index.php', '<?php');
        file_put_contents($this->tmpRoot . '/page/index.html', '<!doctype html>');

        $result = main_resolution(
            $this->tmpRoot . '/page/',
            true
        );

        $this->assertSame(
            ['type' => 'main', 'format' => 'php'],
            $result
        );
    }
}

?>