<?php

namespace App\Services\AI;

use App\Exceptions\AIServiceException;
use Illuminate\Support\Facades\Log;

/**
 * AI Service Factory
 * 
 * Creates and manages AI service instances based on configuration
 * Provides automatic fallback to alternative providers if primary fails
 */
class AIServiceFactory
{
  /**
   * Create an AI service instance based on configuration
   * 
   * @param string|null $provider Override default provider
   * @return AIServiceInterface
   * @throws AIServiceException
   */
  public static function make(?string $provider = null): AIServiceInterface
  {
    $provider = $provider ?? config('ai.default_provider');

    $service = match ($provider) {
      'groq' => new GroqService(),
      'gemini' => new GeminiService(),
      'openai' => new OpenAIService(),
      default => throw AIServiceException::invalidConfiguration("Unknown provider: {$provider}"),
    };

    // Check if service is available
    if (!$service->isAvailable()) {
      Log::warning("AI provider {$provider} is not available, attempting fallback");
      return self::makeFallback($provider);
    }

    return $service;
  }

  /**
   * Attempt to create a fallback service
   * 
   * @param string $failedProvider The provider that failed
   * @return AIServiceInterface
   * @throws AIServiceException
   */
  private static function makeFallback(string $failedProvider): AIServiceInterface
  {
    $fallbackOrder = config('ai.fallback_order', []);

    // Remove the failed provider from fallback list
    $fallbackOrder = array_filter($fallbackOrder, fn($p) => $p !== $failedProvider);

    foreach ($fallbackOrder as $provider) {
      try {
        $service = self::make($provider);

        if ($service->isAvailable()) {
          Log::info("Using fallback AI provider: {$provider}");
          return $service;
        }
      } catch (\Exception $e) {
        Log::warning("Fallback provider {$provider} also failed: " . $e->getMessage());
        continue;
      }
    }

    throw AIServiceException::invalidConfiguration(
      "All AI providers are unavailable. Tried: {$failedProvider}, " . implode(', ', $fallbackOrder)
    );
  }

  /**
   * Get all available providers
   * 
   * @return array
   */
  public static function getAvailableProviders(): array
  {
    $providers = [];

    foreach (['groq', 'gemini', 'openai'] as $providerName) {
      try {
        $service = self::make($providerName);

        $providers[$providerName] = [
          'name' => $service->getProviderName(),
          'available' => $service->isAvailable(),
          'config' => $service->getConfig(),
        ];
      } catch (\Exception $e) {
        $providers[$providerName] = [
          'name' => ucfirst($providerName),
          'available' => false,
          'error' => $e->getMessage(),
        ];
      }
    }

    return $providers;
  }

  /**
   * Test a specific provider
   * 
   * @param string $provider
   * @return array Test results
   */
  public static function testProvider(string $provider): array
  {
    try {
      $service = self::make($provider);

      $testData = [
        'category' => 'engine',
        'description' => 'My car makes a strange clicking noise when starting',
        'vehicle_make' => 'Toyota',
        'vehicle_model' => 'Camry',
        'vehicle_year' => 2015,
      ];

      $startTime = microtime(true);
      $result = $service->diagnose($testData);
      $duration = microtime(true) - $startTime;

      return [
        'success' => true,
        'provider' => $service->getProviderName(),
        'duration' => round($duration, 2),
        'confidence' => $result->confidenceScore,
        'issue' => $result->identifiedIssue,
      ];
    } catch (\Exception $e) {
      return [
        'success' => false,
        'provider' => $provider,
        'error' => $e->getMessage(),
      ];
    }
  }

  /**
   * Get cost estimate for a provider
   * 
   * @param string $provider
   * @param int $estimatedTokens
   * @return float
   */
  public static function estimateCost(string $provider, int $estimatedTokens = 2000): float
  {
    try {
      $service = self::make($provider);
      $config = $service->getConfig();

      $costPer1k = $config['cost_per_1k_tokens'] ?? 0;

      return ($estimatedTokens / 1000) * $costPer1k;
    } catch (\Exception $e) {
      return 0.0;
    }
  }
}
