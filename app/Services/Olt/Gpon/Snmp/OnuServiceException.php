<?php

namespace App\Services\Olt\Gpon\Snmp;

use RuntimeException;

class OnuServiceException extends RuntimeException
{
    /**
     * @param  array<string, int|string>  $translationParameters
     */
    public function __construct(
        public readonly string $translationKey,
        public readonly array $translationParameters = [],
    ) {
        parent::__construct($translationKey);
    }
}
