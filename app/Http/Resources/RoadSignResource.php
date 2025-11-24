<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoadSignResource extends JsonResource
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
            'slug' => $this->slug,
            'category' => $this->category,
            'description' => $this->description,
            'meaning' => $this->meaning,
            'what_to_do' => $this->what_to_do,
            'image_url' => $this->image_url,
            'shape' => $this->shape,
            'color_scheme' => $this->color_scheme,
            'keywords' => $this->keywords,
            'view_count' => $this->view_count,
            'is_popular' => $this->is_popular,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
