<?php

namespace App\Http\Controllers\Olt;

use App\Enums\OltProtocol;
use App\Enums\OltVendor;
use App\Enums\PonModel;
use App\Http\Controllers\Controller;
use App\Models\Olt;
use App\Models\User;
use App\Services\Olt\Gpon\Snmp\OnuServiceException;
use App\Services\Olt\Gpon\Snmp\ZteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class OnuController extends Controller
{
    private const CACHE_SECONDS = 30;

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Olt::class);

        $user = $this->user($request);

        $olts = $user->olts()
            ->orderBy('nama')
            ->get(['id', 'nama', 'slug', 'host', 'vendor', 'model', 'protocol']);

        $onus = [];
        $error = null;
        $selectedSlug = null;

        $slug = $request->query('olt');

        if (is_string($slug) && $slug !== '') {
            $olt = $user->olts()->where('slug', $slug)->first();

            if ($olt === null) {
                $error = ['key' => 'OLT not found.'];
            } else {
                Gate::authorize('view', $olt);

                $selectedSlug = $olt->slug;
                [$onus, $error] = $this->loadOnus($olt, $request->boolean('refresh'));
            }
        }

        $collection = collect($onus);

        return Inertia::render('onus/index', [
            'olts' => $olts,
            'selectedOlt' => $selectedSlug,
            'onus' => $onus,
            'ports' => $collection->pluck('olt_port')->unique()->values(),
            'statusCounts' => $collection->countBy('status'),
            'error' => $error,
        ]);
    }

    private function loadOnus(Olt $olt, bool $refresh): array
    {
        $service = $this->service($olt);

        if ($service === null) {
            return [[], ['key' => 'ONU listing is not supported for this OLT vendor, model, and protocol combination.']];
        }

        $key = "olt:{$olt->id}:onus";

        if ($refresh) {
            Cache::forget($key);
        }

        try {
            $onus = Cache::remember($key, self::CACHE_SECONDS, fn () => $service->onuList());

            return [$onus, null];
        } catch (OnuServiceException $exception) {
            report($exception);

            return [[], [
                'key' => 'Failed to fetch data from OLT: :message',
                'values' => [
                    'message' => [
                        'key' => $exception->translationKey,
                        'values' => $exception->translationParameters,
                    ],
                ],
            ]];
        } catch (RuntimeException $exception) {
            report($exception);

            return [[], [
                'key' => 'Failed to fetch data from OLT: :message',
                'values' => ['message' => $exception->getMessage()],
            ]];
        }
    }

    private function service(Olt $olt): ?ZteService
    {
        $isZteGponSnmp = $olt->vendor === OltVendor::Zte->value
            && $olt->model === PonModel::Gpon->value
            && $olt->protocol === OltProtocol::Snmp->value;

        return $isZteGponSnmp ? new ZteService($olt) : null;
    }

    private function user(Request $request): User
    {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        return $user;
    }
}