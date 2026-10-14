<?php

namespace App\Http\Requests;

use App\Concerns\ValidatesVendorModel;
use App\Enums\OltProtocol;
use App\Enums\OltVendor;
use App\Enums\PonModel;
use App\Models\Olt;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreOltRequest extends FormRequest
{
    use ValidatesVendorModel;

    public function authorize(): bool
    {
        Gate::authorize('create', Olt::class);

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
        return [
            'nama' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique(Olt::class, 'slug')],
            'host' => ['required', 'string', 'max:255'],
            'model' => ['required', Rule::enum(PonModel::class)],
            'vendor' => ['required', Rule::enum(OltVendor::class)],
            'protocol' => ['required', Rule::enum(OltProtocol::class)],
            'port' => ['nullable', 'integer', 'between:1,65535'],
            'username' => ['nullable', 'required_if:protocol,web', 'string', 'max:255'],
            'password' => ['nullable', 'required_if:protocol,web', 'string', 'max:4096'],
            'snmp_ro' => ['nullable', 'required_if:protocol,snmp', 'string', 'max:4096'],
            'snmp_rw' => ['nullable', 'string', 'max:4096'],
        ];
    }
}