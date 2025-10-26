<?php

namespace App\Http\Controllers;

use App\Models\CarIssue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarIssueController extends Controller
{
    /**
     * Display a listing of car issues
     */
    public function index(Request $request)
    {
        $query = CarIssue::published();

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('symptoms', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        // Severity filter
        if ($request->filled('severity')) {
            $query->where('severity', $request->input('severity'));
        }

        // Sorting
        $sortBy = $request->input('sort', 'popular');
        switch ($sortBy) {
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'views':
                $query->orderByDesc('view_count');
                break;
            case 'helpful':
                $query->orderByDesc('helpful_count');
                break;
            case 'popular':
            default:
                $query->orderByDesc('is_popular')
                    ->orderByDesc('view_count');
                break;
        }

        $issues = $query->paginate(12)->withQueryString();

        // Get popular issues for sidebar
        $popularIssues = CarIssue::published()
            ->where('is_popular', true)
            ->orderByDesc('view_count')
            ->take(5)
            ->get();

        // Get category counts
        $categoryStats = CarIssue::published()
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        return Inertia::render('Resources/CarIssues/Index', [
            'issues' => $issues,
            'popularIssues' => $popularIssues,
            'categoryStats' => $categoryStats,
            'filters' => [
                'search' => $request->input('search'),
                'category' => $request->input('category'),
                'severity' => $request->input('severity'),
                'sort' => $sortBy,
            ],
        ]);
    }

    /**
     * Display the specified car issue
     */
    public function show(string $slug)
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
     * Mark an issue as helpful or not helpful
     */
    public function markHelpful(CarIssue $issue, Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'helpful' => 'required|boolean',
        ]);

        if ($validated['helpful']) {
            $issue->incrementHelpful();
        } else {
            $issue->incrementNotHelpful();
        }

        return response()->json([
            'success' => true,
            'helpful_count' => $issue->helpful_count,
            'not_helpful_count' => $issue->not_helpful_count,
            'message' => 'Thank you for your feedback!',
        ]);
    }
}
