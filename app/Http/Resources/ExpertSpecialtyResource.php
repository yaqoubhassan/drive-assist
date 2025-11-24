<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpertSpecialtyResource extends JsonResource
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
            'specialty' => $this->specialty,
            'formatted_name' => $this->formatted_name,
        ];
    }
}
