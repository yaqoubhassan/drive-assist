<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class MaintenanceGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'difficulty',
        'estimated_time_minutes',
        'description',
        'tools_required',
        'materials_needed',
        'steps',
        'safety_warnings',
        'tips_and_tricks',
        'estimated_cost_min',
        'estimated_cost_max',
        'featured_image',
        'video_url',
        'view_count',
        'helpful_count',
        'is_popular',
        'is_published',
    ];

    protected $casts = [
        'tools_required' => 'array',
        'materials_needed' => 'array',
        'steps' => 'array',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = ['formatted_time', 'formatted_cost_range'];

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($guide) {
            if (empty($guide->slug)) {
                $guide->slug = Str::slug($guide->title);
            }
        });
    }

    // Scope for published guides
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    // Scope for popular guides
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    // Scope by category
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Search scope
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%");
        });
    }

    // Increment view count
    public function incrementViews()
    {
        $this->increment('view_count');
    }

    // Polymorphic relation for helpful feedback
    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    // Formatted time accessor
    public function getFormattedTimeAttribute()
    {
        if (!$this->estimated_time_minutes) {
            return 'Varies';
        }

        $hours = floor($this->estimated_time_minutes / 60);
        $minutes = $this->estimated_time_minutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }

    // Formatted cost range accessor
    public function getFormattedCostRangeAttribute()
    {
        if (!$this->estimated_cost_min && !$this->estimated_cost_max) {
            return 'Cost varies';
        }

        if ($this->estimated_cost_min && $this->estimated_cost_max) {
            return '$' . number_format($this->estimated_cost_min, 0) . ' - $' . number_format($this->estimated_cost_max, 0);
        }

        return '$' . number_format($this->estimated_cost_min ?? $this->estimated_cost_max, 0);
    }

    // Get difficulty badge color
    public function getDifficultyColorAttribute()
    {
        return match ($this->difficulty) {
            'beginner' => 'green',
            'intermediate' => 'yellow',
            'advanced' => 'red',
            default => 'gray',
        };
    }
}
