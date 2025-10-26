<?php

namespace App\Http\Controllers;

use App\Models\ExpertProfile;
use Inertia\Inertia;
use Inertia\Response;

class ExpertController extends Controller
{
    /**
     * Display the specified expert profile.
     */
    public function show(ExpertProfile $expert): Response
    {
        // Load relationships
        $expert->load([
            'user',
            'specialties',
            'reviews' => function ($query) {
                $query->latest()->take(10);
            }
        ]);

        return Inertia::render('Experts/Show', [
            'expert' => [
                'id' => $expert->id,
                'businessName' => $expert->business_name,
                'bio' => $expert->bio,
                'rating' => $expert->avg_rating,
                'reviewCount' => $expert->reviews_count,
                'specialties' => $expert->specialties->pluck('specialty'),
                'isOpen' => $this->checkIfOpen($expert),
                'location' => [
                    'address' => $expert->user->location_address,
                    'latitude' => $expert->user->location_latitude,
                    'longitude' => $expert->user->location_longitude,
                ],
                'contact' => [
                    'phone' => $expert->user->phone,
                    'email' => $expert->user->email,
                ],
                'hours' => $this->getFormattedHours($expert),
                'pricing' => [
                    'hourlyMin' => $expert->hourly_rate_min,
                    'hourlyMax' => $expert->hourly_rate_max,
                    'diagnosticFee' => $expert->diagnostic_fee,
                ],
                'recentReviews' => $expert->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => $review->overall_rating,
                        'text' => $review->review_text,
                        'author' => $review->driver->name,
                        'createdAt' => $review->created_at->diffForHumans(),
                    ];
                }),
            ],
        ]);
    }

    private function checkIfOpen(ExpertProfile $expert): bool
    {
        $now = now();
        $dayOfWeek = strtolower($now->format('l'));

        $openTime = $expert->{$dayOfWeek . '_open'};
        $closeTime = $expert->{$dayOfWeek . '_close'};

        if (!$openTime || !$closeTime) {
            return false;
        }

        $currentTime = $now->format('H:i:s');

        return $currentTime >= $openTime && $currentTime <= $closeTime;
    }

    private function getFormattedHours(ExpertProfile $expert): array
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $hours = [];

        foreach ($days as $day) {
            $openKey = $day . '_open';
            $closeKey = $day . '_close';

            $hours[$day] = [
                'open' => $expert->$openKey,
                'close' => $expert->$closeKey,
                'isOpen' => $expert->$openKey && $expert->$closeKey,
            ];
        }

        return $hours;
    }
}
