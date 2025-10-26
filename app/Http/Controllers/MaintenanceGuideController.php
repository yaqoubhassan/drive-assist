<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceGuideController extends Controller
{
    /**
     * Display listing of maintenance guides
     */
    public function index(Request $request)
    {
        $query = MaintenanceGuide::published();

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by category
        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by difficulty
        if ($request->has('difficulty') && $request->difficulty && $request->difficulty !== 'all') {
            $query->where('difficulty', $request->difficulty);
        }

        // Sorting
        $sortBy = $request->get('sort', 'popular');
        switch ($sortBy) {
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            case 'time':
                $query->orderBy('estimated_time_minutes', 'asc');
                break;
            case 'cost':
                $query->orderBy('estimated_cost_min', 'asc');
                break;
            case 'newest':
                $query->latest();
                break;
            case 'popular':
            default:
                $query->orderBy('view_count', 'desc');
                break;
        }

        $guides = $query->paginate(12)->withQueryString();

        return Inertia::render('Resources/Maintenance/Guides/Index', [
            'guides' => $guides,
            'categories' => $this->getCategories(),
            'difficulties' => $this->getDifficulties(),
            'currentCategory' => $request->get('category', 'all'),
            'currentDifficulty' => $request->get('difficulty', 'all'),
            'searchQuery' => $request->get('search', ''),
            'currentSort' => $sortBy,
            'popularGuides' => MaintenanceGuide::published()
                ->popular()
                ->take(3)
                ->get(),
        ]);
    }

    /**
     * Display a specific maintenance guide
     */
    public function show($slug)
    {
        $guide = MaintenanceGuide::published()
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $guide->incrementViews();

        // Get related guides
        $relatedGuides = MaintenanceGuide::published()
            ->where('category', $guide->category)
            ->where('id', '!=', $guide->id)
            ->take(3)
            ->get();

        return Inertia::render('Resources/Maintenance/Guides/Show', [
            'guide' => $guide,
            'relatedGuides' => $relatedGuides,
        ]);
    }

    /**
     * Mark guide as helpful or not helpful
     */
    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $guide = MaintenanceGuide::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        // Check if user already gave feedback
        $existing = $guide->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback for this guide',
                'already_voted' => true,
            ], 422);
        }

        // Create feedback
        $guide->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        // Update helpful count
        if ($request->is_helpful) {
            $guide->increment('helpful_count');
        }

        return response()->json([
            'message' => 'Thank you for your feedback!',
            'helpful_count' => $guide->fresh()->helpful_count,
        ]);
    }

    private function getCategories()
    {
        return [
            'all' => 'All Categories',
            'fluid_check' => 'Fluid Checks',
            'filter_replacement' => 'Filter Replacement',
            'tire_maintenance' => 'Tire Maintenance',
            'brake_maintenance' => 'Brake Maintenance',
            'engine_maintenance' => 'Engine Maintenance',
            'electrical' => 'Electrical',
            'seasonal' => 'Seasonal',
            'general' => 'General',
        ];
    }

    private function getDifficulties()
    {
        return [
            'all' => 'All Levels',
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
        ];
    }
}
