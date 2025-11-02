<?php

namespace App\Providers;

use App\Services\AI\AIServiceFactory;
use App\Services\AI\AIServiceInterface;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register AI Service Interface
        $this->app->bind(AIServiceInterface::class, function ($app) {
            return AIServiceFactory::make();
        });

        // Register named AI service bindings for specific providers
        $this->app->bind('ai.groq', function ($app) {
            return AIServiceFactory::make('groq');
        });

        $this->app->bind('ai.gemini', function ($app) {
            return AIServiceFactory::make('gemini');
        });

        $this->app->bind('ai.openai', function ($app) {
            return AIServiceFactory::make('openai');
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
