<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'driver_id',
        'expert_profile_id',
    ];

    public $timestamps = true; // Only created_at is used

    /**
     * Get the driver who favorited
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Get the expert profile that was favorited
     */
    public function expertProfile()
    {
        return $this->belongsTo(ExpertProfile::class);
    }
}
