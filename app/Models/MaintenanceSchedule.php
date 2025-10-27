<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
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
        'view_count' => 'integer',
    ];

    protected $appends = [
        'formatted_interval',
        'formatted_cost_range',
        'priority_color',
        'helpful_count'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($schedule) {
            if (empty($schedule->slug)) {
                $schedule->slug = Str::slug($schedule->title);
            }
        });

        // Ensure tasks is never null when retrieving
        static::retrieved(function ($schedule) {
            if ($schedule->tasks === null) {
                Log::warning("MaintenanceSchedule {$schedule->id} ({$schedule->title}) has null tasks, fixing...");
                $schedule->tasks = [];
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
            Log::debug("MaintenanceSchedule tasks is null for: {$this->title}");
            return [];
        }

        // If already an array (from casting), return it
        if (is_array($value)) {
            return $value;
        }

        // If string, try to decode JSON
        if (is_string($value)) {
            $decoded = json_decode($value, true);

            // Check for JSON errors
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("JSON decode error for MaintenanceSchedule {$this->id}: " . json_last_error_msg());
                return [];
            }

            return is_array($decoded) ? $decoded : [];
        }

        // If it's an object (shouldn't happen with proper casting), convert to array
        if (is_object($value)) {
            return json_decode(json_encode($value), true) ?: [];
        }

        // Fallback to empty array
        Log::warning("Unexpected tasks type for MaintenanceSchedule {$this->id}: " . gettype($value));
        return [];
    }

    /**
     * Set tasks attribute - ensure proper JSON encoding
     */
    public function setTasksAttribute($value)
    {
        if (is_null($value)) {
            $this->attributes['tasks'] = json_encode([]);
            return;
        }

        if (is_array($value)) {
            $this->attributes['tasks'] = json_encode($value);
            return;
        }

        if (is_string($value)) {
            // Validate it's valid JSON
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->attributes['tasks'] = $value;
            } else {
                Log::error("Invalid JSON provided for tasks: {$value}");
                $this->attributes['tasks'] = json_encode([]);
            }
            return;
        }

        // Fallback
        $this->attributes['tasks'] = json_encode([]);
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

    /**
     * Get helpful count for this schedule
     */
    public function getHelpfulCountAttribute()
    {
        return $this->helpfulFeedback()->where('is_helpful', true)->count();
    }

    /**
     * Override toArray to ensure tasks is always an array in serialization
     */
    public function toArray()
    {
        $array = parent::toArray();

        // Double-check tasks is an array before sending to frontend
        if (!isset($array['tasks']) || !is_array($array['tasks'])) {
            Log::warning("Tasks is not an array in toArray() for schedule: {$this->title}");
            $array['tasks'] = [];
        }

        return $array;
    }

    /**
     * Override toJson to ensure proper serialization
     */
    public function toJson($options = 0)
    {
        $array = $this->toArray();

        // Ensure tasks is present and is an array
        if (!isset($array['tasks'])) {
            $array['tasks'] = [];
        }

        return json_encode($array, $options);
    }
}
