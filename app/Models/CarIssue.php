<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class CarIssue extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'severity',
        'symptoms',
        'description',
        'possible_causes',
        'diy_solution',
        'when_to_call_expert',
        'estimated_cost_min',
        'estimated_cost_max',
        'featured_image',
        'view_count',
        'helpful_count',
        'is_popular',
        'is_published',
    ];

    protected $casts = [
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'view_count' => 'integer',
        'helpful_count' => 'integer',
        'is_popular' => 'boolean',
        'is_published' => 'boolean',
    ];

    /**
     * CRITICAL FIX: Append accessor attributes to JSON serialization
     * This ensures cost_range, severity_color, and category_icon are included
     * when the model is converted to an array or JSON
     */
    protected $appends = [
        'cost_range',
        'severity_color',
        'category_icon',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($issue) {
            if (empty($issue->slug)) {
                $issue->slug = Str::slug($issue->title);
            }
        });
    }

    /**
     * Get related issues
     */
    public function relatedIssues(): BelongsToMany
    {
        return $this->belongsToMany(
            CarIssue::class,
            'car_issue_relations',
            'issue_id',
            'related_issue_id'
        );
    }

    /**
     * Scope to get published issues only
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope to get popular issues
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true)
            ->orWhere('view_count', '>', 100)
            ->orderByDesc('view_count');
    }

    /**
     * Scope to filter by category
     */
    public function scopeCategory($query, $category)
    {
        if ($category && $category !== 'all') {
            return $query->where('category', $category);
        }
        return $query;
    }

    /**
     * Scope to search by term
     */
    public function scopeSearch($query, $term)
    {
        if ($term) {
            return $query->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('symptoms', 'like', "%{$term}%")
                    ->orWhere('possible_causes', 'like', "%{$term}%");
            });
        }
        return $query;
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('view_count');
    }

    /**
     * Increment helpful count
     */
    public function incrementHelpful(): void
    {
        $this->increment('helpful_count');
    }

    /**
     * Get severity badge color
     * ACCESSOR: Automatically available as $issue->severity_color
     */
    public function getSeverityColorAttribute(): string
    {
        return match ($this->severity) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'orange',
            'critical' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get category icon
     * ACCESSOR: Automatically available as $issue->category_icon
     */
    public function getCategoryIconAttribute(): string
    {
        return match ($this->category) {
            'engine' => 'Wrench',
            'brakes' => 'AlertCircle',
            'electrical' => 'Zap',
            'transmission' => 'Cog',
            'tires' => 'Disc',
            'suspension' => 'Move',
            'cooling' => 'Droplets',
            'fuel' => 'Fuel',
            'exhaust' => 'Wind',
            'steering' => 'Steering',
            default => 'HelpCircle',
        };
    }

    /**
     * Format cost range
     * ACCESSOR: Automatically available as $issue->cost_range
     * This will now be included in JSON responses thanks to $appends
     */
    public function getCostRangeAttribute(): string
    {
        if ($this->estimated_cost_min && $this->estimated_cost_max) {
            return '$' . number_format($this->estimated_cost_min, 0) . ' - $' . number_format($this->estimated_cost_max, 0);
        }
        return 'Varies';
    }
}
