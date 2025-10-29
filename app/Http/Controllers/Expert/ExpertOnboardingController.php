<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\ExpertSpecialty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ExpertOnboardingController extends Controller
{
    /**
     * Show the expert onboarding form
     */
    public function index()
    {
        $user = auth()->user();

        Log::info('Expert onboarding accessed', [
            'user_id' => $user->id,
            'user_type' => $user->user_type,
            'has_expert_profile' => !is_null($user->expertProfile),
        ]);

        // Ensure user is actually an expert
        if ($user->user_type !== 'expert') {
            return redirect()->route('home')
                ->with('error', 'Access denied. This page is for automotive experts only.');
        }

        // Use transaction to ensure profile creation is atomic
        DB::beginTransaction();
        try {
            // Check if expert profile exists, create if not
            if (!$user->expertProfile) {
                Log::info('Creating new expert profile for user', ['user_id' => $user->id]);

                $user->expertProfile()->create([
                    'business_name' => '',
                    'business_type' => 'mechanic',
                    'profile_completed' => false,
                ]);

                // Refresh the relationship
                $user->refresh();
            }

            $expertProfile = $user->expertProfile;

            // Defensive check
            if (!$expertProfile) {
                throw new \Exception('Failed to create or retrieve expert profile');
            }

            DB::commit();

            Log::info('Expert profile loaded successfully', [
                'user_id' => $user->id,
                'profile_id' => $expertProfile->id,
                'profile_completed' => $expertProfile->profile_completed ?? false,
            ]);

            // If profile already completed, redirect to dashboard
            if ($expertProfile->profile_completed) {
                return redirect()->route('expert.dashboard')
                    ->with('info', 'Your profile is already completed!');
            }

            // Get current specialties
            $currentSpecialties = $expertProfile->specialties()
                ->pluck('specialty')
                ->toArray();

            return Inertia::render('Expert/Onboarding', [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                ],
                'expertProfile' => [
                    'business_name' => $expertProfile->business_name ?? '',
                    'business_type' => $expertProfile->business_type ?? 'mechanic',
                    'bio' => $expertProfile->bio,
                    'years_experience' => $expertProfile->years_experience,
                    'service_radius_km' => $expertProfile->service_radius_km ?? 25,
                    'business_address' => $user->location_address ?? '',
                    'location_latitude' => $user->location_latitude ? (float)$user->location_latitude : null,
                    'location_longitude' => $user->location_longitude ? (float)$user->location_longitude : null,
                    'specialties' => $currentSpecialties,
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
            Log::error('Expert onboarding error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('home')
                ->with('error', 'Unable to load onboarding. Please contact support.');
        }
    }

    /**
     * Save progress and allow user to continue later
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

        // Validate only the fields that are provided (partial validation)
        $validated = $request->validate([
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

            Log::info('Expert profile progress saved', [
                'user_id' => $user->id,
                'profile_id' => $expertProfile->id,
            ]);

            return redirect()->route('expert.dashboard')
                ->with('success', 'Progress saved! You can complete your profile anytime.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to save expert profile progress', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

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

        // If somehow profile doesn't exist, create it
        if (!$expertProfile) {
            Log::warning('Expert profile not found during complete, creating now', ['user_id' => $user->id]);

            $expertProfile = $user->expertProfile()->create([
                'business_name' => '',
                'business_type' => 'mechanic',
                'profile_completed' => false,
            ]);

            $user->refresh();
            $expertProfile = $user->expertProfile;
        }

        // Validate the complete form data (all required fields)
        $validated = $request->validate([
            // Contact Information
            'phone' => 'required|string|max:20',

            // Business Information
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|in:mechanic,electrician,body_shop,mobile_mechanic,other',
            'bio' => 'nullable|string|max:1000',
            'years_experience' => 'nullable|integer|min:0|max:99',

            // Location
            'business_address' => 'required|string|max:500',
            'location_latitude' => 'required|numeric|between:-90,90',
            'location_longitude' => 'required|numeric|between:-180,180',
            'service_radius_km' => 'required|integer|min:5|max:100',

            // Services
            'specialties' => 'required|array|min:1',
            'specialties.*' => 'string|in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',
        ]);

        DB::beginTransaction();
        try {
            // Update user phone if provided
            if ($validated['phone'] && $user->phone !== $validated['phone']) {
                $user->update(['phone' => $validated['phone']]);
            }

            // Update user location
            $user->update([
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
                'service_radius_km' => $validated['service_radius_km'],
                'profile_completed' => true,
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

            Log::info('Expert onboarding completed', [
                'user_id' => $user->id,
                'profile_id' => $expertProfile->id,
            ]);

            // TODO: Send email to admin for verification
            // TODO: Send confirmation email to expert

            return redirect()->route('expert.dashboard')
                ->with('success', 'Profile completed! We\'ll review your information and notify you within 24-48 hours.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to complete expert onboarding', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to complete profile. Please try again.']);
        }
    }
}
