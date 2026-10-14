<?php

use App\Http\Controllers\Tr069\Tr069Controller;
use App\Http\Controllers\Mikrotik\MikrotikController;
use App\Http\Controllers\Olt\OltController;
use App\Http\Controllers\Olt\OnuController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('mikrotiks', MikrotikController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('tr069s', Tr069Controller::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('olts', OltController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::get('onus', [OnuController::class, 'index'])->name('onus.index');
});

require __DIR__ . '/settings.php';
