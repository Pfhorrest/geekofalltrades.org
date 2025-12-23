<?php

use PHPUnit\Framework\TestCase;

final class ShouldDisplayLightboxTest extends TestCase
{
    public function test_no_query_params(): void
    {
        $this->assertFalse(should_display_lightbox([]));
    }

    public function test_display_set_to_true_string(): void
    {
        $this->assertTrue(should_display_lightbox(['display' => 'true']));
    }

    public function test_display_set_to_one(): void
    {
        $this->assertTrue(should_display_lightbox(['display' => '1']));
    }

    public function test_display_set_to_zero(): void
    {
        $this->assertFalse(should_display_lightbox(['display' => '0']));
    }

    public function test_display_set_to_empty_string(): void
    {
        $this->assertFalse(should_display_lightbox(['display' => '']));
    }

    public function test_display_key_missing(): void
    {
        $this->assertFalse(should_display_lightbox(['foo' => 'bar']));
    }

    public function test_display_set_to_null(): void
    {
        $this->assertFalse(should_display_lightbox(['display' => null]));
    }
}
