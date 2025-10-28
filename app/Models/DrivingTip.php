<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class DrivingTip extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'category',
        'difficulty',
        'excerpt',
        'content',
        'key_points',
        'dos',
        'donts',
        'pro_tip',
        'icon',
        'featured_image',
        'reading_time_minutes',
        'view_count',
        'helpful_count',
        'order',
        'is_featured',
        'is_popular',
        'is_published',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'key_points' => 'array',
        'dos' => 'array',
        'donts' => 'array',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'is_published' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tip) {
            if (empty($tip->slug)) {
                $tip->slug = Str::slug($tip->title);
            }
        });
    }

    /**
     * Get related tips.
     */
    public function relatedTips(): BelongsToMany
    {
        return $this->belongsToMany(
            DrivingTip::class,
            'driving_tip_relations',
            'tip_id',
            'related_tip_id'
        )->withTimestamps();
    }

    /**
     * Get users who have interacted with this tip.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_tip_progress')
            ->withPivot(['is_read', 'is_bookmarked', 'is_helpful', 'read_at'])
            ->withTimestamps();
    }

    /**
     * Scope a query to only include published tips.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to filter by difficulty.
     */
    public function scopeDifficulty($query, $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    /**
     * Scope a query to only include featured tips.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include popular tips.
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    /**
     * Scope a query to search tips.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('excerpt', 'like', "%{$search}%")
                ->orWhere('content', 'like', "%{$search}%");
        });
    }

    /**
     * Increment view count.
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Get the category label.
     */
    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'beginner' => 'Beginner Basics',
            'defensive' => 'Defensive Driving',
            'fuel_efficiency' => 'Fuel Efficiency',
            'weather' => 'Weather Driving',
            'advanced' => 'Advanced Techniques',
            'safety' => 'Safety Tips',
            'parking' => 'Parking Skills',
            'highway' => 'Highway Driving',
            default => ucfirst($this->category),
        };
    }

    /**
     * Get the difficulty label.
     */
    public function getDifficultyLabelAttribute(): string
    {
        return ucfirst($this->difficulty);
    }

    /**
     * Get the difficulty color (for badges).
     */
    public function getDifficultyColorAttribute(): string
    {
        return match ($this->difficulty) {
            'beginner' => 'green',
            'intermediate' => 'yellow',
            'advanced' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get the category color (for badges).
     */
    public function getCategoryColorAttribute(): string
    {
        return match ($this->category) {
            'beginner' => 'blue',
            'defensive' => 'purple',
            'fuel_efficiency' => 'green',
            'weather' => 'cyan',
            'advanced' => 'red',
            'safety' => 'orange',
            'parking' => 'pink',
            'highway' => 'indigo',
            default => 'gray',
        };
    }

    /**
     * Get formatted reading time.
     */
    public function getFormattedReadingTimeAttribute(): string
    {
        return $this->reading_time_minutes . ' min read';
    }

    /**
     * Get the route key name for Laravel model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
