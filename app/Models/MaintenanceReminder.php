<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'reminder_type',
        'due_date',
        'due_mileage',
        'description',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'due_mileage' => 'integer',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the vehicle for this reminder
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Check if reminder is overdue
     */
    public function isOverdue()
    {
        if ($this->is_completed) {
            return false;
        }

        if ($this->due_date && $this->due_date < now()->toDateString()) {
            return true;
        }

        if ($this->due_mileage && $this->vehicle && $this->vehicle->mileage >= $this->due_mileage) {
            return true;
        }

        return false;
    }

    /**
     * Mark reminder as completed
     */
    public function markAsCompleted()
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Get formatted reminder type
     */
    public function getFormattedTypeAttribute()
    {
        return ucfirst(str_replace('_', ' ', $this->reminder_type));
    }

    /**
     * Scope for pending reminders
     */
    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    /**
     * Scope for completed reminders
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope for overdue reminders
     */
    public function scopeOverdue($query)
    {
        return $query->where('is_completed', false)
            ->where(function ($q) {
                $q->where('due_date', '<', now()->toDateString())
                    ->orWhereHas('vehicle', function ($vq) {
                        $vq->whereColumn('mileage', '>=', 'maintenance_reminders.due_mileage');
                    });
            });
    }
}
