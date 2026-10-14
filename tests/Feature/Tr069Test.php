<?php

use App\Models\Tr069;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when requesting TR-069 servers', function () {
    $this->get(route('tr069s.index'))
        ->assertRedirect(route('login'));
});

test('users only see their own TR-069 servers', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $user->tr069s()->create([
        'nama' => 'Main ACS',
        'host' => 'acs.example.test',
        'port' => 7557,
    ]);
    $otherUser->tr069s()->create([
        'nama' => 'Private ACS',
        'host' => 'private.example.test',
        'port' => 7557,
    ]);

    $this->actingAs($user)
        ->get(route('tr069s.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tr069s/index')
            ->has('tr069s', 1)
            ->where('tr069s.0.nama', 'Main ACS'),
        );
});

test('users can create a TR-069 server', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('tr069s.store'), [
            'nama' => 'Main ACS',
            'host' => 'acs.example.test',
            'port' => 7557,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('tr069s.index'));

    $tr069 = Tr069::query()->where('slug', 'main-acs')->firstOrFail();

    $this->assertModelExists($tr069);
    expect($tr069->user_id)->toBe($user->id);
    expect($tr069->host)->toBe('acs.example.test');
    expect($tr069->port)->toBe(7557);
});

test('users receive validation errors for invalid TR-069 server details', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('tr069s.index'))
        ->post(route('tr069s.store'), [
            'nama' => '',
            'host' => '',
            'port' => 65536,
        ])
        ->assertSessionHasErrors(['nama', 'host', 'port'])
        ->assertRedirect(route('tr069s.index'));

    $this->assertDatabaseCount('tr069s', 0);
});

test('users cannot create a TR-069 server with a duplicate slug', function () {
    $user = User::factory()->create();
    $user->tr069s()->create([
        'nama' => 'Main ACS',
        'host' => 'acs.example.test',
        'port' => 7557,
    ]);

    $this->actingAs($user)
        ->post(route('tr069s.store'), [
            'nama' => 'Main ACS',
            'host' => 'other.example.test',
            'port' => 7558,
        ])
        ->assertSessionHasErrors('slug');

    $this->assertDatabaseCount('tr069s', 1);
});

test('users can update their TR-069 servers', function () {
    $user = User::factory()->create();
    $tr069 = $user->tr069s()->create([
        'nama' => 'Main ACS',
        'host' => 'acs.example.test',
        'port' => 7557,
    ]);

    $this->actingAs($user)
        ->put(route('tr069s.update', $tr069), [
            'nama' => 'Backup ACS',
            'host' => 'backup.example.test',
            'port' => 7558,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('tr069s.index'));

    $tr069->refresh();

    expect($tr069->nama)->toBe('Backup ACS');
    expect($tr069->slug)->toBe('backup-acs');
    expect($tr069->host)->toBe('backup.example.test');
    expect($tr069->port)->toBe(7558);
});

test('users cannot update or delete another users TR-069 server', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();
    $tr069 = $owner->tr069s()->create([
        'nama' => 'Private ACS',
        'host' => 'private.example.test',
        'port' => 7557,
    ]);

    $this->actingAs($user)
        ->put(route('tr069s.update', $tr069), [
            'nama' => 'Changed ACS',
            'host' => 'changed.example.test',
            'port' => 7558,
        ])
        ->assertNotFound();

    $this->actingAs($user)
        ->delete(route('tr069s.destroy', $tr069))
        ->assertNotFound();

    $this->assertModelExists($tr069);
});

test('users can delete their TR-069 servers', function () {
    $user = User::factory()->create();
    $tr069 = $user->tr069s()->create([
        'nama' => 'Main ACS',
        'host' => 'acs.example.test',
        'port' => 7557,
    ]);

    $this->actingAs($user)
        ->delete(route('tr069s.destroy', $tr069))
        ->assertRedirect(route('tr069s.index'));

    $this->assertModelMissing($tr069);
});
