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

    protected $appends = [
        'formatted_time',
        'formatted_cost_range',
        'category_label',
        'difficulty_badge'
    ];

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

    /**
     * Ensure tools_required is always an array
     */
    public function getToolsRequiredAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        if (is_array($value)) {
            return $value;
        }
        return [];
    }

    /**
     * Ensure materials_needed is always an array
     */
    public function getMaterialsNeededAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        if (is_array($value)) {
            return $value;
        }
        return [];
    }

    /**
     * Ensure steps is always an array
     */
    public function getStepsAttribute($value)
    {
        if (is_null($value)) {
            return [];
        }
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        if (is_array($value)) {
            return $value;
        }
        return [];
    }

    /**
     * Get category label
     */
    public function getCategoryLabelAttribute()
    {
        return match ($this->category) {
            'fluid_check' => 'Fluid Checks',
            'filter_replacement' => 'Filter Replacement',
            'tire_maintenance' => 'Tire Maintenance',
            'brake_maintenance' => 'Brake Maintenance',
            'engine_maintenance' => 'Engine Maintenance',
            'electrical' => 'Electrical',
            'seasonal' => 'Seasonal',
            'general' => 'General',
            default => 'General',
        };
    }

    /**
     * Get difficulty badge data
     */
    public function getDifficultyBadgeAttribute()
    {
        return match ($this->difficulty) {
            'beginner' => [
                'label' => 'Beginner',
                'color' => 'green',
                'bg_class' => 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
            ],
            'intermediate' => [
                'label' => 'Intermediate',
                'color' => 'yellow',
                'bg_class' => 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
            ],
            'advanced' => [
                'label' => 'Advanced',
                'color' => 'red',
                'bg_class' => 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
            ],
            default => [
                'label' => 'Beginner',
                'color' => 'green',
                'bg_class' => 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
            ],
        };
    }

    /**
     * Get formatted time
     */
    public function getFormattedTimeAttribute()
    {
        if (!$this->estimated_time_minutes) {
            return 'Time varies';
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

    /**
     * Get formatted cost range
     */
    public function getFormattedCostRangeAttribute()
    {
        if ($this->estimated_cost_min && $this->estimated_cost_max) {
            return '$' . number_format($this->estimated_cost_min, 0) . ' - $' . number_format($this->estimated_cost_max, 0);
        } elseif ($this->estimated_cost_min) {
            return 'From $' . number_format($this->estimated_cost_min, 0);
        } elseif ($this->estimated_cost_max) {
            return 'Up to $' . number_format($this->estimated_cost_max, 0);
        }

        return 'Cost varies';
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

    // Relationship with helpful feedback
    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }
}
