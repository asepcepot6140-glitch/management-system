<?php

namespace App\Http\Controllers\Mikrotik;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMikrotikRequest;
use App\Http\Requests\UpdateMikrotikRequest;
use App\Models\Mikrotik;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MikrotikController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Mikrotik::class);

        $user = $request->user();
        abort_unless($user instanceof User, 401);

        $mikrotiks = $user->mikrotiks()
            ->latest()
            ->get(['id', 'nama', 'slug', 'ip', 'port', 'username', 'created_at']);

        return Inertia::render('mikrotiks/index', [
            'mikrotiks' => $mikrotiks,
        ]);
    }

    public function store(StoreMikrotikRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        $mikrotik = $user->mikrotiks()
            ->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Mikrotik created successfully.'),
        ]);

        return to_route('mikrotiks.index');
    }

    public function update(UpdateMikrotikRequest $request, Mikrotik $mikrotik): RedirectResponse
    {
        $data = $request->validated();

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $mikrotik->update($data);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Mikrotik updated successfully.'),
        ]);

        return to_route('mikrotiks.index');
    }

    public function destroy(Mikrotik $mikrotik): RedirectResponse
    {
        Gate::authorize('delete', $mikrotik);

        $mikrotik->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Mikrotik deleted successfully.'),
        ]);

        return to_route('mikrotiks.index');
    }
}
