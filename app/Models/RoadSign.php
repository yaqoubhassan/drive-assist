<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RoadSign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'meaning',
        'what_to_do',
        'image_url',
        'shape',
        'color_scheme',
        'keywords',
        'view_count',
        'is_popular',
    ];

    protected $casts = [
        'keywords' => 'array',
        'is_popular' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sign) {
            if (empty($sign->slug)) {
                $sign->slug = Str::slug($sign->name);
            }
        });
    }

    public function quizQuestions()
    {
        return $this->hasMany(RoadSignQuizQuestion::class);
    }

    public function incrementViewCount()
    {
        $this->increment('view_count');
    }

    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->orWhere('meaning', 'like', "%{$search}%")
                ->orWhereJsonContains('keywords', $search);
        });
    }
}
