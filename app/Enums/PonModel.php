<?php

namespace App\Enums;

enum PonModel: string
{
    case Gpon = 'gpon';
    case Epon = 'epon';

    public function label(): string
    {
        return strtoupper($this->value);
    }
}
