<?php

namespace App\Http\Controllers;

use App\Models\SeasonalChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SeasonalChecklistController extends Controller
{
    /**
     * Display a listing of seasonal checklists
     */
    public function index(Request $request)
    {
        $query = SeasonalChecklist::published();

        // Search functionality
        $search = $request->get('search');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by season
        $season = $request->get('season', 'all');
        if ($season && $season !== 'all') {
            $query->bySeason($season);
        }

        // Sorting
        $sort = $request->get('sort', 'season');
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
            default:
                // Sort by season order: spring, summer, fall, winter
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

        // CRITICAL FIX: Transform each checklist to ensure proper data format
        $checklists->getCollection()->transform(function ($checklist) {
            return $this->formatChecklistForFrontend($checklist);
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
     */
    public function show($slug)
    {
        $checklist = SeasonalChecklist::published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $checklist->incrementViews();

        // Get related checklists (same season, different checklist)
        $relatedChecklists = SeasonalChecklist::published()
            ->where('season', $checklist->season)
            ->where('id', '!=', $checklist->id)
            ->orderBy('view_count', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($related) {
                return $this->formatChecklistForFrontend($related);
            });

        // Format main checklist
        $formattedChecklist = $this->formatChecklistForFrontend($checklist);

        return Inertia::render('Resources/Maintenance/Seasonal/Show', [
            'checklist' => $formattedChecklist,
            'relatedChecklists' => $relatedChecklists,
        ]);
    }

    /**
     * Handle helpful feedback submission
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
     * Format checklist data for frontend
     * 
     * CRITICAL: This ensures checklist_items is ALWAYS an array
     * and properly formatted for Inertia/React
     */
    private function formatChecklistForFrontend($checklist)
    {
        // Convert to array
        $data = $checklist->toArray();

        // CRITICAL FIX: Explicitly decode checklist_items from JSON if needed
        if (isset($data['checklist_items'])) {
            // If it's a string (raw JSON from DB), decode it
            if (is_string($data['checklist_items'])) {
                $decoded = json_decode($data['checklist_items'], true);
                $data['checklist_items'] = is_array($decoded) ? $decoded : [];
            }
            // If it's already an array, keep it
            elseif (!is_array($data['checklist_items'])) {
                $data['checklist_items'] = [];
            }
        } else {
            $data['checklist_items'] = [];
        }

        // Validate each checklist item has required fields
        $data['checklist_items'] = array_map(function ($item) {
            return [
                'item' => $item['item'] ?? '',
                'description' => $item['description'] ?? '',
                'priority' => $item['priority'] ?? 'low',
            ];
        }, $data['checklist_items']);

        // Ensure numeric fields are properly typed
        $data['view_count'] = (int) ($data['view_count'] ?? 0);
        $data['helpful_count'] = (int) ($data['helpful_count'] ?? 0);
        $data['estimated_cost_min'] = isset($data['estimated_cost_min']) ? (float) $data['estimated_cost_min'] : null;
        $data['estimated_cost_max'] = isset($data['estimated_cost_max']) ? (float) $data['estimated_cost_max'] : null;
        $data['estimated_time_hours'] = isset($data['estimated_time_hours']) ? (float) $data['estimated_time_hours'] : null;

        // Ensure season_info exists (should be appended by model)
        if (!isset($data['season_info'])) {
            $data['season_info'] = [
                'emoji' => '📅',
                'color' => 'gray',
                'bg_class' => 'bg-gradient-to-r from-gray-500 to-gray-600',
            ];
        }

        // Debug logging (remove in production)
        if (config('app.debug')) {
            Log::debug('Formatted checklist', [
                'id' => $data['id'] ?? 'unknown',
                'title' => $data['title'] ?? 'unknown',
                'checklist_items_count' => count($data['checklist_items']),
                'checklist_items_type' => gettype($data['checklist_items']),
            ]);
        }

        return $data;
    }

    /**
     * Get available seasons with display names
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
