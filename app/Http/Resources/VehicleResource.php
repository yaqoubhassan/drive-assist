<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
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
            'make' => $this->make,
            'model' => $this->model,
            'year' => $this->year,
            'vin' => $this->vin,
            'mileage' => $this->mileage,
            'fuel_type' => $this->fuel_type,
            'transmission_type' => $this->transmission_type,
            'full_name' => $this->full_name,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'diagnoses_count' => $this->when(
                $this->relationLoaded('diagnoses'),
                fn() => $this->diagnoses->count()
            ),
            'maintenance_reminders_count' => $this->when(
                $this->relationLoaded('maintenanceReminders'),
                fn() => $this->maintenanceReminders->count()
            ),
        ];
    }
}
