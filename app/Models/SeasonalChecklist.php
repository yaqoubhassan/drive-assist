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
        'helpful_count',
        'is_published',
    ];

    protected $casts = [
        'checklist_items' => 'array', // Laravel will automatically handle JSON encoding/decoding
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'estimated_time_hours' => 'decimal:1',
        'view_count' => 'integer',
        'helpful_count' => 'integer',
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

    /**
     * REMOVED THE CUSTOM ACCESSOR - Laravel's array cast handles everything!
     * 
     * The issue was that having both a cast AND a custom accessor caused conflicts.
     * Laravel's 'array' cast automatically:
     * 1. Decodes JSON from the database into PHP arrays
     * 2. Encodes PHP arrays back to JSON when saving
     * 3. Returns empty array if null
     * 
     * No custom accessor needed!
     */

    /**
     * Query scope for published checklists
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Query scope to filter by season
     */
    public function scopeBySeason($query, $season)
    {
        return $query->where('season', $season);
    }

    /**
     * Increment view count
     */
    public function incrementViews()
    {
        $this->increment('view_count');
    }

    /**
     * Increment helpful count
     */
    public function incrementHelpful()
    {
        $this->increment('helpful_count');
    }

    /**
     * Relationship: Helpful feedback
     */
    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    /**
     * Accessor: Season info with emoji and colors
     */
    public function getSeasonInfoAttribute()
    {
        return match ($this->season) {
            'spring' => [
                'emoji' => '🌸',
                'color' => 'green',
                'bg_class' => 'bg-gradient-to-r from-green-500 to-green-600',
            ],
            'summer' => [
                'emoji' => '☀️',
                'color' => 'yellow',
                'bg_class' => 'bg-gradient-to-r from-yellow-500 to-yellow-600',
            ],
            'fall' => [
                'emoji' => '🍂',
                'color' => 'orange',
                'bg_class' => 'bg-gradient-to-r from-orange-500 to-orange-600',
            ],
            'winter' => [
                'emoji' => '❄️',
                'color' => 'blue',
                'bg_class' => 'bg-gradient-to-r from-blue-500 to-blue-600',
            ],
            default => [
                'emoji' => '📅',
                'color' => 'gray',
                'bg_class' => 'bg-gradient-to-r from-gray-500 to-gray-600',
            ],
        };
    }

    /**
     * Accessor: Formatted cost range
     */
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

    /**
     * Accessor: Formatted time
     */
    public function getFormattedTimeAttribute()
    {
        if (!$this->estimated_time_hours) {
            return 'Time varies';
        }

        $hours = $this->estimated_time_hours;

        if ($hours < 1) {
            return round($hours * 60) . ' minutes';
        } elseif ($hours == 1) {
            return '1 hour';
        } elseif ($hours < 24) {
            return number_format($hours, 1) . ' hours';
        } else {
            $days = round($hours / 24, 1);
            return $days == 1 ? '1 day' : "$days days";
        }
    }
}
