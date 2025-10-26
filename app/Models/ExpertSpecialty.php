<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertSpecialty extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'expert_specialties';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'expert_profile_id',
        'specialty',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Available specialty options.
     */
    public const SPECIALTIES = [
        'engine' => 'Engine',
        'brakes' => 'Brakes',
        'electrical' => 'Electrical',
        'transmission' => 'Transmission',
        'tires' => 'Tires',
        'bodywork' => 'Bodywork',
        'diagnostics' => 'Diagnostics',
        'maintenance' => 'Maintenance',
        'air_conditioning' => 'Air Conditioning',
        'suspension' => 'Suspension',
        'exhaust' => 'Exhaust',
    ];

    /**
     * Get the expert profile that owns the specialty.
     */
    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    /**
     * Get the formatted specialty name.
     */
    public function getFormattedNameAttribute(): string
    {
        return self::SPECIALTIES[$this->specialty] ?? ucfirst($this->specialty);
    }
}
