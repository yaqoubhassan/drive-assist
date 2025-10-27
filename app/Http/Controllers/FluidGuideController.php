<?php

namespace App\Http\Controllers;

use App\Models\FluidGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FluidGuideController extends Controller
{
    public function index(Request $request)
    {
        $query = FluidGuide::published();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        // Filter by fluid type
        if ($request->has('type') && $request->type) {
            $query->where('name', 'like', "%{$request->type}%")
                ->orWhere('description', 'like', "%{$request->type}%")
                ->orWhere('fluid_type', 'like', "%{$request->type}%");
        }

        // Sorting
        $sort = $request->get('sort', 'critical');
        switch ($sort) {
            case 'popular':
                $query->orderBy('view_count', 'desc');
                break;
            case 'alphabetical':
                $query->orderBy('name', 'asc');
                break;
            case 'critical':
            default:
                $query->orderBy('is_critical', 'desc')
                    ->orderBy('name', 'asc');
                break;
        }

        $fluids = $query->paginate(12)->withQueryString();

        return Inertia::render('Resources/Maintenance/Fluids/Index', [
            'fluids' => $fluids,
            'searchQuery' => $request->get('search', ''),
            'currentType' => $request->get('type', ''),
            'currentSort' => $request->get('sort', 'critical'),
            'criticalFluids' => FluidGuide::published()
                ->critical()
                ->orderBy('name', 'asc')
                ->get(),
        ]);
    }

    public function show($slug)
    {
        $fluid = FluidGuide::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $fluid->incrementViews();

        // Get related fluids
        $relatedFluids = FluidGuide::published()
            ->where('id', '!=', $fluid->id)
            ->take(3)
            ->get();

        return Inertia::render('Resources/Maintenance/Fluids/Show', [
            'fluid' => $fluid,
            'relatedFluids' => $relatedFluids,
        ]);
    }

    public function feedback(Request $request, $slug)
    {
        $request->validate([
            'is_helpful' => 'required|boolean',
            'comment' => 'nullable|string|max:500',
        ]);

        $fluid = FluidGuide::where('slug', $slug)->firstOrFail();
        $ipAddress = $request->ip();

        $existing = $fluid->helpfulFeedback()
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already provided feedback',
                'already_voted' => true,
            ], 422);
        }

        $fluid->helpfulFeedback()->create([
            'ip_address' => $ipAddress,
            'is_helpful' => $request->is_helpful,
            'comment' => $request->comment,
        ]);

        return response()->json(['message' => 'Thank you for your feedback!']);
    }
}
