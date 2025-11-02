<?php

namespace App\Services\AI;

use App\DTOs\DiagnosisResult;
use App\Exceptions\AIServiceException;

/**
 * Google Gemini AI Service Implementation
 * 
 * Future implementation for Google's Gemini models
 * Gemini 1.5 Flash is an excellent backup option with vision capabilities
 * Cost: ~$0.075 per 1M tokens (50% cheaper than OpenAI)
 */
class GeminiService implements AIServiceInterface
{
  private string $apiKey;
  private string $model;

  public function __construct()
  {
    $this->apiKey = config('ai.providers.gemini.api_key', '');
    $this->model = config('ai.providers.gemini.model', 'gemini-1.5-flash');
  }

  /**
   * {@inheritdoc}
   */
  public function diagnose(array $data): DiagnosisResult
  {
    // TODO: Implement Gemini diagnosis
    // 1. Build prompt similar to GroqService
    // 2. Make API request to Gemini API
    // 3. Parse response
    // 4. Return DiagnosisResult

    throw new \RuntimeException('GeminiService not yet implemented. Coming soon!');
  }

  /**
   * {@inheritdoc}
   */
  public function analyzeImages(array $imagePaths): array
  {
    // TODO: Implement image analysis
    // Gemini 1.5 Flash supports vision natively

    throw new \RuntimeException('Gemini image analysis not yet implemented. Coming soon!');
  }

  /**
   * {@inheritdoc}
   */
  public function getProviderName(): string
  {
    return 'Google Gemini 1.5 Flash';
  }

  /**
   * {@inheritdoc}
   */
  public function isAvailable(): bool
  {
    // Check if API key is configured
    return !empty($this->apiKey);
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(): array
  {
    return [
      'provider' => 'gemini',
      'model' => $this->model,
      'supports_images' => true,
      'cost_per_1k_tokens' => 0.000075, // $0.075 per 1M tokens
      'status' => 'coming_soon',
    ];
  }
}
