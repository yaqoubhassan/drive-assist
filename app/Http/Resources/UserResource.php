<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'user_type' => $this->user_type,
            'avatar_url' => $this->avatar_url,
            'initials' => $this->initials,
            'location' => [
                'latitude' => $this->location_latitude,
                'longitude' => $this->location_longitude,
                'address' => $this->location_address,
            ],
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'last_login_at' => $this->last_login_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'unread_notification_count' => $this->when(
                $request->user()?->id === $this->id,
                fn() => $this->unreadNotifications()->count()
            ),
            'expert_profile' => new ExpertProfileResource($this->whenLoaded('expertProfile')),
        ];
    }
}
