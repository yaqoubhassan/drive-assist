<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiagnosisImageResource extends JsonResource
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
            'diagnosis_id' => $this->diagnosis_id,
            'image_url' => $this->image_url,
            'image_path' => $this->image_path,
            'file_size' => $this->file_size,
            'file_size_human' => $this->file_size_human,
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'order_index' => $this->order_index,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
