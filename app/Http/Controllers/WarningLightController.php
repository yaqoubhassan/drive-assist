<?php

namespace App\Http\Controllers;

use App\Models\WarningLight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarningLightController extends Controller
{
    public function index(Request $request)
    {
        $query = WarningLight::published();

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by severity
        if ($request->has('severity') && $request->severity && $request->severity !== 'all') {
            $query->bySeverity($request->severity);
        }

        // Filter by color
        if ($request->has('color') && $request->color && $request->color !== 'all') {
            $query->byColor($request->color);
        }

        // Sorting
        $sortBy = $request->get('sort', 'popular');
        switch ($sortBy) {
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'severity':
                $query->orderByRaw("
                    CASE severity
                        WHEN 'critical' THEN 1
                        WHEN 'warning' THEN 2
                        WHEN 'caution' THEN 3
                        WHEN 'info' THEN 4
                    END
                ");
                break;
            case 'popular':
            default:
                $query->orderBy('view_count', 'desc');
                break;
        }

        $lights = $query->paginate(12)->withQueryString();

        return Inertia::render('Resources/Maintenance/WarningLights/Index', [
            'lights' => $lights,
            'severities' => $this->getSeverities(),
            'colors' => $this->getColors(),
            'currentSeverity' => $request->get('severity', 'all'),
            'currentColor' => $request->get('color', 'all'),
            'searchQuery' => $request->get('search', ''),
            'currentSort' => $sortBy,
            'commonLights' => WarningLight::published()
                ->common()
                ->take(6)
                ->get(),
        ]);
    }

    public function show($slug)
    {
        $light = WarningLight::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $light->incrementViews();

        // Get related warning lights
        $relatedLights = WarningLight::published()
            ->where('severity', $light->severity)
            ->where('id', '!=', $light->id)
            ->take(3)
            ->get();

        return Inertia::render('Resources/Maintenance/WarningLights/Show', [
            'light' => $light,
            'relatedLights' => $relatedLights,
        ]);
    }

    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $light = WarningLight::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        $existing = $light->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback',
                'already_voted' => true,
            ], 422);
        }

        $light->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Thank you for your feedback!']);
    }

    private function getSeverities()
    {
        return [
            'all' => 'All Severities',
            'info' => 'Information',
            'caution' => 'Caution',
            'warning' => 'Warning',
            'critical' => 'Critical',
        ];
    }

    private function getColors()
    {
        return [
            'all' => 'All Colors',
            'red' => 'Red',
            'yellow' => 'Yellow',
            'orange' => 'Orange',
            'blue' => 'Blue',
            'green' => 'Green',
            'white' => 'White',
        ];
    }
}
