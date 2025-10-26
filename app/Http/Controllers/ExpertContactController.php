<?php

namespace App\Http\Controllers;

use App\Models\ExpertProfile;
use App\Models\ExpertLead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ExpertContactController extends Controller
{
    /**
     * Show the contact form.
     */
    public function create(ExpertProfile $expert): Response
    {
        return Inertia::render('Experts/Contact', [
            'expert' => [
                'id' => $expert->id,
                'businessName' => $expert->business_name,
                'rating' => $expert->avg_rating,
                'reviewCount' => $expert->reviews_count,
                'responseTime' => $this->getAverageResponseTime($expert),
            ],
        ]);
    }

    /**
     * Store the contact form submission.
     */
    public function store(Request $request, ExpertProfile $expert): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:1000',
            'diagnosis_id' => 'nullable|exists:diagnoses,id',
            'preferred_contact_method' => 'required|in:email,phone,sms',
            'best_time_to_contact' => 'nullable|string|max:100',
        ]);

        // Create the lead
        ExpertLead::create([
            'expert_profile_id' => $expert->id,
            'driver_id' => auth()->id(), // null if guest
            'diagnosis_id' => $validated['diagnosis_id'] ?? null,
            'driver_name' => $validated['name'],
            'driver_email' => $validated['email'],
            'driver_phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'preferred_contact_method' => $validated['preferred_contact_method'],
            'best_time_to_contact' => $validated['best_time_to_contact'] ?? null,
            'status' => 'new',
        ]);

        // Send notification to expert (implement in a job/event)
        // dispatch(new SendExpertLeadNotification($lead));

        return redirect()->back()->with('success', 'Your message has been sent! The expert will contact you soon.');
    }

    private function getAverageResponseTime(ExpertProfile $expert): string
    {
        // Calculate based on past leads
        // For now, return a default
        return '< 2 hours';
    }
}
