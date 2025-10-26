<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'make',
        'model',
        'year',
        'vin',
        'mileage',
        'fuel_type',
        'transmission_type',
    ];

    protected $casts = [
        'year' => 'integer',
        'mileage' => 'integer',
    ];

    /**
     * Get the user that owns the vehicle
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all diagnoses for this vehicle
     */
    public function diagnoses()
    {
        return $this->hasMany(Diagnosis::class);
    }

    /**
     * Get all maintenance reminders for this vehicle
     */
    public function maintenanceReminders()
    {
        return $this->hasMany(MaintenanceReminder::class);
    }

    /**
     * Get the full vehicle name
     */
    public function getFullNameAttribute()
    {
        return "{$this->year} {$this->make} {$this->model}";
    }
}
