<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class SeasonalChecklist extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'season',
        'description',
        'checklist_items',
        'why_important',
        'additional_tips',
        'estimated_cost_min',
        'estimated_cost_max',
        'estimated_time_hours',
        'view_count',
        'is_published',
    ];

    protected $casts = [
        'checklist_items' => 'array',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'is_published' => 'boolean',
    ];

    protected $appends = ['season_info', 'formatted_cost_range', 'formatted_time'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($checklist) {
            if (empty($checklist->slug)) {
                $checklist->slug = Str::slug($checklist->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeBySeason($query, $season)
    {
        return $query->where('season', $season);
    }

    public function incrementViews()
    {
        $this->increment('view_count');
    }

    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    public function getSeasonInfoAttribute()
    {
        return match ($this->season) {
            'spring' => [
                'emoji' => '🌸',
                'color' => 'green',
                'bg_class' => 'from-green-500 to-green-600',
            ],
            'summer' => [
                'emoji' => '☀️',
                'color' => 'yellow',
                'bg_class' => 'from-yellow-500 to-yellow-600',
            ],
            'fall' => [
                'emoji' => '🍂',
                'color' => 'orange',
                'bg_class' => 'from-orange-500 to-orange-600',
            ],
            'winter' => [
                'emoji' => '❄️',
                'color' => 'blue',
                'bg_class' => 'from-blue-500 to-blue-600',
            ],
            default => [
                'emoji' => '📅',
                'color' => 'gray',
                'bg_class' => 'from-gray-500 to-gray-600',
            ],
        };
    }

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

    public function getFormattedTimeAttribute()
    {
        if (!$this->estimated_time_hours) {
            return 'Varies';
        }

        if ($this->estimated_time_hours == 1) {
            return '1 hour';
        }

        return "{$this->estimated_time_hours} hours";
    }
}
