<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertLead extends Model
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
        'diagnosis_id',
        'driver_name',
        'driver_email',
        'driver_phone',
        'message',
        'preferred_contact_method',
        'best_time_to_contact',
        'status',
        'expert_response',
        'expert_responded_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expert_responded_at' => 'datetime',
    ];

    /**
     * Lead status options.
     */
    public const STATUS_NEW = 'new';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Get the expert profile that owns the lead.
     */
    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    /**
     * Get the driver that created the lead.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the diagnosis associated with the lead.
     */
    public function diagnosis(): BelongsTo
    {
        return $this->belongsTo(Diagnosis::class);
    }

    /**
     * Scope a query to only include new leads.
     */
    public function scopeNew($query)
    {
        return $query->where('status', self::STATUS_NEW);
    }

    /**
     * Scope a query to only include active leads.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', [self::STATUS_NEW, self::STATUS_CONTACTED, self::STATUS_IN_PROGRESS]);
    }

    /**
     * Mark lead as contacted.
     */
    public function markAsContacted(string $response): void
    {
        $this->update([
            'status' => self::STATUS_CONTACTED,
            'expert_response' => $response,
            'expert_responded_at' => now(),
        ]);
    }

    /**
     * Check if lead is new.
     */
    public function isNew(): bool
    {
        return $this->status === self::STATUS_NEW;
    }

    /**
     * Check if expert has responded.
     */
    public function hasResponse(): bool
    {
        return !is_null($this->expert_responded_at);
    }
}
