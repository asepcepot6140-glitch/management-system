<?php

use App\Models\Mikrotik;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when requesting mikrotiks', function () {
    $this->get(route('mikrotiks.index'))
        ->assertRedirect(route('login'));
});

test('users only see their own mikrotiks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $user->mikrotiks()->create([
        'nama' => 'Core Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'core-secret',
    ]);
    $otherUser->mikrotiks()->create([
        'nama' => 'Other Router',
        'ip' => '192.0.2.2',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'other-secret',
    ]);

    $this->actingAs($user)
        ->get(route('mikrotiks.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mikrotiks/index')
            ->has('mikrotiks', 1)
            ->where('mikrotiks.0.nama', 'Core Router'),
        );
});

test('users can create mikrotiks with encrypted passwords', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('mikrotiks.store'), [
            'nama' => 'Core Router',
            'ip' => '192.0.2.1',
            'port' => 8728,
            'username' => 'admin',
            'password' => 'core-secret',
        ]);

    $mikrotik = Mikrotik::query()->where('slug', 'core-router')->firstOrFail();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('mikrotiks.index'));

    $this->assertModelExists($mikrotik);
    expect($mikrotik->user_id)->toBe($user->id);
    expect($mikrotik->password)->toBe('core-secret');
    expect($mikrotik->toArray())->not->toHaveKey('password');

    $this->actingAs($user)
        ->get(route('mikrotiks.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mikrotiks/index')
            ->where('mikrotiks.0.nama', 'Core Router')
            ->missing('mikrotiks.0.password'),
        );
});

test('users receive validation errors for invalid mikrotik details', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('mikrotiks.index'))
        ->post(route('mikrotiks.store'), [
            'nama' => 'Core Router',
            'ip' => 'not-an-ip-address',
            'port' => 65536,
            'username' => 'admin',
            'password' => 'core-secret',
        ])
        ->assertSessionHasErrors(['ip', 'port'])
        ->assertRedirect(route('mikrotiks.index'));

    $this->assertDatabaseCount('mikrotiks', 0);
});

test('users cannot create a mikrotik with a duplicate slug', function () {
    $user = User::factory()->create();
    $user->mikrotiks()->create([
        'nama' => 'Core Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'core-secret',
    ]);

    $this->actingAs($user)
        ->post(route('mikrotiks.store'), [
            'nama' => 'Core Router',
            'ip' => '192.0.2.2',
            'port' => 8728,
            'username' => 'admin',
            'password' => 'another-secret',
        ])
        ->assertSessionHasErrors('slug');

    $this->assertDatabaseCount('mikrotiks', 1);
});

test('users can update mikrotiks without replacing the password', function () {
    $user = User::factory()->create();
    $mikrotik = $user->mikrotiks()->create([
        'nama' => 'Core Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'core-secret',
    ]);

    $this->actingAs($user)
        ->put(route('mikrotiks.update', $mikrotik), [
            'nama' => 'Edge Router',
            'ip' => '192.0.2.10',
            'port' => 8729,
            'username' => 'operator',
            'password' => '',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('mikrotiks.index'));

    $mikrotik->refresh();

    expect($mikrotik->nama)->toBe('Edge Router');
    expect($mikrotik->slug)->toBe('edge-router');
    expect($mikrotik->ip)->toBe('192.0.2.10');
    expect($mikrotik->port)->toBe(8729);
    expect($mikrotik->password)->toBe('core-secret');
});

test('users can change a mikrotik password', function () {
    $user = User::factory()->create();
    $mikrotik = $user->mikrotiks()->create([
        'nama' => 'Core Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'core-secret',
    ]);

    $this->actingAs($user)
        ->put(route('mikrotiks.update', $mikrotik), [
            'nama' => 'Core Router',
            'ip' => '192.0.2.1',
            'port' => 8728,
            'username' => 'admin',
            'password' => 'new-secret',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('mikrotiks.index'));

    expect($mikrotik->refresh()->password)->toBe('new-secret');
});

test('users cannot view or modify another users mikrotik', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();
    $mikrotik = $owner->mikrotiks()->create([
        'nama' => 'Private Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'private-secret',
    ]);

    $this->actingAs($user)
        ->put(route('mikrotiks.update', $mikrotik), [])
        ->assertNotFound();

    $this->actingAs($user)
        ->delete(route('mikrotiks.destroy', $mikrotik))
        ->assertNotFound();

    $this->assertModelExists($mikrotik);
});

test('users can delete their mikrotiks', function () {
    $user = User::factory()->create();
    $mikrotik = $user->mikrotiks()->create([
        'nama' => 'Core Router',
        'ip' => '192.0.2.1',
        'port' => 8728,
        'username' => 'admin',
        'password' => 'core-secret',
    ]);

    $this->actingAs($user)
        ->delete(route('mikrotiks.destroy', $mikrotik))
        ->assertRedirect(route('mikrotiks.index'));

    $this->assertModelMissing($mikrotik);
});
