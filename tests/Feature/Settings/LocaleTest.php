<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the browser locale cookie sets the interface language', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withUnencryptedCookie('ui_locale', 'id')
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'id'),
        );
});

test('unsupported browser locales fall back to the configured application locale', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withUnencryptedCookie('ui_locale', 'fr')
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', config('app.locale')),
        );
});
