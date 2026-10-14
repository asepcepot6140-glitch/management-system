<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'user_id',
    'nama',
    'slug',
    'host',
    'model',
    'vendor',
    'protocol',
    'port',
    'username',
    'password',
    'snmp_ro',
    'snmp_rw',
])]
#[Hidden(['password', 'snmp_ro', 'snmp_rw'])]
class Olt extends Model
{
    protected function nama(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => [
                'nama' => $value,
                'slug' => Str::slug($value),
            ],
        );
    }

    protected function casts(): array
    {
        return [
            'password' => 'encrypted',
            'snmp_ro' => 'encrypted',
            'snmp_rw' => 'encrypted',
            'port' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}