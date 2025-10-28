<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ElectricVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'description',
        'content',
        'key_takeaways',
        'pros',
        'cons',
        'estimated_cost_min',
        'estimated_cost_max',
        'featured_image',
        'video_url',
        'reading_time_minutes',
        'view_count',
        'helpful_count',
        'not_helpful_count',
        'is_featured',
        'is_popular',
        'is_published',
        'order',
        'icon',
    ];

    protected $casts = [
        'key_takeaways' => 'array',
        'pros' => 'array',
        'cons' => 'array',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
        'is_featured' => 'boolean',
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

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    /**
     * Get related articles
     */
    public function relatedArticles()
    {
        return $this->belongsToMany(
            ElectricVehicle::class,
            'electric_vehicle_relations',
            'ev_article_id',
            'related_article_id'
        )->where('is_published', true);
    }

    /**
     * Helpful feedback relationship
     */
    public function helpfulFeedback()
    {
        return $this->hasMany(ElectricVehicleHelpfulFeedback::class);
    }

    /**
     * Scope for published articles
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope for featured articles
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for popular articles
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    /**
     * Scope for category filter
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for search
     */
    public function scopeSearch($query, ?string $search)
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('title', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('content', 'LIKE', "%{$search}%");
        });
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

    /**
     * Get category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'buying_guide' => 'Buying Guide',
            'charging' => 'Charging',
            'battery_maintenance' => 'Battery Maintenance',
            'cost_comparison' => 'Cost Comparison',
            'tax_incentives' => 'Tax Incentives',
            'model_reviews' => 'Model Reviews',
            'technology' => 'Technology',
            'environmental' => 'Environmental',
            'infrastructure' => 'Infrastructure',
            default => 'General',
        };
    }
}
