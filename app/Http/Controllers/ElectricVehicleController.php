<?php

namespace App\Http\Controllers;

use App\Models\ElectricVehicle;
use App\Models\ElectricVehicleHelpfulFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ElectricVehicleController extends Controller
{
    /**
     * Display a listing of electric vehicle articles.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $sort = $request->input('sort', 'recent');

        $query = ElectricVehicle::query()
            ->published()
            ->search($search);

        // Apply category filter
        if ($category) {
            $query->category($category);
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
            case 'featured':
                $query->orderByDesc('is_featured')
                    ->orderByDesc('view_count');
                break;
            default:
                $query->orderBy('order')
                    ->latest();
                break;
        }

        $articles = $query->paginate(12)->withQueryString();

        // Get featured articles for hero section
        $featuredArticles = ElectricVehicle::published()
            ->featured()
            ->orderBy('order')
            ->limit(3)
            ->get();

        // Get stats
        $stats = [
            'total_articles' => ElectricVehicle::published()->count(),
            'categories_count' => ElectricVehicle::published()->distinct('category')->count('category'),
            'total_views' => ElectricVehicle::published()->sum('view_count'),
        ];

        return Inertia::render('Resources/ElectricVehicles/Index', [
            'articles' => $articles,
            'categories' => $this->getCategories(),
            'stats' => $stats,
            'featuredArticles' => $featuredArticles,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display the specified article.
     */
    public function show(Request $request, ElectricVehicle $electricVehicle): Response
    {
        // Increment view count
        $electricVehicle->incrementViews();

        // Load related articles
        $electricVehicle->load(['relatedArticles' => function ($query) {
            $query->limit(3);
        }]);

        // Check if user has already provided feedback
        $ipAddress = $request->ip();
        $userFeedback = ElectricVehicleHelpfulFeedback::where('electric_vehicle_id', $electricVehicle->id)
            ->where('ip_address', $ipAddress)
            ->first();

        return Inertia::render('Resources/ElectricVehicles/Show', [
            'article' => $electricVehicle,
            'userFeedback' => $userFeedback ? [
                'is_helpful' => $userFeedback->is_helpful,
            ] : null,
        ]);
    }

    /**
     * Mark article as helpful or not helpful.
     */
    public function markHelpful(Request $request, ElectricVehicle $electricVehicle)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $ipAddress = $request->ip();

        // Check if user has already provided feedback
        $existingFeedback = ElectricVehicleHelpfulFeedback::where('electric_vehicle_id', $electricVehicle->id)
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existingFeedback) {
            // User has already voted - update if different
            if ($existingFeedback->is_helpful != $request->is_helpful) {
                // Decrement old count
                if ($existingFeedback->is_helpful) {
                    $electricVehicle->decrement('helpful_count');
                } else {
                    $electricVehicle->decrement('not_helpful_count');
                }

                // Increment new count
                if ($request->is_helpful) {
                    $electricVehicle->increment('helpful_count');
                } else {
                    $electricVehicle->increment('not_helpful_count');
                }

                // Update feedback
                $existingFeedback->update([
                    'is_helpful' => $request->is_helpful,
                    'comment' => $request->comment,
                ]);
            }

            return back()->with('success', 'Thank you for your feedback!');
        }

        // Create new feedback
        ElectricVehicleHelpfulFeedback::create([
            'electric_vehicle_id' => $electricVehicle->id,
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        // Increment appropriate counter
        if ($request->is_helpful) {
            $electricVehicle->increment('helpful_count');
        } else {
            $electricVehicle->increment('not_helpful_count');
        }

        return back()->with('success', 'Thank you for your feedback!');
    }

    /**
     * Get available categories.
     */
    private function getCategories(): array
    {
        return [
            'buying_guide' => 'Buying Guide',
            'charging' => 'Charging',
            'battery_maintenance' => 'Battery Maintenance',
            'cost_comparison' => 'Cost Comparison',
            'tax_incentives' => 'Tax Incentives',
            'model_reviews' => 'Model Reviews',
            'technology' => 'Technology',
            'environmental' => 'Environmental',
            'infrastructure' => 'Infrastructure',
            'general' => 'General',
        ];
    }
}
