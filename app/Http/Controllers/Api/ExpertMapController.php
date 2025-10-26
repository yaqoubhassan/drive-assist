<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExpertProfile;
use Illuminate\Http\JsonResponse;

class ExpertMapController extends Controller
{
    /**
     * Get nearby experts for the map demo.
     * Returns a sample of verified experts with their locations.
     */
    public function getNearbyExperts(): JsonResponse
    {
        // For the landing page demo, we'll get all verified experts
        // In production, you might want to add geolocation filtering
        $experts = ExpertProfile::query()
            ->with(['user', 'specialties', 'reviews'])
            ->where('verification_status', 'approved')
            ->whereHas('user', function ($query) {
                $query->whereNotNull('location_latitude')
                    ->whereNotNull('location_longitude');
            })
            ->get()
            ->map(function ($expert) {
                return [
                    'id' => $expert->id,
                    'name' => $expert->user->name,
                    'businessName' => $expert->business_name,
                    'lat' => (float) $expert->user->location_latitude,
                    'lng' => (float) $expert->user->location_longitude,
                    'rating' => (float) $expert->avg_rating,
                    'reviewCount' => $expert->reviews->count(),
                    'distance' => $this->calculateDistance($expert), // Placeholder
                    'specialties' => $expert->specialties->pluck('specialty')
                        ->map(fn($s) => ucfirst($s))
                        ->take(3)
                        ->toArray(),
                    'isOpen' => $expert->isOpen(),
                    'responseTime' => $this->estimateResponseTime($expert),
                    'pricing' => $expert->getPricingTier(),
                ];
            });

        return response()->json($experts);
    }

    /**
     * Calculate placeholder distance (for demo purposes)
     * In production, this would use real geolocation
     */
    private function calculateDistance(ExpertProfile $expert): string
    {
        // For demo, generate realistic distance
        $distance = round(rand(5, 50) / 10, 1);
        return $distance . ' mi';
    }

    /**
     * Estimate response time based on expert's average
     */
    private function estimateResponseTime(ExpertProfile $expert): string
    {
        // Simple estimation based on number of jobs
        if ($expert->total_jobs > 100) {
            return '< 1 hour';
        } elseif ($expert->total_jobs > 50) {
            return '< 2 hours';
        } else {
            return '< 3 hours';
        }
    }
}
