<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExpertProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_type',
        'bio',
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
        'profile_completed',
    ];

    protected $casts = [
        'accepts_emergency' => 'boolean',
        'is_featured' => 'boolean',
        'verified_at' => 'datetime',
        'profile_views' => 'integer',
        'total_jobs' => 'integer',
        'avg_rating' => 'decimal:2',
        'hourly_rate_min' => 'decimal:2',
        'hourly_rate_max' => 'decimal:2',
        'diagnostic_fee' => 'decimal:2',
        'service_radius_km' => 'integer',
        'years_experience' => 'integer',
        'employee_count' => 'integer',
        'profile_completed' => 'boolean',
    ];

    protected $appends = [
        'is_verified',
        'is_pending_verification',
        'verification_status_badge',
        'has_completed_kyc',
        'kyc_completion_percentage',
    ];

    /**
     * Check if the expert is currently open based on operating hours
     */
    public function isOpen(): bool
    {
        $now = now();
        $dayOfWeek = strtolower($now->format('l')); // monday, tuesday, etc.
        $currentTime = $now->format('H:i:s');

        $openField = "{$dayOfWeek}_open";
        $closeField = "{$dayOfWeek}_close";

        // If no hours set for today, consider closed
        if (empty($this->{$openField}) || empty($this->{$closeField})) {
            return false;
        }

        // Check if current time is within operating hours
        return $currentTime >= $this->{$openField} && $currentTime <= $this->{$closeField};
    }

    /**
     * Get the pricing tier based on hourly rates
     */
    public function getPricingTier(): string
    {
        // If no rates set, default to moderate
        if (empty($this->hourly_rate_min) && empty($this->hourly_rate_max)) {
            return 'moderate';
        }

        // Calculate average rate
        $avgRate = ($this->hourly_rate_min + $this->hourly_rate_max) / 2;

        // Pricing tiers based on average hourly rate
        if ($avgRate < 75) {
            return 'budget';
        } elseif ($avgRate < 125) {
            return 'moderate';
        } else {
            return 'premium';
        }
    }

    /**
     * Get the user that owns the expert profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the KYC record for this expert
     */
    public function kyc(): HasOne
    {
        return $this->hasOne(ExpertKyc::class, 'expert_profile_id');
    }

    /**
     * Get the specialties for this expert
     */
    public function specialties(): HasMany
    {
        return $this->hasMany(ExpertSpecialty::class, 'expert_profile_id');
    }

    /**
     * Get the leads assigned to this expert
     */
    public function leads(): HasMany
    {
        return $this->hasMany(ExpertLead::class, 'expert_profile_id');
    }

    /**
     * Get the jobs assigned to this expert
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'expert_profile_id');
    }

    /**
     * Get the reviews for this expert
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'expert_profile_id');
    }

    /**
     * Get users who have favorited this expert
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites', 'expert_profile_id', 'driver_id')
            ->withTimestamps();
    }

    /**
     * Check if profile is verified
     */
    public function getIsVerifiedAttribute(): bool
    {
        return $this->verification_status === 'approved';
    }

    /**
     * Check if profile is pending verification
     */
    public function getIsPendingVerificationAttribute(): bool
    {
        return $this->verification_status === 'pending';
    }

    /**
     * Get verification status badge color
     */
    public function getVerificationStatusBadgeAttribute(): string
    {
        return match ($this->verification_status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    /**
     * Check if expert has completed KYC
     */
    public function getHasCompletedKycAttribute(): bool
    {
        return $this->kyc && $this->kyc->isApproved();
    }

    /**
     * Get KYC completion percentage
     */
    public function getKycCompletionPercentageAttribute(): int
    {
        if (!$this->kyc) {
            return 0;
        }

        return $this->kyc->completion_percentage;
    }

    /**
     * Increment profile views
     */
    public function incrementViews(): void
    {
        $this->increment('profile_views');
    }

    /**
     * Update average rating
     */
    public function updateAverageRating(): void
    {
        $avgRating = $this->reviews()->avg('overall_rating');
        $this->update([
            'avg_rating' => $avgRating ? round($avgRating, 2) : 0,
        ]);
    }

    /**
     * Update total jobs count
     */
    public function updateTotalJobs(): void
    {
        $totalJobs = $this->jobs()->where('job_status', 'completed')->count();
        $this->update([
            'total_jobs' => $totalJobs,
        ]);
    }

    /**
     * Check if expert is available at a given time
     */
    public function isAvailableAt(\DateTime $dateTime): bool
    {
        $dayOfWeek = strtolower($dateTime->format('l'));
        $time = $dateTime->format('H:i:s');

        $openField = "{$dayOfWeek}_open";
        $closeField = "{$dayOfWeek}_close";

        if (!$this->$openField || !$this->$closeField) {
            return false;
        }

        return $time >= $this->$openField && $time <= $this->$closeField;
    }

    /**
     * Check if expert operates on a specific day
     */
    public function operatesOn(string $day): bool
    {
        $day = strtolower($day);
        $openField = "{$day}_open";
        $closeField = "{$day}_close";

        return !empty($this->$openField) && !empty($this->$closeField);
    }

    /**
     * Get operating hours for a specific day
     */
    public function getHoursFor(string $day): ?array
    {
        $day = strtolower($day);
        $openField = "{$day}_open";
        $closeField = "{$day}_close";

        if (!$this->$openField || !$this->$closeField) {
            return null;
        }

        return [
            'open' => $this->$openField,
            'close' => $this->$closeField,
        ];
    }

    /**
     * Get all operating hours
     */
    public function getAllOperatingHours(): array
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $hours = [];

        foreach ($days as $day) {
            $hours[$day] = $this->getHoursFor($day);
        }

        return $hours;
    }

    /**
     * Check if profile is complete
     */
    public function isProfileComplete(): bool
    {
        // Basic information
        $basicComplete = !empty($this->business_name)
            && !empty($this->business_type)
            && !empty($this->bio);

        // Location information (assuming user has lat/lng)
        $locationComplete = $this->user->location_latitude && $this->user->location_longitude;

        // At least one specialty
        $hasSpecialties = $this->specialties()->count() > 0;

        // Operating hours (at least one day)
        $hasOperatingHours = $this->operatesOn('monday')
            || $this->operatesOn('tuesday')
            || $this->operatesOn('wednesday')
            || $this->operatesOn('thursday')
            || $this->operatesOn('friday')
            || $this->operatesOn('saturday')
            || $this->operatesOn('sunday');

        return $basicComplete && $locationComplete && $hasSpecialties && $hasOperatingHours;
    }

    /**
     * Mark profile as completed
     */
    public function markAsCompleted(): void
    {
        if (!$this->profile_completed && $this->isProfileComplete()) {
            $this->update(['profile_completed' => true]);
        }
    }

    /**
     * Scope: Verified experts only
     */
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'approved');
    }

    /**
     * Scope: Featured experts
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope: Experts with KYC approved
     */
    public function scopeWithApprovedKyc($query)
    {
        return $query->whereHas('kyc', function ($q) {
            $q->where('kyc_status', 'approved');
        });
    }

    /**
     * Scope: Experts within radius of location
     */
    public function scopeNearby($query, float $latitude, float $longitude, int $radiusKm = 25)
    {
        return $query->join('users', 'expert_profiles.user_id', '=', 'users.id')
            ->select('expert_profiles.*')
            ->selectRaw("
                ( 6371 * acos( cos( radians(?) ) *
                cos( radians( users.location_latitude ) )
                * cos( radians( users.location_longitude ) - radians(?) )
                + sin( radians(?) ) *
                sin( radians( users.location_latitude ) ) ) )
                AS distance
            ", [$latitude, $longitude, $latitude])
            ->having('distance', '<=', $radiusKm)
            ->orderBy('distance');
    }

    /**
     * Scope: Experts with specific specialty
     */
    public function scopeWithSpecialty($query, string $specialty)
    {
        return $query->whereHas('specialties', function ($q) use ($specialty) {
            $q->where('specialty', $specialty);
        });
    }

    /**
     * Scope: Experts with minimum rating
     */
    public function scopeWithMinRating($query, float $minRating)
    {
        return $query->where('avg_rating', '>=', $minRating);
    }

    /**
     * Scope: Experts currently open
     */
    public function scopeOpenNow($query)
    {
        $now = now();
        $dayOfWeek = strtolower($now->format('l'));
        $currentTime = $now->format('H:i:s');

        return $query->whereNotNull("{$dayOfWeek}_open")
            ->whereNotNull("{$dayOfWeek}_close")
            ->whereTime("{$dayOfWeek}_open", '<=', $currentTime)
            ->whereTime("{$dayOfWeek}_close", '>=', $currentTime);
    }

    /**
     * Get formatted business hours for display
     */
    public function getFormattedBusinessHours(): array
    {
        $days = [
            'monday' => 'Monday',
            'tuesday' => 'Tuesday',
            'wednesday' => 'Wednesday',
            'thursday' => 'Thursday',
            'friday' => 'Friday',
            'saturday' => 'Saturday',
            'sunday' => 'Sunday',
        ];

        $formattedHours = [];

        foreach ($days as $key => $label) {
            $open = $this->{"{$key}_open"};
            $close = $this->{"{$key}_close"};

            if ($open && $close) {
                $formattedHours[$label] = [
                    'open' => date('g:i A', strtotime($open)),
                    'close' => date('g:i A', strtotime($close)),
                    'formatted' => date('g:i A', strtotime($open)) . ' - ' . date('g:i A', strtotime($close)),
                ];
            } else {
                $formattedHours[$label] = [
                    'open' => null,
                    'close' => null,
                    'formatted' => 'Closed',
                ];
            }
        }

        return $formattedHours;
    }

    /**
     * Check if currently within operating hours
     */
    public function isCurrentlyOpen(): bool
    {
        return $this->isAvailableAt(new \DateTime());
    }

    /**
     * Get next opening time
     */
    public function getNextOpeningTime(): ?string
    {
        $now = now();
        $daysToCheck = 7;

        for ($i = 0; $i < $daysToCheck; $i++) {
            $checkDate = $now->copy()->addDays($i);
            $dayOfWeek = strtolower($checkDate->format('l'));
            $openField = "{$dayOfWeek}_open";

            if ($this->$openField) {
                $openTime = $checkDate->setTimeFromTimeString($this->$openField);

                if ($openTime->isFuture()) {
                    return $openTime->diffForHumans();
                }
            }
        }

        return null;
    }
}
