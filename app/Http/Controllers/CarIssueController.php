<?php

namespace App\Http\Controllers;

use App\Models\CarIssue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarIssueController extends Controller
{
    /**
     * Display a listing of car issues
     */
    public function index(Request $request): Response
    {
        $category = $request->input('category', 'all');
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'popular'); // popular, recent, title

        $query = CarIssue::published();

        // Apply filters
        if ($category !== 'all') {
            $query->category($category);
        }

        if ($search) {
            $query->search($search);
        }

        // Apply sorting
        $query = match ($sort) {
            'recent' => $query->latest(),
            'title' => $query->orderBy('title'),
            'views' => $query->orderByDesc('view_count'),
            default => $query->popular(),
        };

        $issues = $query->paginate(12)->withQueryString();

        // Get popular issues for sidebar
        $popularIssues = CarIssue::published()
            ->popular()
            ->take(5)
            ->get();

        // Get categories with counts
        $categories = [
            'all' => 'All Issues',
            'engine' => 'Engine',
            'brakes' => 'Brakes',
            'electrical' => 'Electrical',
            'transmission' => 'Transmission',
            'tires' => 'Tires & Wheels',
            'suspension' => 'Suspension',
            'cooling' => 'Cooling System',
            'fuel' => 'Fuel System',
            'exhaust' => 'Exhaust',
            'steering' => 'Steering',
            'other' => 'Other',
        ];

        return Inertia::render('Resources/CarIssues/Index', [
            'issues' => $issues,
            'popularIssues' => $popularIssues,
            'categories' => $categories,
            'currentCategory' => $category,
            'searchQuery' => $search,
            'currentSort' => $sort,
        ]);
    }

    /**
     * Display the specified car issue
     */
    public function show(string $slug): Response
    {
        $issue = CarIssue::where('slug', $slug)
            ->where('is_published', true)
            ->with('relatedIssues')
            ->firstOrFail();

        // Increment view count
        $issue->incrementViews();

        // Get related issues if not already loaded
        $relatedIssues = $issue->relatedIssues()->take(3)->get();

        // If no manually related issues, get issues from same category
        if ($relatedIssues->isEmpty()) {
            $relatedIssues = CarIssue::published()
                ->where('category', $issue->category)
                ->where('id', '!=', $issue->id)
                ->inRandomOrder()
                ->take(3)
                ->get();
        }

        return Inertia::render('Resources/CarIssues/Show', [
            'issue' => $issue,
            'relatedIssues' => $relatedIssues,
        ]);
    }

    /**
     * Mark an issue as helpful
     */
    public function markHelpful(CarIssue $issue): \Illuminate\Http\JsonResponse
    {
        $issue->incrementHelpful();

        return response()->json([
            'success' => true,
            'helpful_count' => $issue->helpful_count,
        ]);
    }
}
