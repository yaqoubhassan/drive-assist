<?php

namespace App\Services\AI;

use App\DTOs\DiagnosisResult;

/**
 * AI Service Interface
 * 
 * Defines the contract for all AI service providers.
 * This allows easy switching between different AI providers (Groq, Gemini, OpenAI, etc.)
 */
interface AIServiceInterface
{
  /**
   * Diagnose a vehicle issue based on user input
   * 
   * @param array $data Diagnosis data including:
   *                    - category: string
   *                    - description: string
   *                    - images: array (optional)
   *                    - vehicle_make: string (optional)
   *                    - vehicle_model: string (optional)
   *                    - vehicle_year: int (optional)
   *                    - mileage: int (optional)
   * 
   * @return DiagnosisResult
   * @throws \App\Exceptions\AIServiceException
   */
  public function diagnose(array $data): DiagnosisResult;

  /**
   * Analyze vehicle issue images
   * 
   * @param array $imagePaths Array of image file paths
   * @return array Analysis results for each image
   * @throws \App\Exceptions\AIServiceException
   */
  public function analyzeImages(array $imagePaths): array;

  /**
   * Get the provider name
   * 
   * @return string
   */
  public function getProviderName(): string;

  /**
   * Check if the service is available
   * 
   * @return bool
   */
  public function isAvailable(): bool;

  /**
   * Get provider-specific configuration
   * 
   * @return array
   */
  public function getConfig(): array;
}
