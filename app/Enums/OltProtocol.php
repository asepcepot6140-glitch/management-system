<?php

namespace App\Enums;

enum OltProtocol: string
{
    case Snmp = 'snmp';
    case Web = 'web';

    public function label(): string
    {
        return match ($this) {
            self::Snmp => 'SNMP',
            self::Web => 'Web',
        };
    }
}