<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class FluidGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'fluid_type',
        'description',
        'function',
        'check_procedure',
        'change_procedure',
        'check_interval_miles',
        'check_interval_months',
        'change_interval_miles',
        'change_interval_months',
        'warning_signs',
        'typical_capacity_min',
        'typical_capacity_max',
        'estimated_cost_min',
        'estimated_cost_max',
        'color_when_good',
        'color_when_bad',
        'icon',
        'view_count',
        'is_critical',
        'is_published',
    ];

    protected $casts = [
        'typical_capacity_min' => 'decimal:2',
        'typical_capacity_max' => 'decimal:2',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'is_critical' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = ['check_interval_text', 'change_interval_text', 'formatted_cost_range'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($guide) {
            if (empty($guide->slug)) {
                $guide->slug = Str::slug($guide->name);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeCritical($query)
    {
        return $query->where('is_critical', true);
    }

    public function incrementViews()
    {
        $this->increment('view_count');
    }

    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    public function getCheckIntervalTextAttribute()
    {
        $parts = [];

        if ($this->check_interval_months) {
            $parts[] = "every {$this->check_interval_months} months";
        }

        if ($this->check_interval_miles) {
            $parts[] = "every " . number_format($this->check_interval_miles) . " miles";
        }

        return !empty($parts) ? 'Check ' . implode(' or ', $parts) : 'Check regularly';
    }

    public function getChangeIntervalTextAttribute()
    {
        $parts = [];

        if ($this->change_interval_months) {
            $parts[] = "every {$this->change_interval_months} months";
        }

        if ($this->change_interval_miles) {
            $parts[] = "every " . number_format($this->change_interval_miles) . " miles";
        }

        return !empty($parts) ? 'Change ' . implode(' or ', $parts) : 'Change as needed';
    }

    public function getFormattedCostRangeAttribute()
    {
        if (!$this->estimated_cost_min && !$this->estimated_cost_max) {
            return 'DIY: Varies';
        }

        if ($this->estimated_cost_min && $this->estimated_cost_max) {
            return '$' . number_format($this->estimated_cost_min, 0) . ' - $' . number_format($this->estimated_cost_max, 0);
        }

        return '$' . number_format($this->estimated_cost_min ?? $this->estimated_cost_max, 0);
    }
}
