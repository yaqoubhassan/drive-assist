<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExpertProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'bio',
        'profile_completed',
        'years_experience',
        'employee_count',
        'business_license_number',
        'insurance_policy_number',
        'service_radius_km',
        'hourly_rate_min',
        'hourly_rate_max',
        'diagnostic_fee',
        'accepts_emergency',
        'monday_open',
        'monday_close',
        'tuesday_open',
        'tuesday_close',
        'wednesday_open',
        'wednesday_close',
        'thursday_open',
        'thursday_close',
        'friday_open',
        'friday_close',
        'saturday_open',
        'saturday_close',
        'sunday_open',
        'sunday_close',
        'verification_status',
        'verified_at',
        'is_featured',
        'profile_views',
        'total_jobs',
        'avg_rating',
        'current_onboarding_step'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hourly_rate_min' => 'decimal:2',
        'hourly_rate_max' => 'decimal:2',
        'diagnostic_fee' => 'decimal:2',
        'accepts_emergency' => 'boolean',
        'monday_open' => 'datetime:H:i',
        'monday_close' => 'datetime:H:i',
        'tuesday_open' => 'datetime:H:i',
        'tuesday_close' => 'datetime:H:i',
        'wednesday_open' => 'datetime:H:i',
        'wednesday_close' => 'datetime:H:i',
        'thursday_open' => 'datetime:H:i',
        'thursday_close' => 'datetime:H:i',
        'friday_open' => 'datetime:H:i',
        'friday_close' => 'datetime:H:i',
        'saturday_open' => 'datetime:H:i',
        'saturday_close' => 'datetime:H:i',
        'sunday_open' => 'datetime:H:i',
        'sunday_close' => 'datetime:H:i',
        'verified_at' => 'datetime',
        'is_featured' => 'boolean',
        'avg_rating' => 'decimal:2',
        'profile_completed' => 'boolean',
    ];

    /**
     * Get the user that owns the expert profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the specialties for the expert profile.
     */
    public function specialties(): HasMany
    {
        return $this->hasMany(ExpertSpecialty::class);
    }

    /**
     * Get the leads for the expert profile.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(ExpertLead::class);
    }

    /**
     * Get the jobs for the expert profile.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }

    /**
     * Get the reviews for the expert profile.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Scope a query to only include verified experts.
     */
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'approved');
    }

    /**
     * Scope to get only completed profiles
     */
    public function scopeCompleted($query)
    {
        return $query->where('profile_completed', true);
    }

    /**
     * Scope to get profiles pending verification
     */
    public function scopePendingVerification($query)
    {
        return $query->where('verification_status', 'pending');
    }

    /**
     * Scope a query to only include featured experts.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Check if the expert is currently open.
     */
    public function isOpen(): bool
    {
        $now = now();
        $dayOfWeek = strtolower($now->format('l'));

        $openTime = $this->{$dayOfWeek . '_open'};
        $closeTime = $this->{$dayOfWeek . '_close'};

        if (!$openTime || !$closeTime) {
            return false;
        }

        $currentTime = $now->format('H:i:s');

        return $currentTime >= $openTime->format('H:i:s') && $currentTime <= $closeTime->format('H:i:s');
    }

    /**
     * Get formatted hours for a specific day.
     */
    public function getHoursForDay(string $day): ?array
    {
        $openKey = strtolower($day) . '_open';
        $closeKey = strtolower($day) . '_close';

        if (!$this->$openKey || !$this->$closeKey) {
            return null;
        }

        return [
            'open' => $this->$openKey->format('H:i'),
            'close' => $this->$closeKey->format('H:i'),
        ];
    }

    /**
     * Get all hours formatted as an array.
     */
    public function getAllHours(): array
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $hours = [];

        foreach ($days as $day) {
            $hours[$day] = $this->getHoursForDay($day);
        }

        return $hours;
    }

    /**
     * Check if expert is available for emergency services.
     */
    public function acceptsEmergency(): bool
    {
        return $this->accepts_emergency;
    }

    /**
     * Get the pricing tier based on hourly rate.
     */
    public function getPricingTier(): string
    {
        $avgRate = ($this->hourly_rate_min + $this->hourly_rate_max) / 2;

        if ($avgRate < 50) {
            return 'budget';
        } elseif ($avgRate < 100) {
            return 'moderate';
        } else {
            return 'premium';
        }
    }

    /**
     * Calculate distance from given coordinates.
     * 
     * @param float $latitude
     * @param float $longitude
     * @return float Distance in kilometers
     */
    public function distanceFrom(float $latitude, float $longitude): float
    {
        if (!$this->user->location_latitude || !$this->user->location_longitude) {
            return 0;
        }

        $earthRadius = 6371; // Radius in kilometers

        $latFrom = deg2rad($this->user->location_latitude);
        $lonFrom = deg2rad($this->user->location_longitude);
        $latTo = deg2rad($latitude);
        $lonTo = deg2rad($longitude);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }

    /**
     * Increment profile views counter.
     */
    public function incrementViews(): void
    {
        $this->increment('profile_views');
    }

    /**
     * Update average rating.
     */
    public function updateAverageRating(): void
    {
        $avgRating = $this->reviews()->avg('overall_rating');
        $this->update(['avg_rating' => round($avgRating, 2)]);
    }

    /**
     * Update total jobs count.
     */
    public function updateTotalJobs(): void
    {
        $totalJobs = $this->jobs()->where('job_status', 'completed')->count();
        $this->update(['total_jobs' => $totalJobs]);
    }
}
