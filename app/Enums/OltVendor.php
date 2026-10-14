<?php

namespace App\Enums;

enum OltVendor: string
{
    case Zte = 'zte';
    case Hioso = 'hioso';

    public function label(): string
    {
        return match ($this) {
            self::Zte => 'ZTE',
            self::Hioso => 'Hioso',
        };
    }

    /**
     * Satu-satunya tempat aturan vendor -> model PON yang didukung.
     * Sesuaikan dengan perangkat yang benar-benar kamu pakai.
     *
     * @return list<PonModel>
     */
    public function supportedModels(): array
    {
        return match ($this) {
            self::Zte => [PonModel::Gpon, PonModel::Epon],
            self::Hioso => [PonModel::Epon],
        };
    }
}