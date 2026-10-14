<?php

namespace App\Http\Requests;

use App\Models\Mikrotik;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateMikrotikRequest extends FormRequest
{
    public function authorize(): bool
    {
        Gate::authorize('update', $this->route('mikrotik'));

        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug((string) $this->input('nama')),
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $mikrotik = $this->route('mikrotik');

        return [
            'nama' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Mikrotik::class, 'slug')->ignore($mikrotik),
            ],
            'ip' => ['required', 'ip'],
            'port' => ['required', 'integer', 'between:1,65535'],
            'username' => ['required', 'string', 'max:255'],
            'password' => ['sometimes', 'nullable', 'string', 'max:4096'],
        ];
    }
}
