<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceReminderResource extends JsonResource
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
            'vehicle_id' => $this->vehicle_id,
            'reminder_type' => $this->reminder_type,
            'formatted_type' => $this->formatted_type,
            'due_date' => $this->due_date?->toDateString(),
            'due_mileage' => $this->due_mileage,
            'description' => $this->description,
            'is_completed' => $this->is_completed,
            'completed_at' => $this->completed_at?->toISOString(),
            'is_overdue' => $this->isOverdue(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'vehicle' => new VehicleResource($this->whenLoaded('vehicle')),
        ];
    }
}
