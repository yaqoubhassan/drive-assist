<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExpertDashboardController extends Controller
{
    public function __construct(private FileUploadService $fileUploadService) {}
    /**
     * Display the expert dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return redirect()->route('expert.register')
                ->with('error', 'Please complete your expert profile first.');
        }

        // Get stats
        $newLeads = $expertProfile->leads()->where('status', 'new')->count();
        $activeJobs = $expertProfile->jobs()->where('job_status', 'in_progress')->count();
        $completedJobs = $expertProfile->jobs()->where('job_status', 'completed')->count();

        // Monthly earnings
        $monthlyEarnings = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_cost') ?? 0;

        // Last month earnings for trend
        $earningsLastMonth = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_cost') ?? 0;

        // Leads this week vs last week
        $leadsThisWeek = $expertProfile->leads()
            ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        $leadsLastWeek = $expertProfile->leads()
            ->whereBetween('created_at', [
                now()->subWeek()->startOfWeek(),
                now()->subWeek()->endOfWeek()
            ])
            ->count();

        // Recent leads (last 5)
        $recentLeads = $expertProfile->leads()
            ->with('driver')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'driverName' => $lead->driver_name,
                    'message' => $lead->message,
                    'createdAt' => $lead->created_at->toIso8601String(),
                    'status' => $lead->status,
                ];
            });

        // Earnings data for the last 6 months (for chart)
        $earningsData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $earnings = $expertProfile->jobs()
                ->where('job_status', 'completed')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_cost') ?? 0;

            $earningsData->push([
                'month' => $month->format('M'),
                'earnings' => (float) $earnings,
            ]);
        }

        $kycInfo = null;
        if ($expertProfile->kyc) {
            $kycInfo = [
                'kyc_status' => $expertProfile->kyc->kyc_status,
                'completion_percentage' => $expertProfile->kyc->completion_percentage,
                'is_approved' => $expertProfile->kyc->isApproved(),
                'is_pending_review' => $expertProfile->kyc->isPendingReview(),
                'needs_resubmission' => $expertProfile->kyc->needsResubmission(),
                'rejection_reason' => $expertProfile->kyc->rejection_reason,
            ];
        }

        // Job status distribution (for pie chart)
        $jobStatusData = [
            [
                'status' => 'Scheduled',
                'count' => $expertProfile->jobs()->where('job_status', 'scheduled')->count(),
            ],
            [
                'status' => 'In Progress',
                'count' => $activeJobs,
            ],
            [
                'status' => 'Completed',
                'count' => $completedJobs,
            ],
            [
                'status' => 'Cancelled',
                'count' => $expertProfile->jobs()->where('job_status', 'cancelled')->count(),
            ],
        ];

        return Inertia::render('Expert/Dashboard', [
            'expert' => [
                'id' => $expertProfile->id,
                'businessName' => $expertProfile->business_name,
                'verificationStatus' => $expertProfile->verification_status,
                'rating' => (float) $expertProfile->avg_rating,
                'totalJobs' => (int) $expertProfile->total_jobs,
                'profileViews' => (int) $expertProfile->profile_views,
            ],
            'stats' => [
                'newLeads' => $newLeads,
                'activeJobs' => $activeJobs,
                'completedJobs' => $completedJobs,
                'monthlyEarnings' => (float) $monthlyEarnings,
                'leadsThisWeek' => $leadsThisWeek,
                'leadsLastWeek' => $leadsLastWeek,
                'earningsLastMonth' => (float) $earningsLastMonth,
            ],
            'recentLeads' => $recentLeads,
            'earningsData' => $earningsData,
            'jobStatusData' => array_filter($jobStatusData, fn($item) => $item['count'] > 0),
            'kycInfo' => $kycInfo,
        ]);
    }

    /**
     * Display jobs list
     */
    public function jobs(Request $request): Response
    {
        $expertProfile = $request->user()->expertProfile;

        $query = $expertProfile->jobs()->with(['driver', 'vehicle', 'lead']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('job_status', $request->status);
        }

        $jobs = $query->latest()->paginate(20);

        return Inertia::render('Expert/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show a specific job
     */
    public function showJob($id): Response
    {
        $job = auth()->user()
            ->expertProfile
            ->jobs()
            ->with(['driver', 'vehicle', 'lead'])
            ->findOrFail($id);

        return Inertia::render('Expert/Jobs/Show', [
            'job' => $job,
        ]);
    }

    /**
     * Update job status
     */
    public function updateJobStatus(Request $request, $id)
    {
        $job = $request->user()
            ->expertProfile
            ->jobs()
            ->findOrFail($id);

        $validated = $request->validate([
            'job_status' => 'required|in:scheduled,in_progress,completed,cancelled',
            'actual_start_time' => 'nullable|date',
            'actual_end_time' => 'nullable|date',
        ]);

        $job->update($validated);

        return back()->with('success', 'Job status updated successfully.');
    }

    /**
     * Complete a job
     */
    public function completeJob(Request $request, $id)
    {
        $job = $request->user()
            ->expertProfile
            ->jobs()
            ->findOrFail($id);

        $validated = $request->validate([
            'parts_cost' => 'nullable|numeric|min:0',
            'labor_cost' => 'nullable|numeric|min:0',
            'completion_notes' => 'nullable|string|max:1000',
        ]);

        $totalCost = ($validated['parts_cost'] ?? 0) + ($validated['labor_cost'] ?? 0);

        $job->update([
            'job_status' => 'completed',
            'actual_end_time' => now(),
            'parts_cost' => $validated['parts_cost'] ?? 0,
            'labor_cost' => $validated['labor_cost'] ?? 0,
            'total_cost' => $totalCost,
            'completion_notes' => $validated['completion_notes'] ?? null,
        ]);

        // Send notification to driver for review
        // NotificationService::sendJobCompletedNotification($job);

        return back()->with('success', 'Job marked as completed. Driver will be notified.');
    }

    /**
     * Display reviews list
     */
    public function reviews(): Response
    {
        $reviews = auth()->user()
            ->expertProfile
            ->reviews()
            ->with(['driver', 'job'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Expert/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Respond to a review
     */
    public function respondToReview(Request $request, $id)
    {
        $review = $request->user()
            ->expertProfile
            ->reviews()
            ->findOrFail($id);

        $validated = $request->validate([
            'expert_response' => 'required|string|max:500',
        ]);

        $review->update([
            'expert_response' => $validated['expert_response'],
            'expert_responded_at' => now(),
        ]);

        return back()->with('success', 'Response posted successfully.');
    }

    /**
     * Display earnings page
     */
    public function earnings(): Response
    {
        $expertProfile = auth()->user()->expertProfile;

        // Calculate earnings
        $thisMonth = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->whereMonth('updated_at', now()->month)
            ->sum('total_cost');

        $lastMonth = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->whereMonth('updated_at', now()->subMonth()->month)
            ->sum('total_cost');

        $allTime = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->sum('total_cost');

        // Get earnings by month (last 6 months)
        $earningsByMonth = $expertProfile->jobs()
            ->where('job_status', 'completed')
            ->where('updated_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(updated_at, "%Y-%m") as month, SUM(total_cost) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Expert/Earnings', [
            'earnings' => [
                'thisMonth' => $thisMonth,
                'lastMonth' => $lastMonth,
                'allTime' => $allTime,
                'byMonth' => $earningsByMonth,
            ],
        ]);
    }

    /**
     * Display analytics page
     */
    public function analytics(): Response
    {
        $expertProfile = auth()->user()->expertProfile;

        // Various analytics
        $totalLeads = $expertProfile->leads()->count();
        $convertedLeads = $expertProfile->leads()->whereHas('job')->count();
        $conversionRate = $totalLeads > 0 ? ($convertedLeads / $totalLeads) * 100 : 0;

        $totalJobs = $expertProfile->jobs()->count();
        $completedJobs = $expertProfile->jobs()->where('job_status', 'completed')->count();
        $cancelledJobs = $expertProfile->jobs()->where('job_status', 'cancelled')->count();

        $avgRating = $expertProfile->avg_rating;
        $totalReviews = $expertProfile->reviews()->count();

        return Inertia::render('Expert/Analytics', [
            'analytics' => [
                'leads' => [
                    'total' => $totalLeads,
                    'converted' => $convertedLeads,
                    'conversionRate' => round($conversionRate, 2),
                ],
                'jobs' => [
                    'total' => $totalJobs,
                    'completed' => $completedJobs,
                    'cancelled' => $cancelledJobs,
                ],
                'reputation' => [
                    'avgRating' => $avgRating,
                    'totalReviews' => $totalReviews,
                ],
            ],
        ]);
    }

    /**
     * Display profile edit page
     */
    public function profile(): Response
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        // Get current specialties
        $currentSpecialties = $expertProfile->specialties()
            ->pluck('specialty')
            ->toArray();

        return Inertia::render('Expert/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar_url' => $user->avatar_url,
                'location_address' => $user->location_address,
                'location_latitude' => $user->location_latitude ? (float)$user->location_latitude : null,
                'location_longitude' => $user->location_longitude ? (float)$user->location_longitude : null,
            ],
            'expertProfile' => [
                'id' => $expertProfile->id,
                'business_name' => $expertProfile->business_name,
                'business_type' => $expertProfile->business_type,
                'bio' => $expertProfile->bio,
                'years_experience' => $expertProfile->years_experience,
                'employee_count' => $expertProfile->employee_count,
                'service_radius_km' => $expertProfile->service_radius_km,
                'hourly_rate_min' => $expertProfile->hourly_rate_min ? (float)$expertProfile->hourly_rate_min : null,
                'hourly_rate_max' => $expertProfile->hourly_rate_max ? (float)$expertProfile->hourly_rate_max : null,
                'diagnostic_fee' => $expertProfile->diagnostic_fee ? (float)$expertProfile->diagnostic_fee : null,
                'accepts_emergency' => $expertProfile->accepts_emergency,
                'specialties' => $currentSpecialties,
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
                'avg_rating' => $expertProfile->avg_rating ? (float)$expertProfile->avg_rating : 0,
                'total_jobs' => $expertProfile->total_jobs,
                'verification_status' => $expertProfile->verification_status,
            ],
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $expertProfile = $user->expertProfile;

        DB::beginTransaction();
        try {
            // Clean the input data
            $inputData = $request->all();
            $timeFields = [
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

            foreach ($timeFields as $field) {
                if (isset($inputData[$field])) {
                    // Convert empty string to null
                    if ($inputData[$field] === '') {
                        $inputData[$field] = null;
                    }
                    // Convert HH:MM:SS to HH:MM (trim seconds if present)
                    else if (is_string($inputData[$field]) && strlen($inputData[$field]) > 5) {
                        // Remove seconds if present (e.g., "09:00:00" -> "09:00")
                        $inputData[$field] = substr($inputData[$field], 0, 5);
                    }
                }
            }

            // Replace the request input with cleaned data
            $request->merge($inputData);

            // Validate based on what's being updated
            $validated = $request->validate([
                // User fields
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'sometimes|nullable|string|max:20',
                'avatar_url' => 'sometimes|nullable|string|max:500',
                'location_address' => 'sometimes|nullable|string|max:500',
                'location_latitude' => 'sometimes|nullable|numeric|between:-90,90',
                'location_longitude' => 'sometimes|nullable|numeric|between:-180,180',

                // Expert profile fields
                'business_name' => 'sometimes|required|string|max:255',
                'business_type' => 'sometimes|required|in:mechanic,electrician,body_shop,mobile_mechanic,other',
                'bio' => 'sometimes|nullable|string|max:1000',
                'years_experience' => 'sometimes|nullable|integer|min:0|max:99',
                'employee_count' => 'sometimes|nullable|integer|min:1|max:999',
                'service_radius_km' => 'sometimes|required|integer|min:5|max:100',
                'hourly_rate_min' => 'sometimes|nullable|numeric|min:0|max:9999.99',
                'hourly_rate_max' => 'sometimes|nullable|numeric|min:0|max:9999.99',
                'diagnostic_fee' => 'sometimes|nullable|numeric|min:0|max:9999.99',
                'accepts_emergency' => 'sometimes|boolean',
                'specialties' => 'sometimes|array',
                'specialties.*' => 'sometimes|in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',

                // Operating hours
                'monday_open' => 'sometimes|nullable|date_format:H:i',
                'monday_close' => 'sometimes|nullable|date_format:H:i',
                'tuesday_open' => 'sometimes|nullable|date_format:H:i',
                'tuesday_close' => 'sometimes|nullable|date_format:H:i',
                'wednesday_open' => 'sometimes|nullable|date_format:H:i',
                'wednesday_close' => 'sometimes|nullable|date_format:H:i',
                'thursday_open' => 'sometimes|nullable|date_format:H:i',
                'thursday_close' => 'sometimes|nullable|date_format:H:i',
                'friday_open' => 'sometimes|nullable|date_format:H:i',
                'friday_close' => 'sometimes|nullable|date_format:H:i',
                'saturday_open' => 'sometimes|nullable|date_format:H:i',
                'saturday_close' => 'sometimes|nullable|date_format:H:i',
                'sunday_open' => 'sometimes|nullable|date_format:H:i',
                'sunday_close' => 'sometimes|nullable|date_format:H:i',
            ]);

            // Update user fields
            $userFields = ['name', 'email', 'phone', 'avatar_url', 'location_address', 'location_latitude', 'location_longitude'];
            $userData = array_intersect_key($validated, array_flip($userFields));
            if (!empty($userData)) {
                $user->update($userData);
            }

            // Update expert profile fields
            $profileFields = [
                'business_name',
                'business_type',
                'bio',
                'years_experience',
                'employee_count',
                'service_radius_km',
                'hourly_rate_min',
                'hourly_rate_max',
                'diagnostic_fee',
                'accepts_emergency',
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
            $profileData = array_intersect_key($validated, array_flip($profileFields));
            if (!empty($profileData)) {
                $expertProfile->update($profileData);
            }

            // Update specialties if provided
            if (isset($validated['specialties'])) {
                $expertProfile->specialties()->delete();
                foreach ($validated['specialties'] as $specialty) {
                    $expertProfile->specialties()->create(['specialty' => $specialty]);
                }
            }

            DB::commit();

            return back()->with('success', 'Profile updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();

            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Failed to update profile. Please try again.']);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $user = $request->user();

        try {
            $request->validate([
                'avatar' => 'required|file|mimes:jpg,jpeg,png,gif,webp|max:2048', // 2MB max
            ]);

            $file = $request->file('avatar');

            // Delete old avatar if exists
            if ($user->avatar_url) {
                $oldPath = str_replace('/storage/', '', parse_url($user->avatar_url, PHP_URL_PATH));
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Use FileUploadService to upload avatar
            $result = $this->fileUploadService->uploadAvatar($file, $user->id);

            // Update user record
            $user->update([
                'avatar_url' => $result['url'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar uploaded successfully',
                'avatar_url' => $result['url'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->validator->errors()->first(),
            ], 422);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'error' => 'Failed to upload avatar. Please try again.',
            ], 500);
        }
    }

    /**
     * Delete user avatar
     */
    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        try {
            if (!$user->avatar_url) {
                return response()->json([
                    'success' => false,
                    'error' => 'No avatar to delete',
                ], 404);
            }

            // Extract path from URL
            $oldPath = str_replace('/storage/', '', parse_url($user->avatar_url, PHP_URL_PATH));

            // Use FileUploadService to delete avatar
            $this->fileUploadService->deleteAvatar($oldPath);

            // Update user record
            $user->update([
                'avatar_url' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar deleted successfully',
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete avatar. Please try again.',
            ], 500);
        }
    }
}
