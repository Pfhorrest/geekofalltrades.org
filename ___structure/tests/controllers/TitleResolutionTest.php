<?php

use PHPUnit\Framework\TestCase;

final class TitleResolutionTest extends TestCase
{
    public function test_query_string_wins(): void
    {
        $this->assertSame(
            'From Query',
            title_resolution(
                'domain.name',
                ['photos', '2019'],
                'From Meta',
                ['title' => 'From Query'],
            )
        );
    }

    public function test_meta_used_when_no_query(): void
    {
        $this->assertSame(
            'From Meta',
            title_resolution(
                'domain.name',
                ['photos', '2019'],
                'From Meta',
            )
        );
    }

    public function test_segments_used_when_no_meta(): void
    {
        $this->assertSame(
            'Photos → 2019 → 03',
            title_resolution(
                'domain.name',
                ['photos', '2019', '03'],
            )
        );
    }

    public function test_domain_used_when_no_segments(): void
    {
        $this->assertSame(
            'domain.name',
            title_resolution(
                'domain.name'
            )
        );
    }

    public function test_untitled_fallback(): void
    {
        $this->assertSame(
            'Untitled',
            title_resolution()
        );
    }

    public function test_tagline_suffix_is_appended(): void
    {
        $this->assertSame(
            'My Page | My PrevHP Site',
            title_resolution(
                '',
                [],
                'My Page',
                [],
                '| My PrevHP Site'
            )
        );
    }
}

?>