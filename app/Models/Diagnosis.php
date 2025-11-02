<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_id',
        'session_id',
        'category',
        'user_description',
        'voice_note_url',
        'ai_provider',
        'ai_request_id',
        'identified_issue',
        'confidence_score',
        'explanation',
        'diy_steps',
        'safety_warnings',
        'estimated_cost_min',
        'estimated_cost_max',
        'urgency_level',
        'safe_to_drive',
        'related_articles',
        'processing_time_seconds',
        'user_feedback',
        'status',
    ];

    protected $casts = [
        'diy_steps' => 'array',
        'related_articles' => 'array',
        'confidence_score' => 'integer',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'processing_time_seconds' => 'integer',
        'safe_to_drive' => 'boolean',
    ];

    protected $attributes = [
        'ai_provider' => 'groq',  // Set default value
        'status' => 'pending',
    ];

    /**
     * Get the user that owns the diagnosis
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vehicle for this diagnosis
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get all images for this diagnosis
     */
    public function images()
    {
        return $this->hasMany(DiagnosisImage::class)->orderBy('order_index');
    }

    /**
     * Get expert leads related to this diagnosis
     */
    public function expertLeads()
    {
        return $this->hasMany(ExpertLead::class);
    }

    /**
     * Check if diagnosis was helpful
     */
    public function wasHelpful()
    {
        return $this->user_feedback === 'helpful';
    }

    /**
     * Get urgency badge color
     */
    public function getUrgencyColorAttribute()
    {
        return match ($this->urgency_level) {
            'critical' => 'red',
            'medium' => 'yellow',
            'low' => 'green',
            default => 'gray',
        };
    }

    /**
     * Scope for completed diagnoses
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for failed diagnoses
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
