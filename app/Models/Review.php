<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'expert_profile_id',
        'driver_id',
        'job_id',
        'overall_rating',
        'quality_rating',
        'professionalism_rating',
        'pricing_rating',
        'communication_rating',
        'review_text',
        'expert_response',
        'expert_responded_at',
        'is_verified_purchase',
        'helpful_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_verified_purchase' => 'boolean',
        'expert_responded_at' => 'datetime',
    ];

    /**
     * Get the expert profile that owns the review.
     */
    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    /**
     * Get the driver that created the review.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the job associated with the review.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the images for the review.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ReviewImage::class);
    }

    /**
     * Check if expert has responded
     */
    public function hasResponse()
    {
        return !is_null($this->expert_response);
    }

    /**
     * Get average rating
     */
    public function getAverageRatingAttribute()
    {
        $ratings = array_filter([
            $this->quality_rating,
            $this->professionalism_rating,
            $this->pricing_rating,
            $this->communication_rating,
        ]);

        return count($ratings) > 0 ? round(array_sum($ratings) / count($ratings), 1) : $this->overall_rating;
    }

    /**
     * Scope for reviews with responses
     */
    public function scopeWithResponse($query)
    {
        return $query->whereNotNull('expert_response');
    }

    /**
     * Scope for high-rated reviews
     */
    public function scopeHighRated($query, $minRating = 4)
    {
        return $query->where('overall_rating', '>=', $minRating);
    }

    /**
     * Scope a query to only include verified purchase reviews.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    /**
     * Scope a query to order by most helpful.
     */
    public function scopeMostHelpful($query)
    {
        return $query->orderBy('helpful_count', 'desc');
    }

    /**
     * Scope a query to order by highest rating.
     */
    public function scopeHighestRated($query)
    {
        return $query->orderBy('overall_rating', 'desc');
    }

    /**
     * Check if review has expert response.
     */
    public function hasExpertResponse(): bool
    {
        return !is_null($this->expert_response);
    }

    /**
     * Get average of all aspect ratings.
     */
    public function getAverageAspectRating(): float
    {
        $ratings = array_filter([
            $this->quality_rating,
            $this->professionalism_rating,
            $this->pricing_rating,
            $this->communication_rating,
        ]);

        if (empty($ratings)) {
            return $this->overall_rating;
        }

        return round(array_sum($ratings) / count($ratings), 1);
    }

    /**
     * Increment helpful count.
     */
    public function incrementHelpful(): void
    {
        $this->increment('helpful_count');
    }
}
