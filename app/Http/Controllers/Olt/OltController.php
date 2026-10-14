<?php

namespace App\Http\Controllers\Olt;

use App\Enums\OltProtocol;
use App\Enums\OltVendor;
use App\Enums\PonModel;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOltRequest;
use App\Http\Requests\UpdateOltRequest;
use App\Models\Olt;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OltController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Olt::class);

        $olts = $this->user($request)
            ->olts()
            ->latest()
            ->get([
                'id',
                'nama',
                'slug',
                'host',
                'model',
                'vendor',
                'protocol',
                'port',
                'username',
                'created_at',
            ]);

        return Inertia::render('olts/index', [
            'olts' => $olts,
            'options' => $this->options(),
        ]);
    }

    public function store(StoreOltRequest $request): RedirectResponse
    {
        // Otorisasi 'create' sudah dilakukan di StoreOltRequest::authorize().
        $this->user($request)
            ->olts()
            ->create($this->normalizeCredentials($request->validated()));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('OLT created successfully.'),
        ]);

        return to_route('olts.index');
    }

    public function show(Olt $olt): RedirectResponse
    {
        Gate::authorize('view', $olt);

        return to_route('olts.index');
    }

    public function edit(Olt $olt): RedirectResponse
    {
        Gate::authorize('update', $olt);

        return to_route('olts.index');
    }

    public function update(UpdateOltRequest $request, Olt $olt): RedirectResponse
    {
        // Otorisasi 'update' sudah dilakukan di UpdateOltRequest::authorize().
        $data = $request->validated();

        // Kredensial kosong = tidak diubah.
        foreach (['password', 'snmp_ro', 'snmp_rw'] as $secret) {
            if (blank($data[$secret] ?? null)) {
                unset($data[$secret]);
            }
        }

        $olt->update($this->normalizeCredentials($data));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('OLT updated successfully.'),
        ]);

        return to_route('olts.index');
    }

    public function destroy(Olt $olt): RedirectResponse
    {
        Gate::authorize('delete', $olt);

        $olt->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('OLT deleted successfully.'),
        ]);

        return to_route('olts.index');
    }

    /**
     * Kosongkan kredensial milik protocol yang tidak dipakai.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeCredentials(array $data): array
    {
        if ($data['protocol'] === OltProtocol::Snmp->value) {
            $data['username'] = null;
            $data['password'] = null;
        } else {
            $data['snmp_ro'] = null;
            $data['snmp_rw'] = null;
        }

        return $data;
    }

    /**
     * Pilihan dropdown untuk frontend. Aturan vendor -> model diambil dari enum,
     * jadi frontend dan validasi backend selalu sama.
     *
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'vendors' => array_map(fn (OltVendor $vendor) => [
                'value' => $vendor->value,
                'label' => $vendor->label(),
                'models' => array_map(
                    fn (PonModel $model) => $model->value,
                    $vendor->supportedModels(),
                ),
            ], OltVendor::cases()),
            'models' => array_map(fn (PonModel $model) => [
                'value' => $model->value,
                'label' => $model->label(),
            ], PonModel::cases()),
            'protocols' => array_map(fn (OltProtocol $protocol) => [
                'value' => $protocol->value,
                'label' => $protocol->label(),
            ], OltProtocol::cases()),
        ];
    }

    private function user(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        return $user;
    }
}
