<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserQuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'total_questions',
        'correct_answers',
        'score_percentage',
        'time_taken_seconds',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isPassed()
    {
        return $this->score_percentage >= 70;
    }

    public function getGrade()
    {
        if ($this->score_percentage >= 90) return 'A';
        if ($this->score_percentage >= 80) return 'B';
        if ($this->score_percentage >= 70) return 'C';
        if ($this->score_percentage >= 60) return 'D';
        return 'F';
    }
}
