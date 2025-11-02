<?php

namespace App\Providers;

use App\Services\AI\AIServiceFactory;
use App\Services\AI\AIServiceInterface;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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

        $this->configureRateLimiting();
    }

    /**
     * Configure rate limiting for the application.
     */
    protected function configureRateLimiting(): void
    {
        // AI Diagnosis Rate Limiter
        // Guest users: 5 diagnoses per hour
        // Authenticated users: 20 diagnoses per day
        RateLimiter::for('diagnosis', function (Request $request) {
            if ($request->user()) {
                // Authenticated users get more generous limits
                return Limit::perDay(
                    config('ai.rate_limits.authenticated.max_requests', 20)
                )->by($request->user()->id);
            }

            // Guest users are limited per IP address
            return Limit::perHour(
                config('ai.rate_limits.guest.max_requests', 5)
            )->by($request->ip());
        });

        // API rate limiter (if you add API endpoints in the future)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
