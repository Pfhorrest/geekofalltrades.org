<?php

use PHPUnit\Framework\TestCase;

class TestLightbox extends TestCase
{
    private function renderLightbox(array $vars): string
    {
        extract($vars);

        ob_start();
        include __DIR__ . '/../lightbox.php';
        return ob_get_clean();
    }

    public function test_middle_image_prev_and_next()
    {
        $images = [
            ['filename' => 'a.jpg', 'title' => 'A'],
            ['filename' => 'b.jpg', 'title' => 'B'],
            ['filename' => 'c.jpg', 'title' => 'C'],
        ];

        $html = $this->renderLightbox([
            'images'   => $images,
            'display'  => 'b.jpg',
            'rootpath' => '/var/www/',
            'path'     => '/gallery/',
            '_GET'     => ['title' => 'B'],
        ]);

        $this->assertStringContainsString('display=a.jpg', $html);
        $this->assertStringContainsString('display=c.jpg', $html);
    }

    public function test_wraparound_prev_from_first()
    {
        $images = [
            ['filename' => 'a.jpg', 'title' => 'A'],
            ['filename' => 'b.jpg', 'title' => 'B'],
        ];

        $html = $this->renderLightbox([
            'images'   => $images,
            'display'  => 'a.jpg',
            'rootpath' => '/var/www/',
            'path'     => '/gallery/',
            '_GET'     => ['title' => 'A'],
        ]);

        $this->assertStringContainsString('display=b.jpg', $html);
    }

    public function test_no_images_renders_without_navigation()
    {
        $html = $this->renderLightbox([
            'images'   => null,
            'display'  => 'a.jpg',
            'rootpath' => '/var/www/',
            'path'     => '/gallery/',
            '_GET'     => ['title' => 'A'],
        ]);

        $this->assertStringContainsString('id="lightbox"', $html);
        $this->assertStringNotContainsString('class="prev"', $html);
        $this->assertStringNotContainsString('class="next"', $html);
    }

    public function test_imagepath_falls_back_to_media_directory()
    {
        $html = $this->renderLightbox([
            'images'   => [],
            'display'  => 'foo.jpg',
            'rootpath' => '/nonexistent/',
            'path'     => '/',
            '_GET'     => ['title' => 'Foo'],
        ]);

        $this->assertStringContainsString(
            '_media/images/foo.jpg',
            $html
        );
    }

}