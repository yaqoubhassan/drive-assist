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

    // FIXED: Added all required frontend attributes to appends
    protected $appends = [
        'severity_info',
        'severity_badge',
        'color_badge',
        'formatted_cost_range',
        'icon_image',
        'can_continue_driving',
        'what_it_means',
        'what_to_do',
        'typical_causes',
        'icon' // Add icon as alias for emoji
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($light) {
            if (empty($light->slug)) {
                $light->slug = Str::slug($light->name);
            }
        });
    }

    // Scopes
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
                ->orWhere('meaning', 'like', "%{$term}%")
                ->orWhere('icon_description', 'like', "%{$term}%");
        });
    }

    // Methods
    public function incrementViews()
    {
        $this->increment('view_count');
    }

    // Relationships
    public function helpfulFeedback()
    {
        return $this->morphMany(MaintenanceHelpfulFeedback::class, 'feedbackable');
    }

    // Accessor: Severity Info
    public function getSeverityInfoAttribute()
    {
        return match ($this->severity) {
            'info' => [
                'label' => 'Information',
                'color' => 'blue',
                'icon' => 'ℹ️',
                'bg_class' => 'bg-gradient-to-br from-blue-500 to-blue-600',
                'text_class' => 'text-blue-600 dark:text-blue-400',
            ],
            'caution' => [
                'label' => 'Caution',
                'color' => 'yellow',
                'icon' => '⚠️',
                'bg_class' => 'bg-gradient-to-br from-yellow-500 to-yellow-600',
                'text_class' => 'text-yellow-600 dark:text-yellow-400',
            ],
            'warning' => [
                'label' => 'Warning',
                'color' => 'orange',
                'icon' => '🔶',
                'bg_class' => 'bg-gradient-to-br from-orange-500 to-orange-600',
                'text_class' => 'text-orange-600 dark:text-orange-400',
            ],
            'critical' => [
                'label' => 'Critical',
                'color' => 'red',
                'icon' => '🔴',
                'bg_class' => 'bg-gradient-to-br from-red-500 to-red-600',
                'text_class' => 'text-red-600 dark:text-red-400',
            ],
            default => [
                'label' => 'Unknown',
                'color' => 'gray',
                'icon' => '⚪',
                'bg_class' => 'bg-gradient-to-br from-gray-500 to-gray-600',
                'text_class' => 'text-gray-600 dark:text-gray-400',
            ],
        };
    }

    // Accessor: Severity Badge (for cards and lists)
    public function getSeverityBadgeAttribute()
    {
        return match ($this->severity) {
            'info' => [
                'label' => 'Information',
                'color' => 'text-blue-800 dark:text-blue-300',
                'bg_class' => 'bg-blue-100 dark:bg-blue-900/30',
            ],
            'caution' => [
                'label' => 'Caution',
                'color' => 'text-yellow-800 dark:text-yellow-300',
                'bg_class' => 'bg-yellow-100 dark:bg-yellow-900/30',
            ],
            'warning' => [
                'label' => 'Warning',
                'color' => 'text-orange-800 dark:text-orange-300',
                'bg_class' => 'bg-orange-100 dark:bg-orange-900/30',
            ],
            'critical' => [
                'label' => 'Critical',
                'color' => 'text-red-800 dark:text-red-300',
                'bg_class' => 'bg-red-100 dark:bg-red-900/30',
            ],
            default => [
                'label' => 'Unknown',
                'color' => 'text-gray-800 dark:text-gray-300',
                'bg_class' => 'bg-gray-100 dark:bg-gray-900/30',
            ],
        };
    }

    // Accessor: Color Badge
    public function getColorBadgeAttribute()
    {
        return match (strtolower($this->color)) {
            'red' => [
                'label' => 'Red Light',
                'color' => 'text-red-800 dark:text-red-300',
                'bg_class' => 'bg-red-100 dark:bg-red-900/30',
            ],
            'yellow' => [
                'label' => 'Yellow Light',
                'color' => 'text-yellow-800 dark:text-yellow-300',
                'bg_class' => 'bg-yellow-100 dark:bg-yellow-900/30',
            ],
            'orange' => [
                'label' => 'Orange Light',
                'color' => 'text-orange-800 dark:text-orange-300',
                'bg_class' => 'bg-orange-100 dark:bg-orange-900/30',
            ],
            'blue' => [
                'label' => 'Blue Light',
                'color' => 'text-blue-800 dark:text-blue-300',
                'bg_class' => 'bg-blue-100 dark:bg-blue-900/30',
            ],
            'green' => [
                'label' => 'Green Light',
                'color' => 'text-green-800 dark:text-green-300',
                'bg_class' => 'bg-green-100 dark:bg-green-900/30',
            ],
            'white' => [
                'label' => 'White Light',
                'color' => 'text-gray-800 dark:text-gray-300',
                'bg_class' => 'bg-gray-100 dark:bg-gray-700/30',
            ],
            'amber' => [
                'label' => 'Amber Light',
                'color' => 'text-amber-800 dark:text-amber-300',
                'bg_class' => 'bg-amber-100 dark:bg-amber-900/30',
            ],
            default => [
                'label' => ucfirst($this->color) . ' Light',
                'color' => 'text-gray-800 dark:text-gray-300',
                'bg_class' => 'bg-gray-100 dark:bg-gray-900/30',
            ],
        };
    }

    // Accessor: Formatted Cost Range
    public function getFormattedCostRangeAttribute()
    {
        if ($this->estimated_repair_cost_min && $this->estimated_repair_cost_max) {
            return '$' . number_format($this->estimated_repair_cost_min, 0) . ' - $' . number_format($this->estimated_repair_cost_max, 0);
        }

        if ($this->estimated_repair_cost_min) {
            return 'From $' . number_format($this->estimated_repair_cost_min, 0);
        }

        if ($this->estimated_repair_cost_max) {
            return 'Up to $' . number_format($this->estimated_repair_cost_max, 0);
        }

        return 'Varies';
    }

    // Accessor: Icon Image (optional - for future use)
    public function getIconImageAttribute()
    {
        // Return null for now - can be implemented later with actual icon images
        // If you have icon images stored, return the path here
        return null;
    }

    // Accessor: Can Continue Driving (alias for safe_to_drive)
    public function getCanContinueDrivingAttribute()
    {
        return $this->safe_to_drive;
    }

    // Accessor: What It Means (alias for meaning)
    public function getWhatItMeansAttribute()
    {
        return $this->meaning;
    }

    // Accessor: What To Do (alias for immediate_action)
    public function getWhatToDoAttribute()
    {
        return $this->immediate_action;
    }

    // Accessor: Typical Causes (parse from possible_causes text)
    public function getTypicalCausesAttribute()
    {
        if (empty($this->possible_causes)) {
            return [];
        }

        // If already an array (should not happen due to cast), return it
        if (is_array($this->possible_causes)) {
            return $this->possible_causes;
        }

        // Split by newlines or numbered list items
        $causes = preg_split('/\n|(?=\d+\.)/u', $this->possible_causes, -1, PREG_SPLIT_NO_EMPTY);

        // Clean up and filter
        return array_values(array_filter(array_map(function ($cause) {
            // Remove leading numbers, dashes, asterisks
            $cleaned = preg_replace('/^[\d\.\-\*\s]+/', '', trim($cause));
            return $cleaned;
        }, $causes)));
    }

    // Accessor: Icon (alias for emoji)
    public function getIconAttribute()
    {
        return $this->emoji;
    }
}
