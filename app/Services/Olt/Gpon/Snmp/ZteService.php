<?php

namespace App\Services\Olt\Gpon\Snmp;

use App\Models\Olt;
use SNMP;

class ZteService
{
    private const OID_ONU_NAME = '1.3.6.1.4.1.3902.1082.500.10.2.3.3.1.2';

    private const OID_ONU_SERIAL = '1.3.6.1.4.1.3902.1082.500.10.2.3.3.1.18';

    private const OID_ONU_PHASE_STATUS = '1.3.6.1.4.1.3902.1082.500.10.2.3.8.1.4';

    private const OID_ONU_RX_POWER = '1.3.6.1.4.1.3902.1082.500.20.2.2.2.1.10';

    private const PHASE_STATUS = [
        1 => 'logging',
        2 => 'los',
        3 => 'syncMib',
        4 => 'working',
        5 => 'dyingGasp',
        6 => 'authFailed',
        7 => 'offline',
    ];

    private ?SNMP $session = null;

    public function __construct(private readonly Olt $olt) {}

    /**
     * @return list<array{
     *     index: string,
     *     if_index: int,
     *     olt_port: string,
     *     onu_id: int,
     *     interface: string,
     *     name: string|null,
     *     serial_number: string|null,
     *     status: string,
     *     status_code: int|null,
     *     rx_power: float|null,
     *     rx_power_status: 'na'|'danger'|'warning'|'good',
     *     rx_power_raw: float|null
     * }>
     */
    public function onuList(?int $ifIndex = null): array
    {
        $serials = $this->walk(self::OID_ONU_SERIAL);
        $names = $this->walk(self::OID_ONU_NAME);
        $statuses = $this->walk(self::OID_ONU_PHASE_STATUS);

        $onus = [];

        foreach ($serials as $index => $rawSerial) {
            [$ifIndexValue, $onuId] = $this->splitKey($index);

            if ($ifIndexValue === null) {
                continue;
            }

            if ($ifIndex !== null && $ifIndexValue !== $ifIndex) {
                continue;
            }

            $statusCode = isset($statuses[$index])
                ? (int) $statuses[$index]
                : null;

            $rxRaw = $this->get(
                self::OID_ONU_RX_POWER.'.'.$index.'.1'
            );

            $rx = $this->rxPower($rxRaw);

            $oltPort = $this->oltPort($ifIndexValue);

            $onus[] = [
                'index' => $index,
                'if_index' => $ifIndexValue,
                'olt_port' => $oltPort,
                'onu_id' => $onuId,
                'interface' => "gpon-onu_{$oltPort}:{$onuId}",
                'name' => $this->clean($names[$index] ?? null),
                'serial_number' => $this->parseSerial($rawSerial),
                'status' => self::PHASE_STATUS[$statusCode] ?? 'unknown',
                'status_code' => $statusCode,
                'rx_power' => $rx['value'],
                'rx_power_status' => $rx['status'],
                'rx_power_raw' => is_numeric($rxRaw) ? (float) $rxRaw : null,
            ];
        }

        usort(
            $onus,
            fn (array $a, array $b) => [$a['if_index'], $a['onu_id']] <=> [$b['if_index'], $b['onu_id']],
        );

        return $onus;
    }

    /**
     * @return array{value: float|null, status: 'na'|'danger'|'warning'|'good'}
     */
    private function rxPower(mixed $value): array
    {
        if (! is_numeric($value) || (int) $value === 65535) {
            return [
                'value' => null,
                'status' => 'na',
            ];
        }

        $dbm = ((float) $value * 0.002) - 30;

        if ($dbm <= -40) {
            return [
                'value' => null,
                'status' => 'na',
            ];
        }

        return [
            'value' => round($dbm, 2),
            'status' => match (true) {
                $dbm < -27 => 'danger',
                $dbm < -24 => 'warning',
                default => 'good',
            },
        ];
    }

    private function get(string $oid): mixed
    {
        try {
            $result = @$this->session()->get($oid);

            return $result === false ? null : $this->clean($result);
        } catch (\Throwable) {
            return null;
        }
    }

    /** @return array<string, mixed> */
    private function walk(string $oid): array
    {
        $session = $this->session();

        try {
            $result = @$session->walk($oid, true);

            if ($result === false) {
                if ($session->getErrno() === SNMP::ERRNO_NOERROR) {
                    return [];
                }

                throw new OnuServiceException(
                    'SNMP walk failed (:host): :error',
                    [
                        'host' => $this->olt->host,
                        'error' => $session->getError(),
                    ],
                );
            }

            $normalized = [];
            $prefix = ltrim($oid, '.').'.';

            foreach ($result as $key => $value) {
                $key = ltrim((string) $key, '.');

                if (str_starts_with($key, $prefix)) {
                    $key = substr($key, strlen($prefix));
                }

                $normalized[$key] = $value;
            }

            return $normalized;
        } catch (OnuServiceException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            throw new OnuServiceException(
                'SNMP walk failed (:host): :error',
                [
                    'host' => $this->olt->host,
                    'error' => $exception->getMessage(),
                ],
            );
        }
    }

    private function session(): SNMP
    {
        if ($this->session instanceof SNMP) {
            return $this->session;
        }

        if (! extension_loaded('snmp')) {
            throw new OnuServiceException(
                'The PHP SNMP extension is not enabled. Enable the extension and restart PHP.',
            );
        }

        $community = $this->olt->snmp_ro;

        if (! is_string($community) || $community === '') {
            throw new OnuServiceException(
                'The SNMP RO community is not configured for this OLT.',
            );
        }

        $session = new SNMP(
            SNMP::VERSION_2C,
            $this->olt->host.':'.($this->olt->port ?? 161),
            $community,
            3_000_000,
            1,
        );

        $session->oid_output_format = SNMP_OID_OUTPUT_NUMERIC;
        $session->valueretrieval = SNMP_VALUE_PLAIN;
        $session->max_oids = 20;
        $session->exceptions_enabled = SNMP::ERRNO_ANY;

        return $this->session = $session;
    }

    /** @return array{0: int|null, 1: int} */
    private function splitKey(string $key): array
    {
        $parts = explode('.', $key);

        if (count($parts) !== 2 || ! ctype_digit($parts[0]) || ! ctype_digit($parts[1])) {
            return [null, 0];
        }

        return [(int) $parts[0], (int) $parts[1]];
    }

    private function oltPort(int $ifIndex): string
    {
        $shelf = ($ifIndex >> 16) & 0xFF;
        $slot = ($ifIndex >> 8) & 0xFF;
        $port = $ifIndex & 0xFF;

        return "{$shelf}/{$slot}/{$port}";
    }

    private function parseSerial(mixed $value): ?string
    {
        $value = $this->clean($value);

        if ($value === null) {
            return null;
        }

        $parts = explode(',', $value, 2);

        return $this->clean($parts[1] ?? $parts[0]);
    }

    private function clean(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value, " \t\n\r\0\x0B\"");

        return $value === '' ? null : $value;
    }

    public function __destruct()
    {
        $this->session?->close();
    }
}
