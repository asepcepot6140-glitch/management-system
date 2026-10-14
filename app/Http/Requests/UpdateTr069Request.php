<?php

namespace App\Http\Requests;

use App\Models\Tr069;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateTr069Request extends FormRequest
{
    public function authorize(): bool
    {
        Gate::authorize('update', $this->route('tr069'));

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
        $tr069 = $this->route('tr069');

        return [
            'nama' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Tr069::class, 'slug')->ignore($tr069),
            ],
            'host' => ['required', 'string', 'max:255'],
            'port' => ['required', 'integer', 'between:1,65535'],
        ];
    }
}
