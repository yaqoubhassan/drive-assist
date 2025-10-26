<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('user_type', 'admin')->first();

        $articles = [
            [
                'title' => 'Understanding Your Check Engine Light',
                'category' => 'common_issues',
                'excerpt' => 'Learn what different check engine light patterns mean and when to worry.',
                'content' => '<p>The check engine light is one of the most common dashboard warnings...</p>',
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'Basic Car Maintenance Checklist',
                'category' => 'maintenance',
                'excerpt' => 'A comprehensive guide to keeping your vehicle in top condition.',
                'content' => '<p>Regular maintenance is key to vehicle longevity...</p>',
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'EV Buying Guide 2025',
                'category' => 'electric_vehicles',
                'excerpt' => 'Everything you need to know before buying an electric vehicle.',
                'content' => '<p>Electric vehicles are becoming increasingly popular...</p>',
                'is_published' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($articles as $article) {
            Article::create(array_merge($article, [
                'author_id' => $admin->id,
            ]));
        }
    }
}
