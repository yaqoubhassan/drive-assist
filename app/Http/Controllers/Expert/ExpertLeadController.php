<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpertLeadController extends Controller
{
    /**
     * Display all leads
     */
    public function index(Request $request): Response
    {
        $expertProfile = auth()->user()->expertProfile;

        $query = $expertProfile->leads()->with(['driver', 'diagnosis.vehicle']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $leads = $query->latest()->paginate(20);

        // Get counts for filter badges
        $statusCounts = [
            'all' => $expertProfile->leads()->count(),
            'new' => $expertProfile->leads()->where('status', 'new')->count(),
            'contacted' => $expertProfile->leads()->where('status', 'contacted')->count(),
            'in_progress' => $expertProfile->leads()->where('status', 'in_progress')->count(),
            'completed' => $expertProfile->leads()->where('status', 'completed')->count(),
            'cancelled' => $expertProfile->leads()->where('status', 'cancelled')->count(),
        ];

        return Inertia::render('Expert/Leads/Index', [
            'leads' => $leads,
            'statusCounts' => $statusCounts,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show a specific lead
     */
    public function show($id): Response
    {
        $lead = auth()->user()
            ->expertProfile
            ->leads()
            ->with(['driver', 'diagnosis.vehicle', 'diagnosis.images'])
            ->findOrFail($id);

        // Mark as viewed if it's a new lead
        if ($lead->status === 'new') {
            $lead->update(['status' => 'contacted']);
        }

        return Inertia::render('Expert/Leads/Show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Respond to a lead
     */
    public function respond(Request $request, $id)
    {
        $lead = auth()->user()
            ->expertProfile
            ->leads()
            ->findOrFail($id);

        $validated = $request->validate([
            'expert_response' => 'required|string|max:1000',
            'estimated_cost' => 'nullable|numeric|min:0',
            'estimated_hours' => 'nullable|numeric|min:0',
        ]);

        $lead->update([
            'expert_response' => $validated['expert_response'],
            'expert_responded_at' => now(),
            'status' => 'contacted',
        ]);

        // Send notification to driver
        // NotificationService::sendLeadResponseNotification($lead);

        return back()->with('success', 'Response sent to driver successfully.');
    }

    /**
     * Update lead status
     */
    public function updateStatus(Request $request, $id)
    {
        $lead = auth()->user()
            ->expertProfile
            ->leads()
            ->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:new,contacted,in_progress,completed,cancelled',
        ]);

        $lead->update($validated);

        return back()->with('success', 'Lead status updated successfully.');
    }
}
