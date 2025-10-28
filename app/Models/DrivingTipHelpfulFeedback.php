<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DrivingTipHelpfulFeedback extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'driving_tip_helpful_feedback';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'driving_tip_id',
        'ip_address',
        'is_helpful',
        'comment',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_helpful' => 'boolean',
    ];

    /**
     * Get the driving tip that this feedback belongs to.
     */
    public function drivingTip(): BelongsTo
    {
        return $this->belongsTo(DrivingTip::class);
    }
}
