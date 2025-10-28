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
        $query = DrivingTip::query()->published();

        // Search
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Category filter
        if ($category = $request->input('category')) {
            $query->category($category);
        }

        // Difficulty filter
        if ($difficulty = $request->input('difficulty')) {
            $query->difficulty($difficulty);
        }

        // Sorting
        $sort = $request->input('sort', 'popular');
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
            default:
                $query->orderByDesc('is_popular')
                    ->orderByDesc('view_count');
                break;
        }

        $tips = $query->paginate(12)->withQueryString();

        // Get categories for filter dropdown
        $categories = $this->getCategories();

        // Get difficulties for filter dropdown
        $difficulties = [
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
        ];

        // Get stats
        $stats = [
            'total_tips' => DrivingTip::published()->count(),
            'categories_count' => DrivingTip::published()->distinct('category')->count('category'),
            'total_views' => DrivingTip::published()->sum('view_count'),
        ];

        // Featured tips (for homepage/sidebar)
        $featuredTips = DrivingTip::query()
            ->published()
            ->featured()
            ->limit(3)
            ->get();

        return Inertia::render('Resources/DrivingTips/Index', [
            'tips' => $tips,
            'categories' => $categories,
            'difficulties' => $difficulties,
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

        // Get user's interaction with this tip (if authenticated)
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
            'userProgress' => $userProgress,
        ]);
    }

    /**
     * Mark a tip as helpful.
     */
    public function markHelpful(Request $request, DrivingTip $drivingTip)
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'You must be logged in to mark tips as helpful.'
            ], 401);
        }

        $userProgress = $request->user()
            ->drivingTips()
            ->where('driving_tip_id', $drivingTip->id)
            ->first();

        if ($userProgress && $userProgress->pivot->is_helpful) {
            return response()->json([
                'message' => 'You have already marked this tip as helpful.',
                'helpful_count' => $drivingTip->helpful_count,
            ]);
        }

        // Create or update user progress
        $request->user()->drivingTips()->syncWithoutDetaching([
            $drivingTip->id => [
                'is_helpful' => true,
                'is_read' => true,
                'read_at' => now(),
            ]
        ]);

        // Increment helpful count
        $drivingTip->increment('helpful_count');

        return response()->json([
            'message' => 'Thank you for your feedback!',
            'helpful_count' => $drivingTip->helpful_count,
        ]);
    }

    /**
     * Toggle bookmark for a tip.
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
}
