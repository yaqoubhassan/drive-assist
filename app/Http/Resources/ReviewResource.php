<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'expert_profile_id' => $this->expert_profile_id,
            'driver_id' => $this->driver_id,
            'job_id' => $this->job_id,
            'ratings' => [
                'overall' => $this->overall_rating,
                'quality' => $this->quality_rating,
                'professionalism' => $this->professionalism_rating,
                'pricing' => $this->pricing_rating,
                'communication' => $this->communication_rating,
                'average_aspect' => $this->getAverageAspectRating(),
            ],
            'review_text' => $this->review_text,
            'expert_response' => $this->expert_response,
            'expert_responded_at' => $this->expert_responded_at?->toISOString(),
            'is_verified_purchase' => $this->is_verified_purchase,
            'helpful_count' => $this->helpful_count,
            'has_expert_response' => $this->hasExpertResponse(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'driver' => new UserResource($this->whenLoaded('driver')),
            'images' => ReviewImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
