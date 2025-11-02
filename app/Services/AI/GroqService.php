<?php

namespace App\Services\AI;

use App\DTOs\DiagnosisResult;
use App\Exceptions\AIServiceException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Groq AI Service Implementation
 * 
 * Uses Groq's ultra-fast LPU chips with Llama models
 * Primary choice for cost-effective, high-quality diagnoses
 */
class GroqService implements AIServiceInterface
{
  private string $apiKey;
  private string $apiUrl;
  private string $model;
  private int $timeout;
  private int $maxRetries;

  public function __construct()
  {
    $this->apiKey = config('ai.providers.groq.api_key');
    $this->apiUrl = config('ai.providers.groq.api_url');
    $this->model = config('ai.providers.groq.model');
    $this->timeout = config('ai.providers.groq.timeout', 30);
    $this->maxRetries = config('ai.providers.groq.max_retries', 2);

    if (empty($this->apiKey)) {
      throw AIServiceException::invalidApiKey('Groq');
    }
  }

  /**
   * {@inheritdoc}
   */
  public function diagnose(array $data): DiagnosisResult
  {
    $startTime = microtime(true);

    try {
      // Build the diagnostic prompt
      $prompt = $this->buildDiagnosticPrompt($data);

      // Make API request
      $response = $this->makeApiRequest($prompt, $data['images'] ?? []);

      // Parse response
      $result = $this->parseResponse($response);

      // Calculate processing time
      $processingTime = (int) round(microtime(true) - $startTime);

      // Add metadata
      $result['ai_provider'] = 'groq';
      $result['processing_time_seconds'] = $processingTime;

      // Log successful diagnosis
      Log::info('Groq diagnosis completed', [
        'confidence' => $result['confidence_score'],
        'issue' => $result['identified_issue'],
        'processing_time' => $processingTime,
      ]);

      return DiagnosisResult::fromArray($result);
    } catch (\Exception $e) {
      Log::error('Groq diagnosis failed', [
        'error' => $e->getMessage(),
        'data' => $data,
      ]);

      throw AIServiceException::connectionFailed('Groq', $e->getMessage());
    }
  }

  /**
   * {@inheritdoc}
   */
  public function analyzeImages(array $imagePaths): array
  {
    // Groq currently supports text only with Llama models
    // For image analysis, we'll need to use GPT-4 Vision or Gemini
    throw AIServiceException::unsupportedFeature('Groq', 'image analysis');
  }

  /**
   * {@inheritdoc}
   */
  public function getProviderName(): string
  {
    return 'Groq (Llama 3.3 70B)';
  }

  /**
   * {@inheritdoc}
   */
  public function isAvailable(): bool
  {
    try {
      $response = Http::timeout(5)
        ->withHeaders([
          'Authorization' => 'Bearer ' . $this->apiKey,
          'Content-Type' => 'application/json',
        ])
        ->get($this->apiUrl . '/models');

      return $response->successful();
    } catch (\Exception $e) {
      Log::warning('Groq availability check failed', ['error' => $e->getMessage()]);
      return false;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(): array
  {
    return [
      'provider' => 'groq',
      'model' => $this->model,
      'timeout' => $this->timeout,
      'max_retries' => $this->maxRetries,
      'supports_images' => false,
      'cost_per_1k_tokens' => 0.00059, // $0.59 per 1M tokens
    ];
  }

  /**
   * Build the diagnostic prompt for the AI
   */
  private function buildDiagnosticPrompt(array $data): string
  {
    $category = $data['category'] ?? 'general';
    $description = $data['description'];
    $make = $data['vehicle_make'] ?? 'Unknown';
    $model = $data['vehicle_model'] ?? 'Unknown';
    $year = $data['vehicle_year'] ?? 'Unknown';
    $mileage = isset($data['mileage']) ? number_format($data['mileage']) . ' miles' : 'Unknown';

    return <<<PROMPT
You are an expert automotive diagnostic AI assistant with decades of mechanical experience. A driver needs help diagnosing their vehicle issue.

VEHICLE INFORMATION:
- Make: {$make}
- Model: {$model}
- Year: {$year}
- Mileage: {$mileage}
- Issue Category: {$category}

DRIVER'S DESCRIPTION:
{$description}

INSTRUCTIONS:
1. Analyze the symptoms described and identify the most likely issue
2. Provide a confidence score (0-100) based on the information available
3. Explain the issue in simple, non-technical terms that a regular driver can understand
4. If safe, provide step-by-step DIY troubleshooting instructions
5. Highlight any safety concerns that require immediate attention
6. Estimate repair costs (parts + labor) based on typical market rates
7. Determine urgency level: low (can wait), medium (fix soon), critical (stop driving immediately)
8. Indicate if it's safe to continue driving and under what conditions

REQUIRED RESPONSE FORMAT (JSON ONLY - NO MARKDOWN):
{
    "identified_issue": "Brief name of the most likely issue",
    "confidence_score": 85,
    "explanation": "Clear, simple explanation of what's wrong and why it's happening. Use everyday language, avoid jargon.",
    "diy_steps": [
        "Step 1: First thing to check or try",
        "Step 2: Next diagnostic step",
        "Step 3: If previous steps don't help..."
    ],
    "safety_warnings": "Any immediate safety concerns. If none, use null.",
    "estimated_cost_min": 300,
    "estimated_cost_max": 600,
    "urgency_level": "medium",
    "safe_to_drive": true,
    "safe_to_drive_notes": "Safe for short distances only. Avoid highways."
}

IMPORTANT:
- Be conservative with safety - if unsure, recommend professional inspection
- Don't include DIY steps if the repair requires professional tools or expertise
- For critical issues, always recommend immediate professional help
- Provide realistic cost estimates based on current market rates
- Consider the vehicle's age and mileage in your assessment
- Return ONLY valid JSON, no additional text or markdown formatting

Now analyze this vehicle issue and provide your diagnostic response:
PROMPT;
  }

  /**
   * Make the API request to Groq
   */
  private function makeApiRequest(string $prompt, array $images = []): array
  {
    $attempt = 0;
    $lastException = null;

    while ($attempt < $this->maxRetries) {
      try {
        $response = Http::timeout($this->timeout)
          ->withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
          ])
          ->post($this->apiUrl . '/chat/completions', [
            'model' => $this->model,
            'messages' => [
              [
                'role' => 'system',
                'content' => 'You are an expert automotive diagnostic assistant. Always respond with valid JSON only, no markdown or additional formatting.',
              ],
              [
                'role' => 'user',
                'content' => $prompt,
              ],
            ],
            'temperature' => 0.3, // Lower for more consistent, factual responses
            'max_tokens' => 1500,
            'top_p' => 1,
            'stream' => false,
          ]);

        if (!$response->successful()) {
          $error = $response->json('error.message', 'Unknown error');

          if ($response->status() === 429) {
            throw AIServiceException::rateLimitExceeded('Groq');
          }

          throw new \Exception($error);
        }

        return $response->json();
      } catch (\Exception $e) {
        $lastException = $e;
        $attempt++;

        if ($attempt < $this->maxRetries) {
          // Exponential backoff
          sleep(pow(2, $attempt));
        }
      }
    }

    throw $lastException ?? new \Exception('Failed to complete API request');
  }

  /**
   * Parse the API response into structured data
   */
  private function parseResponse(array $response): array
  {
    if (!isset($response['choices'][0]['message']['content'])) {
      throw AIServiceException::invalidResponse('Groq', 'Missing content in response');
    }

    $content = $response['choices'][0]['message']['content'];

    // Remove markdown code blocks if present
    $content = preg_replace('/```json\s*/', '', $content);
    $content = preg_replace('/```\s*$/', '', $content);
    $content = trim($content);

    // Attempt to decode JSON
    $decoded = json_decode($content, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      Log::error('Failed to parse Groq response as JSON', [
        'content' => $content,
        'error' => json_last_error_msg(),
      ]);

      throw AIServiceException::invalidResponse('Groq', 'Response is not valid JSON: ' . json_last_error_msg());
    }

    // Validate required fields
    $requiredFields = [
      'identified_issue',
      'confidence_score',
      'explanation',
      'urgency_level',
      'safe_to_drive',
    ];

    foreach ($requiredFields as $field) {
      if (!isset($decoded[$field])) {
        throw AIServiceException::invalidResponse('Groq', "Missing required field: {$field}");
      }
    }

    // Ensure arrays are arrays
    $decoded['diy_steps'] = $decoded['diy_steps'] ?? [];
    $decoded['related_articles'] = $decoded['related_articles'] ?? [];

    return $decoded;
  }
}
