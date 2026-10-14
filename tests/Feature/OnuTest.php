<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('ONU error messages use the selected Indonesian locale', function () {
    $user = User::factory()->create();
    $olt = $user->olts()->create([
        'nama' => 'Unsupported OLT',
        'host' => '192.0.2.10',
        'model' => 'epon',
        'vendor' => 'hioso',
        'protocol' => 'snmp',
        'port' => 161,
        'snmp_ro' => 'public',
    ]);

    $this->actingAs($user)
        ->withUnencryptedCookie('ui_locale', 'id')
        ->get(route('onus.index', ['olt' => $olt->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('onus/index')
            ->where('locale', 'id')
            ->where('error.key', 'ONU listing is not supported for this OLT vendor, model, and protocol combination.'),
        );
});

test('ONU error messages use the selected English locale', function () {
    $user = User::factory()->create();
    $olt = $user->olts()->create([
        'nama' => 'Unsupported OLT',
        'host' => '192.0.2.10',
        'model' => 'epon',
        'vendor' => 'hioso',
        'protocol' => 'snmp',
        'port' => 161,
        'snmp_ro' => 'public',
    ]);

    $this->actingAs($user)
        ->withUnencryptedCookie('ui_locale', 'en')
        ->get(route('onus.index', ['olt' => $olt->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('onus/index')
            ->where('locale', 'en')
            ->where('error.key', 'ONU listing is not supported for this OLT vendor, model, and protocol combination.'),
        );
});

test('ONU service errors are sent as locale-independent translation keys', function () {
    $user = User::factory()->create();
    $olt = $user->olts()->create([
        'nama' => 'ZTE OLT',
        'host' => '192.0.2.10',
        'model' => 'gpon',
        'vendor' => 'zte',
        'protocol' => 'snmp',
        'port' => 161,
    ]);

    $this->actingAs($user)
        ->withUnencryptedCookie('ui_locale', 'id')
        ->get(route('onus.index', ['olt' => $olt->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'id')
            ->where('error.key', 'Failed to fetch data from OLT: :message')
            ->where('error.values.message.key', 'The SNMP RO community is not configured for this OLT.'),
        );
});
