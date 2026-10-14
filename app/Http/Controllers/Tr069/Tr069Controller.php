<?php

namespace App\Http\Controllers\Tr069;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTr069Request;
use App\Http\Requests\UpdateTr069Request;
use App\Models\Tr069;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class Tr069Controller extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Tr069::class);

        $user = $request->user();
        abort_unless($user instanceof User, 401);

        return Inertia::render('tr069s/index', [
            'tr069s' => $user->tr069s()
                ->latest()
                ->get(['id', 'nama', 'slug', 'host', 'port', 'created_at']),
        ]);
    }

    public function store(StoreTr069Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        $user->tr069s()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('TR-069 server created successfully.'),
        ]);

        return to_route('tr069s.index');
    }

    public function update(UpdateTr069Request $request, Tr069 $tr069): RedirectResponse
    {
        $tr069->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('TR-069 server updated successfully.'),
        ]);

        return to_route('tr069s.index');
    }

    public function destroy(Tr069 $tr069): RedirectResponse
    {
        Gate::authorize('delete', $tr069);

        $tr069->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('TR-069 server deleted successfully.'),
        ]);

        return to_route('tr069s.index');
    }
}
