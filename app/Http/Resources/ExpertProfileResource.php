<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpertProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'business_name' => $this->business_name,
            'business_type' => $this->business_type,
            'bio' => $this->bio,
            'years_experience' => $this->years_experience,
            'employee_count' => $this->employee_count,
            'business_license_number' => $this->business_license_number,
            'insurance_policy_number' => $this->insurance_policy_number,
            'service_radius_km' => $this->service_radius_km,
            'pricing' => [
                'hourly_rate_min' => $this->hourly_rate_min,
                'hourly_rate_max' => $this->hourly_rate_max,
                'diagnostic_fee' => $this->diagnostic_fee,
                'pricing_tier' => $this->getPricingTier(),
            ],
            'accepts_emergency' => $this->accepts_emergency,
            'operating_hours' => $this->getAllOperatingHours(),
            'formatted_business_hours' => $this->getFormattedBusinessHours(),
            'is_open' => $this->isOpen(),
            'is_currently_open' => $this->isCurrentlyOpen(),
            'next_opening_time' => $this->getNextOpeningTime(),
            'verification_status' => $this->verification_status,
            'verified_at' => $this->verified_at?->toISOString(),
            'is_verified' => $this->is_verified,
            'is_pending_verification' => $this->is_pending_verification,
            'verification_status_badge' => $this->verification_status_badge,
            'is_featured' => $this->is_featured,
            'profile_views' => $this->profile_views,
            'total_jobs' => $this->total_jobs,
            'avg_rating' => $this->avg_rating,
            'profile_completed' => $this->profile_completed,
            'has_completed_kyc' => $this->has_completed_kyc,
            'kyc_completion_percentage' => $this->kyc_completion_percentage,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'user' => new UserResource($this->whenLoaded('user')),
            'specialties' => ExpertSpecialtyResource::collection($this->whenLoaded('specialties')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
        ];
    }
}
