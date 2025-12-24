<?php

use PHPUnit\Framework\TestCase;

final class LightboxShouldDisplayTest extends TestCase
{
    public function test_no_query_params(): void
    {
        $this->assertFalse(lightbox_should_display([]));
    }

    public function test_display_set_to_true_string(): void
    {
        $this->assertTrue(lightbox_should_display(['display' => 'true']));
    }

    public function test_display_set_to_one(): void
    {
        $this->assertTrue(lightbox_should_display(['display' => '1']));
    }

    public function test_display_set_to_zero(): void
    {
        $this->assertFalse(lightbox_should_display(['display' => '0']));
    }

    public function test_display_set_to_empty_string(): void
    {
        $this->assertFalse(lightbox_should_display(['display' => '']));
    }

    public function test_display_key_missing(): void
    {
        $this->assertFalse(lightbox_should_display(['foo' => 'bar']));
    }

    public function test_display_set_to_null(): void
    {
        $this->assertFalse(lightbox_should_display(['display' => null]));
    }
}

?>