<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceSchedule::published();

        // Filter by interval
        if ($request->has('interval') && $request->interval && $request->interval !== 'all') {
            $query->byInterval($request->interval);
        }

        // Filter by season
        if ($request->has('season') && $request->season && $request->season !== 'all') {
            $query->bySeason($request->season);
        }

        // Sorting
        $sortBy = $request->get('sort', 'interval');
        if ($sortBy === 'interval') {
            $query->orderByRaw("
                CASE 'interval'
                    WHEN 'daily' THEN 1
                    WHEN 'weekly' THEN 2
                    WHEN 'monthly' THEN 3
                    WHEN 'quarterly' THEN 4
                    WHEN 'semi_annually' THEN 5
                    WHEN 'annually' THEN 6
                END
            ");
        } else {
            $query->orderBy($sortBy, 'desc');
        }

        $schedules = $query->paginate(12)->withQueryString();

        return Inertia::render('Resources/Maintenance/Schedules/Index', [
            'schedules' => $schedules,
            'intervals' => $this->getIntervals(),
            'seasons' => $this->getSeasons(),
            'currentInterval' => $request->get('interval', 'all'),
            'currentSeason' => $request->get('season', 'all'),
            'currentSort' => $sortBy,
        ]);
    }

    public function show($slug)
    {
        $schedule = MaintenanceSchedule::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $schedule->incrementViews();

        return Inertia::render('Resources/Maintenance/Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $schedule = MaintenanceSchedule::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        $existing = $schedule->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback',
                'already_voted' => true,
            ], 422);
        }

        $schedule->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Thank you for your feedback!']);
    }

    private function getIntervals()
    {
        return [
            'all' => 'All Intervals',
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'quarterly' => 'Every 3 Months',
            'semi_annually' => 'Every 6 Months',
            'annually' => 'Yearly',
        ];
    }

    private function getSeasons()
    {
        return [
            'all' => 'All Seasons',
            'spring' => 'Spring',
            'summer' => 'Summer',
            'fall' => 'Fall',
            'winter' => 'Winter',
        ];
    }
}
