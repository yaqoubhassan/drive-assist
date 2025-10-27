<?php

namespace App\Http\Controllers;

use App\Models\SeasonalChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeasonalChecklistController extends Controller
{
    /**
     * Display a listing of seasonal checklists
     */
    public function index(Request $request): Response
    {
        // ✅ FIX: Use empty string default instead of null to prevent React warnings
        $search = $request->input('search', '');
        $season = $request->input('season', 'all');
        $sort = $request->input('sort', 'season');

        $query = SeasonalChecklist::published();

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Season filter
        if ($season && $season !== 'all') {
            $query->where('season', $season);
        }

        // Sorting
        switch ($sort) {
            case 'popular':
                $query->orderBy('view_count', 'desc');
                break;
            case 'recent':
                $query->orderBy('created_at', 'desc');
                break;
            case 'helpful':
                $query->orderBy('helpful_count', 'desc');
                break;
            case 'season':
            default:
                // Order by season: Spring -> Summer -> Fall -> Winter
                $query->orderByRaw("
                    CASE season
                        WHEN 'spring' THEN 1
                        WHEN 'summer' THEN 2
                        WHEN 'fall' THEN 3
                        WHEN 'winter' THEN 4
                        ELSE 5
                    END
                ");
        }

        // Get paginated results
        $checklists = $query->paginate(12)->withQueryString();

        // CRITICAL FIX: Explicitly ensure array cast is applied and accessible
        // Transform the collection to make sure checklist_items is properly serialized
        $checklists->through(function ($checklist) {
            // Accessing the attribute forces Laravel to apply the cast
            // We're creating a new array/object that Inertia can properly serialize
            return [
                'id' => $checklist->id,
                'title' => $checklist->title,
                'slug' => $checklist->slug,
                'season' => $checklist->season,
                'description' => $checklist->description,
                'checklist_items' => $checklist->checklist_items, // This triggers the cast
                'why_important' => $checklist->why_important,
                'additional_tips' => $checklist->additional_tips,
                'estimated_cost_min' => $checklist->estimated_cost_min,
                'estimated_cost_max' => $checklist->estimated_cost_max,
                'estimated_time_hours' => $checklist->estimated_time_hours,
                'view_count' => $checklist->view_count,
                'helpful_count' => $checklist->helpful_count,
                'season_info' => $checklist->season_info,
                'formatted_cost_range' => $checklist->formatted_cost_range,
                'formatted_time' => $checklist->formatted_time,
                'created_at' => $checklist->created_at,
                'updated_at' => $checklist->updated_at,
            ];
        });

        return Inertia::render('Resources/Maintenance/Seasonal/Index', [
            'checklists' => $checklists,
            'searchQuery' => $search,
            'currentSeason' => $season,
            'currentSort' => $sort,
            'seasons' => $this->getSeasons(),
        ]);
    }

    /**
     * Display the specified seasonal checklist
     * 
     * ✅ UPDATED: Now includes user voting status to prevent 422 errors
     */
    public function show(Request $request, $slug): Response
    {
        $checklist = SeasonalChecklist::published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $checklist->incrementViews();

        // ✅ NEW: Check if user has already voted (by IP address)
        $ipAddress = $request->ip();
        $userFeedback = $checklist->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        // Get related checklists (same season, different checklist)
        $relatedChecklists = SeasonalChecklist::published()
            ->where('season', $checklist->season)
            ->where('id', '!=', $checklist->id)
            ->orderBy('view_count', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('Resources/Maintenance/Seasonal/Show', [
            'checklist' => $checklist,
            'relatedChecklists' => $relatedChecklists,
            // ✅ NEW: Pass voting status to frontend
            'userHasVoted' => $userFeedback !== null,
            'userVotedHelpful' => $userFeedback?->is_helpful ?? null,
        ]);
    }

    /**
     * Handle helpful feedback submission
     * 
     * ⚠️ NO CHANGES - This method already works correctly
     */
    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $checklist = SeasonalChecklist::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        // Check if user already voted
        $existing = $checklist->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback',
                'already_voted' => true,
            ], 422);
        }

        // Create feedback
        $checklist->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        // Increment helpful count if positive feedback
        if ($request->is_helpful) {
            $checklist->incrementHelpful();
        }

        return response()->json([
            'message' => 'Thank you for your feedback!',
            'helpful_count' => $checklist->fresh()->helpful_count,
        ]);
    }

    /**
     * Get available seasons with display names
     * 
     * ⚠️ NO CHANGES - This method already works correctly
     */
    private function getSeasons(): array
    {
        return [
            'all' => 'All Seasons',
            'spring' => 'Spring 🌸',
            'summer' => 'Summer ☀️',
            'fall' => 'Fall 🍂',
            'winter' => 'Winter ❄️',
        ];
    }
}
