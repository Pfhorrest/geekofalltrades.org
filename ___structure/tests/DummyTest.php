<?php
use PHPUnit\Framework\TestCase;

class DummyTest extends TestCase
{
    public function testAlwaysPasses(): void
    {
        $this->assertTrue(true);
    }
}
