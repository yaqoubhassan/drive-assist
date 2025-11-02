<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DiagnosisImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'diagnosis_id',
        'image_url',
        'image_path',
        'file_size',
        'mime_type',
        'width',
        'height',
        'order_index',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'order_index' => 'integer',
    ];

    /**
     * Get the diagnosis that owns the image
     */
    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class);
    }

    /**
     * Get the full URL for the image
     * 
     * @return string
     */
    public function getUrlAttribute()
    {
        return $this->image_url;
    }

    /**
     * Get formatted file size
     */
    public function getFileSizeHumanAttribute()
    {
        $bytes = $this->file_size;

        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    /**
     * Delete the image file when the model is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($image) {
            // Delete the physical file from storage
            if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
        });
    }
}
