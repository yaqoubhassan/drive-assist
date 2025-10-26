<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceHelpfulFeedback extends Model
{
  protected $table = 'maintenance_helpful_feedback';

  protected $fillable = [
    'feedbackable_type',
    'feedbackable_id',
    'ip_address',
    'is_helpful',
    'comment',
  ];

  protected $casts = [
    'is_helpful' => 'boolean',
  ];

  public function feedbackable()
  {
    return $this->morphTo();
  }
}
