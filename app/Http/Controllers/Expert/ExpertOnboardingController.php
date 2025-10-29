<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\ExpertSpecialty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExpertOnboardingController extends Controller
{
    /**
     * Show the expert onboarding form
     * 
     * Streamlined single-page form that collects only essential information
     */
    public function index()
    {
        $user = auth()->user();

        \Log::debug("user" . json_encode($user));

        // Check if expert profile exists
        if (!$user->expertProfile) {
            // Create basic profile structure
            $user->expertProfile()->create([
                'business_name' => '',
                'business_type' => 'mechanic',
            ]);
        }

        $expertProfile = $user->expertProfile;
        \Log::debug("message" . json_encode($expertProfile));

        // If profile already completed, redirect to dashboard
        if ($expertProfile->profile_completed) {
            return redirect()->route('expert.dashboard')
                ->with('info', 'Your profile is already completed!');
        }

        return Inertia::render('Expert/Onboarding', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'expertProfile' => $expertProfile ? [
                'business_name' => $expertProfile->business_name,
                'business_type' => $expertProfile->business_type,
                'bio' => $expertProfile->bio,
                'years_experience' => $expertProfile->years_experience,
                'service_radius_km' => $expertProfile->service_radius_km,
                'specialties' => $expertProfile->specialties->pluck('specialty')->toArray(),
            ] : null,
            'businessTypes' => [
                'mechanic' => 'Auto Mechanic / Repair Shop',
                'electrician' => 'Auto Electrician',
                'body_shop' => 'Body Shop',
                'mobile_mechanic' => 'Mobile Mechanic',
                'other' => 'Other Automotive Service',
            ],
            'availableSpecialties' => [
                'engine' => 'Engine Repair',
                'brakes' => 'Brakes',
                'electrical' => 'Electrical Systems',
                'transmission' => 'Transmission',
                'tires' => 'Tires & Wheels',
                'bodywork' => 'Body Work',
                'diagnostics' => 'Diagnostics',
                'maintenance' => 'General Maintenance',
                'air_conditioning' => 'Air Conditioning',
                'suspension' => 'Suspension',
                'exhaust' => 'Exhaust Systems',
            ],
        ]);
    }

    /**
     * Complete the onboarding process
     * 
     * Validates and saves the expert profile information
     */
    public function complete(Request $request)
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return back()->with('error', 'Expert profile not found.');
        }

        // Validate the form data
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
                'profile_completed' => true, // Mark as completed
            ]);

            // Delete existing specialties
            $expertProfile->specialties()->delete();

            // Add new specialties
            foreach ($validated['specialties'] as $specialty) {
                ExpertSpecialty::create([
                    'expert_profile_id' => $expertProfile->id,
                    'specialty' => $specialty,
                ]);
            }

            DB::commit();

            return redirect()->route('expert.dashboard')
                ->with('success', 'Profile completed successfully! You can now start receiving leads.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'An error occurred while saving your profile. Please try again.'])
                ->withInput();
        }
    }
}
