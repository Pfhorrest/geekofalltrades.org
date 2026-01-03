<?php
use PHPUnit\Framework\TestCase;

final class ImagesDiscoveredTest extends TestCaseWithTmpRoot
{
    protected function setUp(): void
    {
        parent::setUp();
        // optional: set $GLOBALS['segments'] to a predictable value
        $GLOBALS['segments'] = ['photos', '2025'];
    }

    public function test_leaf_directory_returns_all_images(): void
    {
        $this->createTmpImage('a.jpg');
        $this->createTmpImage('b.jpg');

        $result = images_discovered($this->tmpRoot);

        $this->assertCount(2, $result['images']);
        $this->assertSame(2, $result['count']);

        $filenames = array_column($result['images'], 'filename');
        $this->assertContains('a.jpg', $filenames);
        $this->assertContains('b.jpg', $filenames);
    }

    public function test_single_subgallery_rolls_up_count(): void
    {
        $this->createTmpImage('day1/img1.jpg');
        $this->createTmpImage('day1/img2.jpg');

        $result = images_discovered($this->tmpRoot);

        $this->assertCount(1, $result['images']);
        $this->assertSame(2, $result['count']);

        $image = $result['images'][0];
        $this->assertSame('day1/img2.jpg', $image['filename']);
        $this->assertSame(2, $image['morecount']);
        $this->assertSame('day1', $image['morelink']);
    }

    public function test_grandchildren_are_counted_recursively(): void
    {
        $this->createTmpImage('month/day/a.jpg');
        $this->createTmpImage('month/day/b.jpg');
        $this->createTmpImage('month/day/c.jpg');

        $result = images_discovered($this->tmpRoot);

        $this->assertSame(3, $result['count']);
        $this->assertCount(1, $result['images']);

        $image = $result['images'][0];
        $this->assertSame('month/day/c.jpg', $image['filename']);
        $this->assertSame(3, $image['morecount']);
        $this->assertSame('month', $image['morelink']);
    }

    public function test_empty_directories_do_not_create_tiles(): void
    {
        mkdir($this->tmpRoot . '/empty');

        $result = images_discovered($this->tmpRoot);

        $this->assertCount(0, $result['images']);
        $this->assertSame(0, $result['count']);
    }

    public function test_mixed_leaf_and_subgallery(): void
    {
        $this->createTmpImage('top.jpg');
        $this->createTmpImage('sub/a.jpg');

        $result = images_discovered($this->tmpRoot);

        $this->assertSame(2, $result['count']);
        $this->assertCount(2, $result['images']);

        $filenames = array_column($result['images'], 'filename');
        $this->assertContains('top.jpg', $filenames);
        $this->assertContains('sub/a.jpg', $filenames);
    }
}
