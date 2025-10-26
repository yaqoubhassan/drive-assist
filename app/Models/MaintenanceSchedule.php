<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class MaintenanceSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'interval',
        'mileage_interval',
        'description',
        'tasks',
        'priority',
        'season',
        'estimated_cost_min',
        'estimated_cost_max',
        'diy_possible',
        'view_count',
        'is_published',
    ];

    protected $casts = [
        'tasks' => 'array',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'diy_possible' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = ['formatted_interval', 'formatted_cost_range', 'priority_color'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($schedule) {
            if (empty($schedule->slug)) {
                $schedule->slug = Str::slug($schedule->title);
            }
        });
    }

    /**
     * Ensure tasks is always an array
     * This accessor ensures that even if the database returns a string,
     * it will be properly converted to an array
     */
    public function getTasksAttribute($value)
    {
        // If null, return empty array
        if (is_null($value)) {
            return [];
        }

        // If already an array (from casting), return it
        if (is_array($value)) {
            return $value;
        }

        // If string, try to decode JSON
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }

        // Fallback to empty array
        return [];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope to filter by interval
     * NOTE: Do NOT add manual backticks here - Laravel's query builder handles reserved keywords automatically
     */
    public function scopeByInterval($query, $interval)
    {
        // Let Laravel handle the escaping of the reserved keyword 'interval'
        return $query->where('interval', $interval);
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

    public function getFormattedIntervalAttribute()
    {
        $labels = [
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'quarterly' => 'Every 3 Months',
            'semi_annually' => 'Every 6 Months',
            'annually' => 'Yearly',
        ];

        $interval = $labels[$this->interval] ?? $this->interval;

        if ($this->mileage_interval) {
            return "{$interval} or every " . number_format($this->mileage_interval) . " miles";
        }

        return $interval;
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

    public function getPriorityColorAttribute()
    {
        return match ($this->priority) {
            'low' => 'blue',
            'medium' => 'yellow',
            'high' => 'orange',
            'critical' => 'red',
            default => 'gray',
        };
    }
}
