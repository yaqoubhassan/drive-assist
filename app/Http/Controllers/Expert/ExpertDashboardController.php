<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpertDashboardController extends Controller
{
    /**
     * Display the expert dashboard
     */
    public function index(): Response
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        // Get today's stats
        $today = now()->startOfDay();
        $newLeadsToday = $expertProfile->leads()->whereDate('created_at', $today)->count();
        $activeJobs = $expertProfile->jobs()->where('job_status', 'in_progress')->count();
        $todayEarnings = $expertProfile->jobs()
            ->whereDate('updated_at', $today)
            ->where('job_status', 'completed')
            ->sum('total_cost');

        return Inertia::render('Expert/Dashboard', [
            'user' => $user,
            'expertProfile' => $expertProfile,
            'stats' => [
                'newLeadsToday' => $newLeadsToday,
                'activeJobs' => $activeJobs,
                'avgRating' => $expertProfile->avg_rating,
                'todayEarnings' => $todayEarnings,
            ],
            'recentLeads' => $expertProfile->leads()
                ->with(['driver', 'diagnosis'])
                ->where('status', 'new')
                ->latest()
                ->take(5)
                ->get(),
            'activeJobs' => $expertProfile->jobs()
                ->with(['driver', 'vehicle'])
                ->whereIn('job_status', ['scheduled', 'in_progress'])
                ->latest()
                ->take(5)
                ->get(),
            'recentReviews' => $expertProfile->reviews()
                ->with('driver')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * Display jobs list
     */
    public function jobs(Request $request): Response
    {
        $expertProfile = auth()->user()->expertProfile;

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
        $job = auth()->user()
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
        $job = auth()->user()
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
        $review = auth()->user()
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
        return Inertia::render('Expert/Profile/Edit', [
            'user' => auth()->user(),
            'expertProfile' => auth()->user()->expertProfile,
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Display business settings page
     */
    public function businessSettings(): Response
    {
        return Inertia::render('Expert/Settings/Business', [
            'expertProfile' => auth()->user()->expertProfile,
        ]);
    }

    /**
     * Update business settings
     */
    public function updateBusinessSettings(Request $request)
    {
        $expertProfile = auth()->user()->expertProfile;

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'years_experience' => 'nullable|integer|min:0',
            'employee_count' => 'nullable|integer|min:1',
            'service_radius_km' => 'required|integer|min:1|max:100',
        ]);

        $expertProfile->update($validated);

        return back()->with('success', 'Business settings updated successfully.');
    }

    /**
     * Display availability settings page
     */
    public function availabilitySettings(): Response
    {
        return Inertia::render('Expert/Settings/Availability', [
            'expertProfile' => auth()->user()->expertProfile,
        ]);
    }

    /**
     * Update availability
     */
    public function updateAvailability(Request $request)
    {
        $expertProfile = auth()->user()->expertProfile;

        $validated = $request->validate([
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
            'accepts_emergency' => 'boolean',
        ]);

        $expertProfile->update($validated);

        return back()->with('success', 'Availability updated successfully.');
    }

    /**
     * Display services settings page
     */
    public function servicesSettings(): Response
    {
        return Inertia::render('Expert/Settings/Services', [
            'expertProfile' => auth()->user()->expertProfile->load('specialties'),
        ]);
    }

    /**
     * Update services
     */
    public function updateServices(Request $request)
    {
        $expertProfile = auth()->user()->expertProfile;

        $validated = $request->validate([
            'specialties' => 'required|array|min:1',
            'specialties.*' => 'in:engine,brakes,electrical,transmission,tires,bodywork,diagnostics,maintenance,air_conditioning,suspension,exhaust',
            'hourly_rate_min' => 'nullable|numeric|min:0',
            'hourly_rate_max' => 'nullable|numeric|min:0',
            'diagnostic_fee' => 'nullable|numeric|min:0',
        ]);

        // Update basic info
        $expertProfile->update([
            'hourly_rate_min' => $validated['hourly_rate_min'] ?? null,
            'hourly_rate_max' => $validated['hourly_rate_max'] ?? null,
            'diagnostic_fee' => $validated['diagnostic_fee'] ?? null,
        ]);

        // Sync specialties
        $expertProfile->specialties()->delete();
        foreach ($validated['specialties'] as $specialty) {
            $expertProfile->specialties()->create(['specialty' => $specialty]);
        }

        return back()->with('success', 'Services updated successfully.');
    }
}
