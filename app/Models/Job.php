<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Job extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'lead_id',
        'expert_profile_id',
        'driver_id',
        'vehicle_id',
        'service_type',
        'description',
        'scheduled_date',
        'scheduled_time',
        'actual_start_time',
        'actual_end_time',
        'parts_cost',
        'labor_cost',
        'total_cost',
        'payment_status',
        'job_status',
        'completion_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'date',
        'scheduled_time' => 'datetime:H:i',
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
        'parts_cost' => 'decimal:2',
        'labor_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    /**
     * Job status options.
     */
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * Payment status options.
     */
    public const PAYMENT_PENDING = 'pending';
    public const PAYMENT_PAID = 'paid';
    public const PAYMENT_REFUNDED = 'refunded';

    /**
     * Get the lead that created the job.
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(ExpertLead::class, 'lead_id');
    }

    /**
     * Get the expert profile for the job.
     */
    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    /**
     * Get the driver for the job.
     */
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the vehicle for the job.
     */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Get the review for the job.
     */
    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    /**
     * Scope a query to only include active jobs.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('job_status', [self::STATUS_SCHEDULED, self::STATUS_IN_PROGRESS]);
    }

    /**
     * Scope a query to only include completed jobs.
     */
    public function scopeCompleted($query)
    {
        return $query->where('job_status', self::STATUS_COMPLETED);
    }

    /**
     * Scope a query to only include paid jobs.
     */
    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    /**
     * Mark job as started.
     */
    public function markAsStarted(): void
    {
        $this->update([
            'job_status' => self::STATUS_IN_PROGRESS,
            'actual_start_time' => now(),
        ]);
    }

    /**
     * Mark job as completed.
     */
    public function markAsCompleted(string $notes = null): void
    {
        $this->update([
            'job_status' => self::STATUS_COMPLETED,
            'actual_end_time' => now(),
            'completion_notes' => $notes,
        ]);
    }

    /**
     * Calculate total cost from parts and labor.
     */
    public function calculateTotal(): void
    {
        $total = ($this->parts_cost ?? 0) + ($this->labor_cost ?? 0);
        $this->update(['total_cost' => $total]);
    }

    /**
     * Check if job is completed.
     */
    public function isCompleted(): bool
    {
        return $this->job_status === self::STATUS_COMPLETED;
    }

    /**
     * Check if job is paid.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === self::PAYMENT_PAID;
    }

    /**
     * Check if job can be reviewed.
     */
    public function canBeReviewed(): bool
    {
        return $this->isCompleted() && !$this->review;
    }

    /**
     * Get duration in hours.
     */
    public function getDurationInHours(): ?float
    {
        if (!$this->actual_start_time || !$this->actual_end_time) {
            return null;
        }

        return $this->actual_start_time->diffInMinutes($this->actual_end_time) / 60;
    }
}
