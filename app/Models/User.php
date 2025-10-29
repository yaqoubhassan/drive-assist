<?php

namespace App\Models;

use App\Notifications\VerifyEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'user_type',
        'avatar_url',
        'location_latitude',
        'location_longitude',
        'location_address',
        'is_active',
        'last_login_at',
    ];

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'location_latitude' => 'decimal:8',
            'location_longitude' => 'decimal:8',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    // ==================== RELATIONSHIPS ====================

    /**
     * Get all vehicles owned by this user (driver)
     */
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    /**
     * Get all diagnoses for this user (driver)
     */
    public function diagnoses()
    {
        return $this->hasMany(Diagnosis::class);
    }

    /**
     * Get the expert profile for this user (expert)
     */
    public function expertProfile()
    {
        return $this->hasOne(ExpertProfile::class);
    }

    /**
     * Get all expert leads sent by this user (driver)
     */
    public function sentLeads()
    {
        return $this->hasMany(ExpertLead::class, 'driver_id');
    }

    /**
     * Get all jobs for this user (driver)
     */
    public function jobs()
    {
        return $this->hasMany(Job::class, 'driver_id');
    }

    /**
     * Get all reviews written by this user (driver)
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'driver_id');
    }

    /**
     * Get all articles authored by this user
     */
    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    /**
     * Get all notifications for this user
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get all unread notifications for this user
     */
    public function unreadNotifications()
    {
        return $this->notifications()->where('is_read', false);
    }

    /**
     * Get all experts favorited by this user (driver)
     */
    public function favoriteExperts()
    {
        return $this->belongsToMany(ExpertProfile::class, 'favorites', 'driver_id', 'expert_profile_id')
            ->withTimestamps();
    }

    /**
     * Get all road sign quiz attempts by this user
     */
    public function quizAttempts()
    {
        return $this->hasMany(UserQuizAttempt::class);
    }

    // ==================== SCOPES ====================

    /**
     * Scope to get only drivers
     */
    public function scopeDrivers($query)
    {
        return $query->where('user_type', 'driver');
    }

    /**
     * Scope to get only experts
     */
    public function scopeExperts($query)
    {
        return $query->where('user_type', 'expert');
    }

    /**
     * Scope to get only admins
     */
    public function scopeAdmins($query)
    {
        return $query->where('user_type', 'admin');
    }

    /**
     * Scope to get only active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Check if user is a driver
     */
    public function isDriver(): bool
    {
        return $this->user_type === 'driver';
    }

    /**
     * Check if user is an expert
     */
    public function isExpert(): bool
    {
        return $this->user_type === 'expert';
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->user_type === 'admin';
    }

    /**
     * Check if user has a verified expert profile
     */
    public function isVerifiedExpert(): bool
    {
        return $this->isExpert() &&
            $this->expertProfile &&
            $this->expertProfile->isVerified();
    }

    /**
     * Get user's full location string
     */
    public function getFullLocationAttribute(): ?string
    {
        return $this->location_address;
    }

    /**
     * Check if user has location data
     */
    public function hasLocation(): bool
    {
        return !is_null($this->location_latitude) && !is_null($this->location_longitude);
    }

    /**
     * Update last login timestamp
     */
    public function updateLastLogin(): void
    {
        $this->last_login_at = now();
        $this->save();
    }

    /**
     * Get unread notification count
     */
    public function getUnreadNotificationCountAttribute(): int
    {
        return $this->unreadNotifications()->count();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead(): void
    {
        $this->notifications()->where('is_read', false)->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Check if user has favorited an expert
     */
    public function hasFavorited(ExpertProfile $expert): bool
    {
        return $this->favoriteExperts()->where('expert_profile_id', $expert->id)->exists();
    }

    /**
     * Add expert to favorites
     */
    public function addToFavorites(ExpertProfile $expert): void
    {
        if (!$this->hasFavorited($expert)) {
            $this->favoriteExperts()->attach($expert->id);
        }
    }

    /**
     * Remove expert from favorites
     */
    public function removeFromFavorites(ExpertProfile $expert): void
    {
        $this->favoriteExperts()->detach($expert->id);
    }

    /**
     * Get initials for avatar
     */
    public function getInitialsAttribute(): string
    {
        $names = explode(' ', $this->name);
        $initials = '';

        foreach ($names as $name) {
            $initials .= strtoupper(substr($name, 0, 1));
        }

        return substr($initials, 0, 2);
    }
}
