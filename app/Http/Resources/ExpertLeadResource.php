<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpertLeadResource extends JsonResource
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
            'diagnosis_id' => $this->diagnosis_id,
            'driver_name' => $this->driver_name,
            'driver_email' => $this->driver_email,
            'driver_phone' => $this->driver_phone,
            'message' => $this->message,
            'preferred_contact_method' => $this->preferred_contact_method,
            'best_time_to_contact' => $this->best_time_to_contact,
            'status' => $this->status,
            'expert_response' => $this->expert_response,
            'expert_responded_at' => $this->expert_responded_at?->toISOString(),
            'is_new' => $this->isNew(),
            'has_response' => $this->hasResponse(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'expert_profile' => new ExpertProfileResource($this->whenLoaded('expertProfile')),
            'driver' => new UserResource($this->whenLoaded('driver')),
            'diagnosis' => new DiagnosisResource($this->whenLoaded('diagnosis')),
        ];
    }
}
