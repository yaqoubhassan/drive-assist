<?php

namespace App\Services\AI;

use App\DTOs\DiagnosisResult;
use App\Exceptions\AIServiceException;

/**
 * OpenAI Service Implementation
 * 
 * Future implementation for OpenAI's GPT models
 * GPT-4o Mini: Fast and affordable
 * GPT-4 Vision: For image analysis
 * Cost: $0.15-0.60 per 1M tokens
 */
class OpenAIService implements AIServiceInterface
{
  private string $apiKey;
  private string $model;

  public function __construct()
  {
    $this->apiKey = config('ai.providers.openai.api_key', '');
    $this->model = config('ai.providers.openai.model', 'gpt-4o-mini');
  }

  /**
   * {@inheritdoc}
   */
  public function diagnose(array $data): DiagnosisResult
  {
    // TODO: Implement OpenAI diagnosis
    // 1. Build prompt similar to GroqService
    // 2. Make API request to OpenAI API
    // 3. Parse response
    // 4. Return DiagnosisResult

    throw new \RuntimeException('OpenAIService not yet implemented. Coming soon!');
  }

  /**
   * {@inheritdoc}
   */
  public function analyzeImages(array $imagePaths): array
  {
    // TODO: Implement image analysis
    // Use GPT-4 Vision for image analysis

    throw new \RuntimeException('OpenAI image analysis not yet implemented. Coming soon!');
  }

  /**
   * {@inheritdoc}
   */
  public function getProviderName(): string
  {
    return 'OpenAI GPT-4o Mini';
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
      'provider' => 'openai',
      'model' => $this->model,
      'supports_images' => true,
      'cost_per_1k_tokens' => 0.00015, // $0.15 per 1M tokens (input)
      'status' => 'coming_soon',
    ];
  }
}
