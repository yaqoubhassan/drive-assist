<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarIssueResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'category' => $this->category,
            'severity' => $this->severity,
            'symptoms' => $this->symptoms,
            'description' => $this->description,
            'possible_causes' => $this->possible_causes,
            'diy_solutions' => $this->diy_solutions,
            'when_to_call_expert' => $this->when_to_call_expert,
            'estimated_cost' => [
                'min' => $this->estimated_cost_min,
                'max' => $this->estimated_cost_max,
                'range' => $this->cost_range,
                'currency' => 'USD',
            ],
            'estimated_time' => $this->estimated_time,
            'featured_image' => $this->featured_image,
            'view_count' => $this->view_count,
            'helpful_count' => $this->helpful_count,
            'not_helpful_count' => $this->not_helpful_count,
            'is_popular' => $this->is_popular,
            'is_published' => $this->is_published,
            'content' => $this->content,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
