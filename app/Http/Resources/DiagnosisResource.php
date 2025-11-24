<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiagnosisResource extends JsonResource
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
            'vehicle_id' => $this->vehicle_id,
            'session_id' => $this->session_id,
            'category' => $this->category,
            'user_description' => $this->user_description,
            'voice_note_url' => $this->voice_note_url,
            'ai_provider' => $this->ai_provider,
            'ai_request_id' => $this->ai_request_id,
            'identified_issue' => $this->identified_issue,
            'confidence_score' => $this->confidence_score,
            'explanation' => $this->explanation,
            'diy_steps' => $this->diy_steps,
            'safety_warnings' => $this->safety_warnings,
            'estimated_cost' => [
                'min' => $this->estimated_cost_min,
                'max' => $this->estimated_cost_max,
                'currency' => 'USD',
            ],
            'urgency_level' => $this->urgency_level,
            'urgency_color' => $this->urgency_color,
            'safe_to_drive' => $this->safe_to_drive,
            'related_articles' => $this->related_articles,
            'processing_time_seconds' => $this->processing_time_seconds,
            'user_feedback' => $this->user_feedback,
            'status' => $this->status,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
            'images' => DiagnosisImageResource::collection($this->whenLoaded('images')),
            'expert_leads' => ExpertLeadResource::collection($this->whenLoaded('expertLeads')),
        ];
    }
}
