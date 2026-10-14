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
    'ip',
    'port',
    'username',
    'password',
])]
#[Hidden(['password'])]
class Mikrotik extends Model
{
    /** @return Attribute<never, string> */
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
            'port' => 'integer',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
