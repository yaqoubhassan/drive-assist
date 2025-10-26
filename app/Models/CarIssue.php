<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'diy_solutions',
        'when_to_call_expert',
        'estimated_cost_min',
        'estimated_cost_max',
        'estimated_time',
        'featured_image',
        'view_count',
        'helpful_count',
        'not_helpful_count',
        'is_popular',
        'is_published',
        'content',
    ];

    protected $casts = [
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'is_popular' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected $appends = [
        'cost_range',
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
     * Scope for published issues
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Get related issues
     */
    public function relatedIssues()
    {
        return $this->belongsToMany(
            CarIssue::class,
            'car_issue_relations',
            'issue_id',
            'related_issue_id'
        );
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
     * Increment not helpful count
     */
    public function incrementNotHelpful()
    {
        $this->increment('not_helpful_count');
    }

    /**
     * Get cost range as formatted string
     */
    public function getCostRangeAttribute(): string
    {
        if ($this->estimated_cost_min && $this->estimated_cost_max) {
            return '$' . number_format($this->estimated_cost_min, 0) . ' - $' . number_format($this->estimated_cost_max, 0);
        }

        return 'Varies';
    }

    /**
     * Get route key name for route model binding
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
