<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use App\Models\ExpertSpecialty;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class ExpertRegistrationController extends Controller
{
    /**
     * Show the expert registration form
     */
    public function create(): Response
    {
        return Inertia::render('Expert/Register', [
            'specialties' => ExpertSpecialty::SPECIALTIES,
            'businessTypes' => [
                'mechanic' => 'Auto Mechanic Shop',
                'electrician' => 'Auto Electrician',
                'body_shop' => 'Body Shop',
                'mobile_mechanic' => 'Mobile Mechanic',
                'other' => 'Other',
            ],
        ]);
    }

    /**
     * Store a new expert registration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Step 1: Basic Information
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string|max:20',
            'business_name' => 'required|string|max:255',
            'business_address' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // Step 2: Business Details
            'business_type' => 'required|in:mechanic,electrician,body_shop,mobile_mechanic,other',
            'years_experience' => 'required|integer|min:0|max:100',
            'employee_count' => 'nullable|integer|min:1|max:1000',
            'service_radius_km' => 'required|integer|min:1|max:200',
            'bio' => 'nullable|string|max:1000',
            'specialties' => 'required|array|min:1',
            'specialties.*' => 'in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',

            // Step 3: Pricing
            'hourly_rate_min' => 'nullable|numeric|min:0',
            'hourly_rate_max' => 'nullable|numeric|min:0',
            'diagnostic_fee' => 'nullable|numeric|min:0',
            'accepts_emergency' => 'boolean',

            // Step 4: Operating Hours
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

            // Step 5: Verification Documents
            'business_license' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'insurance_certificate' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'certifications.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'business_license_number' => 'nullable|string|max:100',
            'insurance_policy_number' => 'nullable|string|max:100',
        ]);

        try {
            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'user_type' => 'expert',
                'phone' => $validated['phone'],
                'location_address' => $validated['business_address'],
                'location_latitude' => $validated['latitude'] ?? null,
                'location_longitude' => $validated['longitude'] ?? null,
            ]);

            // Handle document uploads
            $documentPaths = $this->handleDocumentUploads($request, $user->id);

            // Create expert profile
            $expertProfile = ExpertProfile::create([
                'user_id' => $user->id,
                'business_name' => $validated['business_name'],
                'business_type' => $validated['business_type'],
                'bio' => $validated['bio'] ?? null,
                'years_experience' => $validated['years_experience'],
                'employee_count' => $validated['employee_count'] ?? null,
                'business_license_number' => $validated['business_license_number'] ?? null,
                'insurance_policy_number' => $validated['insurance_policy_number'] ?? null,
                'service_radius_km' => $validated['service_radius_km'],
                'hourly_rate_min' => $validated['hourly_rate_min'] ?? null,
                'hourly_rate_max' => $validated['hourly_rate_max'] ?? null,
                'diagnostic_fee' => $validated['diagnostic_fee'] ?? null,
                'accepts_emergency' => $validated['accepts_emergency'] ?? false,

                // Operating hours
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

                'verification_status' => 'pending',
            ]);

            // Create specialties
            foreach ($validated['specialties'] as $specialty) {
                ExpertSpecialty::create([
                    'expert_profile_id' => $expertProfile->id,
                    'specialty' => $specialty,
                ]);
            }

            // Store document paths in profile (if needed for later reference)
            if (!empty($documentPaths)) {
                $expertProfile->update([
                    'documents' => json_encode($documentPaths), // You may need to add this column
                ]);
            }

            DB::commit();

            // Send welcome email (implement later)
            // Mail::to($user->email)->send(new WelcomeExpert($user, $expertProfile));

            // Auto-login the new expert
            auth()->login($user);

            return redirect()->route('expert.dashboard')
                ->with('success', 'Registration successful! Your profile is pending verification.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up any uploaded files
            if (isset($documentPaths)) {
                foreach ($documentPaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }

            return back()->withErrors([
                'registration' => 'Registration failed. Please try again.'
            ])->withInput();
        }
    }

    /**
     * Handle document uploads
     */
    private function handleDocumentUploads(Request $request, int $userId): array
    {
        $documents = [];

        // Business License
        if ($request->hasFile('business_license')) {
            $file = $request->file('business_license');
            $path = $file->store("experts/{$userId}/documents", 'public');
            $documents['business_license'] = $path;
        }

        // Insurance Certificate
        if ($request->hasFile('insurance_certificate')) {
            $file = $request->file('insurance_certificate');
            $path = $file->store("experts/{$userId}/documents", 'public');
            $documents['insurance_certificate'] = $path;
        }

        // Certifications (multiple files)
        if ($request->hasFile('certifications')) {
            $documents['certifications'] = [];
            foreach ($request->file('certifications') as $file) {
                $path = $file->store("experts/{$userId}/documents", 'public');
                $documents['certifications'][] = $path;
            }
        }

        return $documents;
    }

    /**
     * Show expert dashboard after registration
     */
    public function dashboard()
    {
        $user = auth()->user();

        if ($user->user_type !== 'expert') {
            abort(403, 'Unauthorized');
        }

        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return redirect()->route('expert.register');
        }

        return Inertia::render('Expert/Dashboard', [
            'expert' => [
                'id' => $expertProfile->id,
                'businessName' => $expertProfile->business_name,
                'verificationStatus' => $expertProfile->verification_status,
                'rating' => (float) $expertProfile->avg_rating, // Cast to float
                'totalJobs' => (int) $expertProfile->total_jobs,
                'profileViews' => (int) $expertProfile->profile_views,
            ],
            'stats' => [
                'newLeads' => $expertProfile->leads()->where('status', 'new')->count(),
                'activeJobs' => $expertProfile->jobs()->where('job_status', 'in_progress')->count(),
                'completedJobs' => $expertProfile->jobs()->where('job_status', 'completed')->count(),
                'monthlyEarnings' => (float) ($expertProfile->jobs()
                    ->where('job_status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_cost') ?? 0), // Cast to float with fallback
            ],
        ]);
    }
}
