<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElectricVehicleHelpfulFeedback extends Model
{
    use HasFactory;

    protected $table = 'electric_vehicle_helpful_feedback';

    protected $fillable = [
        'electric_vehicle_id',
        'ip_address',
        'is_helpful',
        'comment',
    ];

    protected $casts = [
        'is_helpful' => 'boolean',
    ];

    /**
     * Get the article that owns the feedback
     */
    public function article()
    {
        return $this->belongsTo(ElectricVehicle::class, 'electric_vehicle_id');
    }
}
