<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CarIssueResource;
use App\Http\Resources\RoadSignResource;
use App\Models\CarIssue;
use App\Models\RoadSign;
use Illuminate\Http\Request;

class ResourceController extends ApiController
{
    /**
     * Get car issues.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCarIssues(Request $request)
    {
        try {
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
            if ($request->filled('category') && $request->input('category') !== 'all') {
                $query->where('category', $request->input('category'));
            }

            // Severity filter
            if ($request->filled('severity')) {
                $query->where('severity', $request->input('severity'));
            }

            // Sorting
            $sortBy = $request->input('sort', 'popular');
            switch ($sortBy) {
                case 'recent':
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
                    $query->orderByDesc('is_popular')->orderByDesc('view_count');
                    break;
            }

            $issues = $query->paginate($request->input('per_page', 12));

            // Get popular issues
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

            return $this->successResponse([
                'data' => CarIssueResource::collection($issues->items()),
                'pagination' => [
                    'total' => $issues->total(),
                    'per_page' => $issues->perPage(),
                    'current_page' => $issues->currentPage(),
                    'last_page' => $issues->lastPage(),
                ],
                'popular_issues' => CarIssueResource::collection($popularIssues),
                'category_stats' => $categoryStats,
                'categories' => [
                    'engine' => 'Engine',
                    'brakes' => 'Brakes',
                    'electrical' => 'Electrical',
                    'transmission' => 'Transmission',
                    'tires' => 'Tires',
                    'suspension' => 'Suspension',
                    'cooling' => 'Cooling',
                    'fuel' => 'Fuel System',
                    'exhaust' => 'Exhaust',
                    'steering' => 'Steering',
                ],
            ], 'Car issues retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get a specific car issue.
     *
     * @param string $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCarIssue(string $slug)
    {
        try {
            $issue = CarIssue::published()->where('slug', $slug)->firstOrFail();
            $issue->incrementViews();

            // Get related issues
            $relatedIssues = CarIssue::published()
                ->where('category', $issue->category)
                ->where('id', '!=', $issue->id)
                ->take(3)
                ->get();

            return $this->successResponse([
                'issue' => new CarIssueResource($issue),
                'related_issues' => CarIssueResource::collection($relatedIssues),
            ], 'Car issue retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Car issue not found');
        }
    }

    /**
     * Mark car issue as helpful.
     *
     * @param Request $request
     * @param CarIssue $issue
     * @return \Illuminate\Http\JsonResponse
     */
    public function markCarIssueHelpful(Request $request, CarIssue $issue)
    {
        try {
            $isHelpful = $request->input('helpful', true);

            if ($isHelpful) {
                $issue->incrementHelpful();
            } else {
                $issue->incrementNotHelpful();
            }

            return $this->successResponse([
                'helpful_count' => $issue->helpful_count,
                'not_helpful_count' => $issue->not_helpful_count,
            ], 'Thank you for your feedback!');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get road signs.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoadSigns(Request $request)
    {
        try {
            $query = RoadSign::query();

            // Search
            if ($request->filled('search')) {
                $query->search($request->input('search'));
            }

            // Category filter
            if ($request->filled('category')) {
                $query->byCategory($request->input('category'));
            }

            // Sorting
            if ($request->input('sort') === 'popular') {
                $query->popular()->orderByDesc('view_count');
            } else {
                $query->orderBy('name');
            }

            $signs = $query->paginate($request->input('per_page', 12));

            // Get popular signs
            $popularSigns = RoadSign::popular()
                ->orderByDesc('view_count')
                ->take(5)
                ->get();

            // Get category counts
            $categoryStats = RoadSign::query()
                ->selectRaw('category, count(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category');

            return $this->successResponse([
                'data' => RoadSignResource::collection($signs->items()),
                'pagination' => [
                    'total' => $signs->total(),
                    'per_page' => $signs->perPage(),
                    'current_page' => $signs->currentPage(),
                    'last_page' => $signs->lastPage(),
                ],
                'popular_signs' => RoadSignResource::collection($popularSigns),
                'category_stats' => $categoryStats,
                'categories' => [
                    'warning' => 'Warning Signs',
                    'regulatory' => 'Regulatory Signs',
                    'guide' => 'Guide Signs',
                    'information' => 'Information Signs',
                    'construction' => 'Construction Signs',
                ],
            ], 'Road signs retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get a specific road sign.
     *
     * @param string $slug
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRoadSign(string $slug)
    {
        try {
            $sign = RoadSign::where('slug', $slug)->firstOrFail();
            $sign->incrementViewCount();

            // Get related signs
            $relatedSigns = RoadSign::where('category', $sign->category)
                ->where('id', '!=', $sign->id)
                ->take(3)
                ->get();

            return $this->successResponse([
                'sign' => new RoadSignResource($sign),
                'related_signs' => RoadSignResource::collection($relatedSigns),
            ], 'Road sign retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Road sign not found');
        }
    }
}
