<?php

namespace App\Http\Controllers;

use App\Models\DrivingTip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DrivingTipController extends Controller
{
    /**
     * Display a listing of driving tips.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $difficulty = $request->input('difficulty');
        $sort = $request->input('sort', 'recent');

        $query = DrivingTip::query()
            ->published()
            ->search($search);

        // Apply filters
        if ($category) {
            $query->category($category);
        }

        if ($difficulty) {
            $query->difficulty($difficulty);
        }

        // Apply sorting
        switch ($sort) {
            case 'recent':
                $query->latest();
                break;
            case 'helpful':
                $query->orderByDesc('helpful_count');
                break;
            case 'views':
                $query->orderByDesc('view_count');
                break;
            case 'popular':
                $query->where('is_popular', true)
                    ->orderByDesc('view_count');
                break;
            default:
                $query->latest();
                break;
        }

        $tips = $query->paginate(12)->withQueryString();

        // Get featured tips for sidebar/header
        $featuredTips = DrivingTip::published()
            ->featured()
            ->limit(3)
            ->get();

        // Get stats
        $stats = [
            'total_tips' => DrivingTip::published()->count(),
            'categories_count' => DrivingTip::published()->distinct('category')->count('category'),
            'total_views' => DrivingTip::published()->sum('view_count'),
        ];

        return Inertia::render('Resources/DrivingTips/Index', [
            'tips' => $tips,
            'categories' => $this->getCategories(),
            'difficulties' => $this->getDifficulties(),
            'stats' => $stats,
            'featuredTips' => $featuredTips,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'difficulty' => $difficulty,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display the specified driving tip.
     */
    public function show(Request $request, DrivingTip $drivingTip): Response
    {
        // Increment view count
        $drivingTip->incrementViewCount();

        // Load related tips
        $relatedTips = $drivingTip->relatedTips()
            ->published()
            ->limit(3)
            ->get();

        // If no related tips, get some from the same category
        if ($relatedTips->isEmpty()) {
            $relatedTips = DrivingTip::query()
                ->published()
                ->category($drivingTip->category)
                ->where('id', '!=', $drivingTip->id)
                ->limit(3)
                ->get();
        }

        // Check if user has already voted (by IP address)
        $ipAddress = $request->ip();
        $userFeedback = $drivingTip->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        // Get user's interaction with this tip (if authenticated) - for bookmarks
        $userProgress = null;
        if ($request->user()) {
            $userProgress = $request->user()
                ->drivingTips()
                ->where('driving_tip_id', $drivingTip->id)
                ->first();
        }

        return Inertia::render('Resources/DrivingTips/Show', [
            'tip' => [
                ...$drivingTip->toArray(),
                'category_label' => $drivingTip->category_label,
                'difficulty_label' => $drivingTip->difficulty_label,
                'difficulty_color' => $drivingTip->difficulty_color,
                'category_color' => $drivingTip->category_color,
                'formatted_reading_time' => $drivingTip->formatted_reading_time,
            ],
            'relatedTips' => $relatedTips,
            'userProgress' => $userProgress ? [
                'is_bookmarked' => $userProgress->pivot->is_bookmarked ?? false,
                'is_read' => $userProgress->pivot->is_read ?? false,
            ] : null,
            // Pass voting status to frontend (IP-based)
            'userHasVotedHelpful' => $userFeedback !== null,
        ]);
    }

    /**
     * Mark a tip as helpful (IP-based, no auth required).
     */
    public function markHelpful(Request $request, DrivingTip $drivingTip)
    {
        $ipAddress = $request->ip();

        // Check if user already voted from this IP
        $existing = $drivingTip->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already marked this tip as helpful',
                'already_voted' => true,
                'helpful_count' => $drivingTip->helpful_count,
            ], 422);
        }

        // Create feedback record
        $drivingTip->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => true,
        ]);

        // Increment helpful count
        $drivingTip->incrementHelpful();

        return response()->json([
            'message' => 'Thank you for your feedback!',
            'helpful_count' => $drivingTip->fresh()->helpful_count,
        ]);
    }

    /**
     * Toggle bookmark for a tip (Auth required).
     */
    public function toggleBookmark(Request $request, DrivingTip $drivingTip)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'You must be logged in to bookmark tips.'
            ], 401);
        }

        $userProgress = $request->user()
            ->drivingTips()
            ->where('driving_tip_id', $drivingTip->id)
            ->first();

        $isBookmarked = false;

        if ($userProgress && $userProgress->pivot->is_bookmarked) {
            // Remove bookmark
            $request->user()->drivingTips()->updateExistingPivot($drivingTip->id, [
                'is_bookmarked' => false,
            ]);
            $message = 'Bookmark removed';
        } else {
            // Add bookmark
            $request->user()->drivingTips()->syncWithoutDetaching([
                $drivingTip->id => [
                    'is_bookmarked' => true,
                    'is_read' => true,
                    'read_at' => now(),
                ]
            ]);
            $isBookmarked = true;
            $message = 'Tip bookmarked';
        }

        return response()->json([
            'message' => $message,
            'is_bookmarked' => $isBookmarked,
        ]);
    }

    /**
     * Get available categories.
     */
    private function getCategories(): array
    {
        return [
            'beginner' => 'Beginner Basics',
            'defensive' => 'Defensive Driving',
            'fuel_efficiency' => 'Fuel Efficiency',
            'weather' => 'Weather Driving',
            'advanced' => 'Advanced Techniques',
            'safety' => 'Safety Tips',
            'parking' => 'Parking Skills',
            'highway' => 'Highway Driving',
        ];
    }

    /**
     * Get available difficulties.
     */
    private function getDifficulties(): array
    {
        return [
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
        ];
    }
}
