<?php

namespace App\Concerns;

use App\Enums\OltVendor;
use App\Enums\PonModel;
use Illuminate\Validation\Validator;

/**
 * Menolak kombinasi vendor + model PON yang tidak didukung (mis. Hioso + GPON).
 * Dipakai oleh StoreOltRequest dan UpdateOltRequest.
 */
trait ValidatesVendorModel
{
    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $data = $validator->getData();
                $vendor = OltVendor::tryFrom((string) ($data['vendor'] ?? ''));
                $model = PonModel::tryFrom((string) ($data['model'] ?? ''));

                // Nilai tidak valid sudah ditangani rule enum di rules().
                if ($vendor === null || $model === null) {
                    return;
                }

                if (! in_array($model, $vendor->supportedModels(), true)) {
                    $validator->errors()->add(
                        'model',
                        __('Vendor :vendor tidak mendukung model :model.', [
                            'vendor' => $vendor->label(),
                            'model' => $model->label(),
                        ]),
                    );
                }
            },
        ];
    }
}