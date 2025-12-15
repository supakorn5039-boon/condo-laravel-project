<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('admin');
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_available')) {
            $this->merge([
                'is_available' => filter_var($this->is_available, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }

    public function rules(): array
    {
        $roomId = $this->route('id');

        return [
            'name' => [
                'required',
                'string',
                Rule::unique('rooms', 'name')->ignore($roomId),
                'max:255',
            ],
            'address' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'area' => ['required', 'numeric'],
            'price' => ['required', 'numeric'],
            'type' => ['required', 'string', Rule::in(['rent', 'sale'])],
            'bedrooms' => ['required', 'numeric'],
            'bathrooms' => ['required', 'numeric'],
            'is_available' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Room name is required',
            'name.unique' => 'Room name already exists',
            'address.required' => 'Address is required',
            'area.required' => 'Area is required',
            'bedrooms.required' => 'Number of bedrooms is required',
            'bathrooms.required' => 'Number of bathrooms is required',
            'price.required' => 'Price is required',
            'type.required' => 'Type is required',
            'images.array' => 'Images must be an array',
            'images.*.image' => 'Each file must be an image',
            'images.*.mimes' => 'Images must be jpeg, png, jpg, or webp',
            'images.*.max' => 'Each image must not exceed 5MB',
        ];
    }
}
