<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;



final class RenderGalleryTest extends TestCaseWithTmpRoot
{
    private array $images;

    protected function setUp(): void
    {
        parent::setUp();

        // Global dependency used by render_gallery
        $GLOBALS['path'] = '/photos/test/';
        $GLOBALS['rootpath'] = rtrim($this->tmpRoot, '/') . $GLOBALS['path'];

        $this->images = [
            [
                'title' => 'First Image',
                'filename' => 'one.jpg',
                'description' => 'First description',
            ],
            [
                'title' => 'Second Image',
                'filename' => 'two.jpg',
                'description' => 'Second description',
                'morelink' => 'more',
                'moretext' => 'Subgallery',
            ],
        ];

        // Create temporary image files
        $this->createTmpFile('/photos/test/one.jpg', 'fake image');
        $this->createTmpFile('/photos/test/two.jpg', 'fake image');


    }

    public function test_returns_gallery_container(): void
    {
        $html = render_gallery($this->images);

        $this->assertStringContainsString(
            '<div class="gallery expansive">',
            $html
        );
    }

    public function test_renders_one_item_per_image(): void
    {
        $html = render_gallery($this->images);

        $this->assertSame(
            2,
            substr_count($html, 'class="item"')
        );
    }

    public function test_item_ids_use_array_index(): void
    {
        $html = render_gallery($this->images);

        $this->assertStringContainsString('id="item0"', $html);
        $this->assertStringContainsString('id="item1"', $html);
    }

    public function test_renders_title_and_description(): void
    {
        $html = render_gallery($this->images);

        $this->assertStringContainsString(
            '<p class="title">First Image</p>',
            $html
        );

        $this->assertStringContainsString(
            '<p class="description">Second description</p>',
            $html
        );
    }

    public function test_renders_image_src(): void
    {
        $html = render_gallery($this->images);

        $this->assertStringContainsString('src="one.jpg"', $html);        
        $this->assertStringContainsString('src="two.jpg"', $html);
    }

    public function test_renders_more_link_only_when_present(): void
    {
        $html = render_gallery($this->images);

        // Second image has a "more"
        $this->assertMatchesRegularExpression(
            '#<p class="more">\s*<a href="/photos/test/more">More from Subgallery</a>\s*</p>#',
            $html
        );

        // First image does not
        $this->assertSame(
            1,
            substr_count($html, 'class="more"')
        );
    }

    public function test_always_renders_cover_link(): void
    {
        $html = render_gallery($this->images);

        $this->assertSame(
            2,
            substr_count($html, 'class="cover"')
        );
    }

    public function test_empty_images_renders_empty_gallery(): void
    {
        $html = render_gallery([]);

        $this->assertStringContainsString(
            '<div class="gallery expansive">',
            $html
        );

        $this->assertSame(
            0,
            substr_count($html, 'class="item"')
        );
    }
}
?>