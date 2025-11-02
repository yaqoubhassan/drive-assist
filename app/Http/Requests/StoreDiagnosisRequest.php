<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiagnosisRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow both authenticated and guest users to submit diagnoses
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Required fields
            'category' => [
                'required',
                'string',
                'in:engine,brakes,electrical,transmission,tires,other'
            ],
            'description' => [
                'required',
                'string',
                'min:20',
                'max:500',
            ],

            // Optional image uploads
            'images' => [
                'nullable',
                'array',
                'max:5', // Maximum 5 images
            ],
            'images.*' => [
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120', // 5MB per image
            ],

            // Optional voice note
            'voice_note_url' => [
                'nullable',
                'url',
                'max:500',
            ],

            // Optional vehicle information
            'vehicle_id' => [
                'nullable',
                'exists:vehicles,id',
            ],
            'vehicle_make' => [
                'nullable',
                'string',
                'max:100',
                'required_with:vehicle_model,vehicle_year',
            ],
            'vehicle_model' => [
                'nullable',
                'string',
                'max:100',
                'required_with:vehicle_make,vehicle_year',
            ],
            'vehicle_year' => [
                'nullable',
                'integer',
                'min:1900',
                'max:' . (date('Y') + 2), // Allow up to 2 years in the future for upcoming models
                'required_with:vehicle_make,vehicle_model',
            ],
            'mileage' => [
                'nullable',
                'integer',
                'min:0',
                'max:999999',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Category messages
            'category.required' => 'Please select a category for your issue.',
            'category.in' => 'Please select a valid category.',

            // Description messages
            'description.required' => 'Please describe your vehicle issue.',
            'description.min' => 'Please provide at least 20 characters to help us understand the issue better.',
            'description.max' => 'Description is too long. Please keep it under 500 characters.',

            // Image messages
            'images.max' => 'You can upload a maximum of 5 images.',
            'images.*.image' => 'All files must be valid images.',
            'images.*.mimes' => 'Images must be in JPEG, JPG, PNG, or WebP format.',
            'images.*.max' => 'Each image must be less than 5MB in size.',

            // Voice note messages
            'voice_note_url.url' => 'Invalid voice note URL.',
            'voice_note_url.max' => 'Voice note URL is too long.',

            // Vehicle messages
            'vehicle_id.exists' => 'Selected vehicle not found.',
            'vehicle_make.required_with' => 'Please provide the vehicle make.',
            'vehicle_model.required_with' => 'Please provide the vehicle model.',
            'vehicle_year.required_with' => 'Please provide the vehicle year.',
            'vehicle_year.min' => 'Please enter a valid vehicle year.',
            'vehicle_year.max' => 'Please enter a valid vehicle year.',
            'mileage.min' => 'Mileage cannot be negative.',
            'mileage.max' => 'Please enter a valid mileage.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'category' => 'issue category',
            'description' => 'issue description',
            'images' => 'images',
            'images.*' => 'image',
            'voice_note_url' => 'voice note',
            'vehicle_id' => 'vehicle',
            'vehicle_make' => 'vehicle make',
            'vehicle_model' => 'vehicle model',
            'vehicle_year' => 'vehicle year',
            'mileage' => 'mileage',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param \Illuminate\Contracts\Validation\Validator $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Log validation failures for debugging (optional)
        if (app()->environment('local', 'development')) {
            logger()->debug('Diagnosis validation failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $this->except(['images', 'password']),
            ]);
        }

        parent::failedValidation($validator);
    }
}
