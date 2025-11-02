<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExpertOnboardingController extends Controller
{
    /**
     * Display the onboarding form
     */
    public function index()
    {
        $user = auth()->user();

        // Ensure user is an expert
        if ($user->user_type !== 'expert') {
            return redirect()->route('home')
                ->with('error', 'Access denied.');
        }

        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return redirect()->route('home')
                ->with('error', 'Profile not found. Please contact support.');
        }

        // If profile is already completed, redirect to dashboard
        if ($expertProfile->profile_completed) {
            return redirect()->route('expert.dashboard')
                ->with('info', 'Your profile is already complete.');
        }

        DB::beginTransaction();
        try {
            // Get current specialties
            $currentSpecialties = $expertProfile->specialties()
                ->pluck('specialty')
                ->toArray();

            DB::commit();

            return Inertia::render('Expert/Onboarding', [
                'expert' => [
                    'current_step' => $expertProfile->current_onboarding_step ?? 1,
                    'phone' => $user->phone ?? '',
                    'business_name' => $expertProfile->business_name ?? '',
                    'business_type' => $expertProfile->business_type ?? 'mechanic',
                    'bio' => $expertProfile->bio,
                    'years_experience' => $expertProfile->years_experience,
                    'employee_count' => $expertProfile->employee_count,
                    'service_radius_km' => $expertProfile->service_radius_km ?? 25,
                    'business_address' => $user->location_address ?? '',
                    'location_latitude' => $user->location_latitude ? (float)$user->location_latitude : null,
                    'location_longitude' => $user->location_longitude ? (float)$user->location_longitude : null,
                    'specialties' => $currentSpecialties,
                    'hourly_rate_min' => $expertProfile->hourly_rate_min ? (float)$expertProfile->hourly_rate_min : null,
                    'hourly_rate_max' => $expertProfile->hourly_rate_max ? (float)$expertProfile->hourly_rate_max : null,
                    'diagnostic_fee' => $expertProfile->diagnostic_fee ? (float)$expertProfile->diagnostic_fee : null,
                    'accepts_emergency' => $expertProfile->accepts_emergency ?? false,
                    'monday_open' => $expertProfile->monday_open,
                    'monday_close' => $expertProfile->monday_close,
                    'tuesday_open' => $expertProfile->tuesday_open,
                    'tuesday_close' => $expertProfile->tuesday_close,
                    'wednesday_open' => $expertProfile->wednesday_open,
                    'wednesday_close' => $expertProfile->wednesday_close,
                    'thursday_open' => $expertProfile->thursday_open,
                    'thursday_close' => $expertProfile->thursday_close,
                    'friday_open' => $expertProfile->friday_open,
                    'friday_close' => $expertProfile->friday_close,
                    'saturday_open' => $expertProfile->saturday_open,
                    'saturday_close' => $expertProfile->saturday_close,
                    'sunday_open' => $expertProfile->sunday_open,
                    'sunday_close' => $expertProfile->sunday_close,
                ],
                'businessTypes' => [
                    'mechanic' => 'Auto Mechanic / General Repair',
                    'electrician' => 'Auto Electrician',
                    'body_shop' => 'Body Shop / Collision Repair',
                    'mobile_mechanic' => 'Mobile Mechanic',
                    'other' => 'Other Automotive Service',
                ],
                'availableSpecialties' => [
                    'engine' => 'Engine Repair',
                    'brakes' => 'Brake Service',
                    'electrical' => 'Electrical Systems',
                    'transmission' => 'Transmission',
                    'tires' => 'Tires & Wheels',
                    'bodywork' => 'Body Work',
                    'diagnostics' => 'Diagnostics',
                    'maintenance' => 'Maintenance',
                    'air_conditioning' => 'A/C & Heating',
                    'suspension' => 'Suspension',
                    'exhaust' => 'Exhaust Systems',
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->route('home')
                ->with('error', 'Unable to load onboarding. Please contact support.');
        }
    }

    public function saveProgress(Request $request)
    {
        $user = auth()->user();

        // Ensure user is an expert
        if ($user->user_type !== 'expert') {
            return back()->with('error', 'Access denied.');
        }

        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return back()->with('error', 'Profile not found.');
        }

        // Validate only the fields that are provided (partial validation)
        $validated = $request->validate([
            'current_step' => 'required|integer|min:1|max:5',
            'phone' => 'nullable|string|max:20',
            'business_name' => 'nullable|string|max:255',
            'business_type' => 'nullable|in:mechanic,electrician,body_shop,mobile_mechanic,other',
            'bio' => 'nullable|string|max:1000',
            'years_experience' => 'nullable|integer|min:0|max:99',
            'business_address' => 'nullable|string|max:500',
            'location_latitude' => 'nullable|numeric|between:-90,90',
            'location_longitude' => 'nullable|numeric|between:-180,180',
            'service_radius_km' => 'nullable|integer|min:5|max:100',
            'specialties' => 'nullable|array',
            'specialties.*' => 'string|in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',
            'employee_count' => 'nullable|integer|min:1|max:999',
            'hourly_rate_min' => 'nullable|numeric|min:0|max:9999.99',
            'hourly_rate_max' => 'nullable|numeric|min:0|max:9999.99',
            'diagnostic_fee' => 'nullable|numeric|min:0|max:9999.99',
            'accepts_emergency' => 'nullable|boolean',
            'monday_open' => 'nullable|date_format:H:i',
            'monday_close' => 'nullable|date_format:H:i',
            'tuesday_open' => 'nullable|date_format:H:i',
            'tuesday_close' => 'nullable|date_format:H:i',
            'wednesday_open' => 'nullable|date_format:H:i',
            'wednesday_close' => 'nullable|date_format:H:i',
            'thursday_open' => 'nullable|date_format:H:i',
            'thursday_close' => 'nullable|date_format:H:i',
            'friday_open' => 'nullable|date_format:H:i',
            'friday_close' => 'nullable|date_format:H:i',
            'saturday_open' => 'nullable|date_format:H:i',
            'saturday_close' => 'nullable|date_format:H:i',
            'sunday_open' => 'nullable|date_format:H:i',
            'sunday_close' => 'nullable|date_format:H:i',
        ]);

        DB::beginTransaction();
        try {
            // Update user phone if provided
            if (isset($validated['phone']) && $validated['phone']) {
                $user->update(['phone' => $validated['phone']]);
            }

            // Update user location if provided
            if (isset($validated['business_address']) && $validated['business_address']) {
                $user->update([
                    'location_address' => $validated['business_address'],
                    'location_latitude' => $validated['location_latitude'] ?? $user->location_latitude,
                    'location_longitude' => $validated['location_longitude'] ?? $user->location_longitude,
                ]);
            }

            // Update expert profile with any provided fields
            $profileData = [];
            if (isset($validated['business_name'])) $profileData['business_name'] = $validated['business_name'];
            if (isset($validated['business_type'])) $profileData['business_type'] = $validated['business_type'];
            if (isset($validated['bio'])) $profileData['bio'] = $validated['bio'];
            if (isset($validated['years_experience'])) $profileData['years_experience'] = $validated['years_experience'];
            if (isset($validated['service_radius_km'])) $profileData['service_radius_km'] = $validated['service_radius_km'];
            if (isset($validated['employee_count'])) $profileData['employee_count'] = $validated['employee_count'];
            if (isset($validated['hourly_rate_min'])) $profileData['hourly_rate_min'] = $validated['hourly_rate_min'];
            if (isset($validated['hourly_rate_max'])) $profileData['hourly_rate_max'] = $validated['hourly_rate_max'];
            if (isset($validated['diagnostic_fee'])) $profileData['diagnostic_fee'] = $validated['diagnostic_fee'];
            if (isset($validated['accepts_emergency'])) $profileData['accepts_emergency'] = $validated['accepts_emergency'];

            // Operating hours
            $hoursFields = [
                'monday_open',
                'monday_close',
                'tuesday_open',
                'tuesday_close',
                'wednesday_open',
                'wednesday_close',
                'thursday_open',
                'thursday_close',
                'friday_open',
                'friday_close',
                'saturday_open',
                'saturday_close',
                'sunday_open',
                'sunday_close',
            ];

            foreach ($hoursFields as $field) {
                if (isset($validated[$field])) {
                    $profileData[$field] = $validated[$field];
                }
            }

            // Save the current step
            $profileData['current_onboarding_step'] = $validated['current_step'];

            if (!empty($profileData)) {
                $expertProfile->update($profileData);
            }

            // Update specialties if provided
            if (isset($validated['specialties']) && is_array($validated['specialties'])) {
                // Delete existing specialties
                $expertProfile->specialties()->delete();

                // Create new ones
                foreach ($validated['specialties'] as $specialty) {
                    $expertProfile->specialties()->create([
                        'specialty' => $specialty,
                    ]);
                }
            }

            DB::commit();

            // ✅ NO LOGOUT - Just return success
            // User stays logged in and can continue onboarding
            return back()->with('success', 'Progress saved automatically.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Failed to save progress. Please try again.');
        }
    }

    /**
     * Save progress and allow user to continue later
     * This logs out the user after saving
     */
    public function save(Request $request)
    {
        $user = auth()->user();

        // Ensure user is an expert
        if ($user->user_type !== 'expert') {
            return redirect()->route('home')
                ->with('error', 'Access denied.');
        }

        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return redirect()->route('expert.onboarding.index')
                ->with('error', 'Profile not found. Please start over.');
        }

        // Validate (same validation as saveProgress)
        $validated = $request->validate([
            'current_step' => 'required|integer|min:1|max:5',
            'phone' => 'nullable|string|max:20',
            'business_name' => 'nullable|string|max:255',
            'business_type' => 'nullable|in:mechanic,electrician,body_shop,mobile_mechanic,other',
            'bio' => 'nullable|string|max:1000',
            'years_experience' => 'nullable|integer|min:0|max:99',
            'business_address' => 'nullable|string|max:500',
            'location_latitude' => 'nullable|numeric|between:-90,90',
            'location_longitude' => 'nullable|numeric|between:-180,180',
            'service_radius_km' => 'nullable|integer|min:5|max:100',
            'specialties' => 'nullable|array',
            'specialties.*' => 'string|in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',
            'employee_count' => 'nullable|integer|min:1|max:999',
            'hourly_rate_min' => 'nullable|numeric|min:0|max:9999.99',
            'hourly_rate_max' => 'nullable|numeric|min:0|max:9999.99',
            'diagnostic_fee' => 'nullable|numeric|min:0|max:9999.99',
            'accepts_emergency' => 'nullable|boolean',
            'monday_open' => 'nullable|date_format:H:i',
            'monday_close' => 'nullable|date_format:H:i',
            'tuesday_open' => 'nullable|date_format:H:i',
            'tuesday_close' => 'nullable|date_format:H:i',
            'wednesday_open' => 'nullable|date_format:H:i',
            'wednesday_close' => 'nullable|date_format:H:i',
            'thursday_open' => 'nullable|date_format:H:i',
            'thursday_close' => 'nullable|date_format:H:i',
            'friday_open' => 'nullable|date_format:H:i',
            'friday_close' => 'nullable|date_format:H:i',
            'saturday_open' => 'nullable|date_format:H:i',
            'saturday_close' => 'nullable|date_format:H:i',
            'sunday_open' => 'nullable|date_format:H:i',
            'sunday_close' => 'nullable|date_format:H:i',
        ]);

        DB::beginTransaction();
        try {
            // Same save logic as saveProgress()
            // Update user phone
            if (isset($validated['phone']) && $validated['phone']) {
                $user->update(['phone' => $validated['phone']]);
            }

            // Update user location
            if (isset($validated['business_address']) && $validated['business_address']) {
                $user->update([
                    'location_address' => $validated['business_address'],
                    'location_latitude' => $validated['location_latitude'] ?? $user->location_latitude,
                    'location_longitude' => $validated['location_longitude'] ?? $user->location_longitude,
                ]);
            }

            // Update expert profile
            $profileData = [];
            if (isset($validated['business_name'])) $profileData['business_name'] = $validated['business_name'];
            if (isset($validated['business_type'])) $profileData['business_type'] = $validated['business_type'];
            if (isset($validated['bio'])) $profileData['bio'] = $validated['bio'];
            if (isset($validated['years_experience'])) $profileData['years_experience'] = $validated['years_experience'];
            if (isset($validated['service_radius_km'])) $profileData['service_radius_km'] = $validated['service_radius_km'];
            if (isset($validated['employee_count'])) $profileData['employee_count'] = $validated['employee_count'];
            if (isset($validated['hourly_rate_min'])) $profileData['hourly_rate_min'] = $validated['hourly_rate_min'];
            if (isset($validated['hourly_rate_max'])) $profileData['hourly_rate_max'] = $validated['hourly_rate_max'];
            if (isset($validated['diagnostic_fee'])) $profileData['diagnostic_fee'] = $validated['diagnostic_fee'];
            if (isset($validated['accepts_emergency'])) $profileData['accepts_emergency'] = $validated['accepts_emergency'];

            // Operating hours
            $hoursFields = [
                'monday_open',
                'monday_close',
                'tuesday_open',
                'tuesday_close',
                'wednesday_open',
                'wednesday_close',
                'thursday_open',
                'thursday_close',
                'friday_open',
                'friday_close',
                'saturday_open',
                'saturday_close',
                'sunday_open',
                'sunday_close',
            ];

            foreach ($hoursFields as $field) {
                if (isset($validated[$field])) {
                    $profileData[$field] = $validated[$field];
                }
            }

            // Save current step
            $profileData['current_onboarding_step'] = $validated['current_step'];

            if (!empty($profileData)) {
                $expertProfile->update($profileData);
            }

            // Update specialties
            if (isset($validated['specialties']) && is_array($validated['specialties'])) {
                $expertProfile->specialties()->delete();
                foreach ($validated['specialties'] as $specialty) {
                    $expertProfile->specialties()->create(['specialty' => $specialty]);
                }
            }

            DB::commit();

            // ✅ NOW logout (only for "Save & Exit")
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('success', 'Progress saved! Log in anytime to continue where you left off.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->with('error', 'Failed to save progress. Please try again.');
        }
    }

    /**
     * Complete the onboarding process
     */
    public function complete(Request $request)
    {
        $user = auth()->user();

        // Ensure user is an expert
        if ($user->user_type !== 'expert') {
            return redirect()->route('home')
                ->with('error', 'Access denied.');
        }

        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return redirect()->route('expert.onboarding.index')
                ->with('error', 'Profile not found. Please start over.');
        }

        // Validate all required fields for completion
        $validated = $request->validate([
            'phone' => 'required|string|max:20',
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|in:mechanic,electrician,body_shop,mobile_mechanic,other',
            'business_address' => 'required|string|max:500',
            'location_latitude' => 'required|numeric|between:-90,90',
            'location_longitude' => 'required|numeric|between:-180,180',
            'service_radius_km' => 'required|integer|min:5|max:100',
            'specialties' => 'required|array|min:1',
            'specialties.*' => 'string|in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',
            'bio' => 'nullable|string|max:1000',
            'years_experience' => 'nullable|integer|min:0|max:99',
            'employee_count' => 'nullable|integer|min:1|max:999',
            'hourly_rate_min' => 'nullable|numeric|min:0|max:9999.99',
            'hourly_rate_max' => 'nullable|numeric|min:0|max:9999.99',
            'diagnostic_fee' => 'nullable|numeric|min:0|max:9999.99',
            'accepts_emergency' => 'nullable|boolean',
            'monday_open' => 'nullable|date_format:H:i',
            'monday_close' => 'nullable|date_format:H:i',
            'tuesday_open' => 'nullable|date_format:H:i',
            'tuesday_close' => 'nullable|date_format:H:i',
            'wednesday_open' => 'nullable|date_format:H:i',
            'wednesday_close' => 'nullable|date_format:H:i',
            'thursday_open' => 'nullable|date_format:H:i',
            'thursday_close' => 'nullable|date_format:H:i',
            'friday_open' => 'nullable|date_format:H:i',
            'friday_close' => 'nullable|date_format:H:i',
            'saturday_open' => 'nullable|date_format:H:i',
            'saturday_close' => 'nullable|date_format:H:i',
            'sunday_open' => 'nullable|date_format:H:i',
            'sunday_close' => 'nullable|date_format:H:i',
        ]);

        DB::beginTransaction();
        try {
            // Update user information
            $user->update([
                'phone' => $validated['phone'],
                'location_address' => $validated['business_address'],
                'location_latitude' => $validated['location_latitude'],
                'location_longitude' => $validated['location_longitude'],
            ]);

            // Update expert profile
            $expertProfile->update([
                'business_name' => $validated['business_name'],
                'business_type' => $validated['business_type'],
                'bio' => $validated['bio'] ?? null,
                'years_experience' => $validated['years_experience'] ?? null,
                'employee_count' => $validated['employee_count'] ?? null,
                'service_radius_km' => $validated['service_radius_km'],
                'hourly_rate_min' => $validated['hourly_rate_min'] ?? null,
                'hourly_rate_max' => $validated['hourly_rate_max'] ?? null,
                'diagnostic_fee' => $validated['diagnostic_fee'] ?? null,
                'accepts_emergency' => $validated['accepts_emergency'] ?? false,
                'monday_open' => $validated['monday_open'] ?? null,
                'monday_close' => $validated['monday_close'] ?? null,
                'tuesday_open' => $validated['tuesday_open'] ?? null,
                'tuesday_close' => $validated['tuesday_close'] ?? null,
                'wednesday_open' => $validated['wednesday_open'] ?? null,
                'wednesday_close' => $validated['wednesday_close'] ?? null,
                'thursday_open' => $validated['thursday_open'] ?? null,
                'thursday_close' => $validated['thursday_close'] ?? null,
                'friday_open' => $validated['friday_open'] ?? null,
                'friday_close' => $validated['friday_close'] ?? null,
                'saturday_open' => $validated['saturday_open'] ?? null,
                'saturday_close' => $validated['saturday_close'] ?? null,
                'sunday_open' => $validated['sunday_open'] ?? null,
                'sunday_close' => $validated['sunday_close'] ?? null,
                'profile_completed' => true,
                'current_onboarding_step' => 5, // Mark as completed
                'verification_status' => 'pending', // Trigger manual review
            ]);

            // Update specialties
            // Delete all existing specialties
            $expertProfile->specialties()->delete();

            // Create new specialties
            foreach ($validated['specialties'] as $specialty) {
                $expertProfile->specialties()->create([
                    'specialty' => $specialty,
                ]);
            }

            DB::commit();

            // TODO: Send email to admin for verification
            // TODO: Send confirmation email to expert

            return redirect()->route('expert.dashboard')
                ->with('success', 'Profile completed! We\'ll review your information and notify you within 24-48 hours.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to complete profile. Please try again.']);
        }
    }
}
