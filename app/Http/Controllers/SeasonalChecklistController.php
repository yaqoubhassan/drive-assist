<?php

namespace App\Http\Controllers;

use App\Models\SeasonalChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeasonalChecklistController extends Controller
{
    public function index(Request $request)
    {
        $query = SeasonalChecklist::published();

        // Filter by season
        $season = $request->get('season', 'all');
        if ($season && $season !== 'all') {
            $query->bySeason($season);
        }

        $query->orderBy('season', 'asc');

        $checklists = $query->get();

        return Inertia::render('Resources/Maintenance/Seasonal/Index', [
            'checklists' => $checklists,
            'currentSeason' => $season,
            'seasons' => $this->getSeasons(),
        ]);
    }

    public function show($slug)
    {
        $checklist = SeasonalChecklist::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $checklist->incrementViews();

        return Inertia::render('Resources/Maintenance/Seasonal/Show', [
            'checklist' => $checklist,
        ]);
    }

    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $checklist = SeasonalChecklist::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        $existing = $checklist->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback',
                'already_voted' => true,
            ], 422);
        }

        $checklist->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Thank you for your feedback!']);
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
