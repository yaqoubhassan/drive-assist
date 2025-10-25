<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoadSignQuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'road_sign_id',
        'question',
        'options',
        'correct_option_index',
        'explanation',
        'difficulty',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function roadSign()
    {
        return $this->belongsTo(RoadSign::class);
    }

    public function isCorrect($answerIndex)
    {
        return $answerIndex === $this->correct_option_index;
    }
}
