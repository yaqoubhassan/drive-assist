<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class WarningLight extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'severity',
        'color',
        'icon_description',
        'emoji',
        'meaning',
        'possible_causes',
        'immediate_action',
        'long_term_solution',
        'safe_to_drive',
        'driving_restrictions',
        'estimated_repair_cost_min',
        'estimated_repair_cost_max',
        'view_count',
        'is_common',
        'is_published',
    ];

    protected $casts = [
        'safe_to_drive' => 'boolean',
        'estimated_repair_cost_min' => 'decimal:2',
        'estimated_repair_cost_max' => 'decimal:2',
        'is_common' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = ['severity_info', 'formatted_cost_range'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($light) {
            if (empty($light->slug)) {
                $light->slug = Str::slug($light->name);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeByColor($query, $color)
    {
        return $query->where('color', $color);
    }

    public function scopeCommon($query)
    {
        return $query->where('is_common', true);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
                ->orWhere('meaning', 'like', "%{$term}%");
        });
    }

    public function incrementViews()
    {
        $this->increment('view_count');
    }

    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    public function getSeverityInfoAttribute()
    {
        return match ($this->severity) {
            'info' => [
                'label' => 'Information',
                'color' => 'blue',
                'icon' => 'ℹ️',
                'bg_class' => 'from-blue-500 to-blue-600',
            ],
            'caution' => [
                'label' => 'Caution',
                'color' => 'yellow',
                'icon' => '⚠️',
                'bg_class' => 'from-yellow-500 to-yellow-600',
            ],
            'warning' => [
                'label' => 'Warning',
                'color' => 'orange',
                'icon' => '⚠️',
                'bg_class' => 'from-orange-500 to-orange-600',
            ],
            'critical' => [
                'label' => 'Critical',
                'color' => 'red',
                'icon' => '🚨',
                'bg_class' => 'from-red-500 to-red-600',
            ],
            default => [
                'label' => 'Unknown',
                'color' => 'gray',
                'icon' => '❓',
                'bg_class' => 'from-gray-500 to-gray-600',
            ],
        };
    }

    public function getFormattedCostRangeAttribute()
    {
        if (!$this->estimated_repair_cost_min && !$this->estimated_repair_cost_max) {
            return 'Varies by cause';
        }

        if ($this->estimated_repair_cost_min && $this->estimated_repair_cost_max) {
            return '$' . number_format($this->estimated_repair_cost_min, 0) . ' - $' . number_format($this->estimated_repair_cost_max, 0);
        }

        return '$' . number_format($this->estimated_repair_cost_min ?? $this->estimated_repair_cost_max, 0);
    }
}
