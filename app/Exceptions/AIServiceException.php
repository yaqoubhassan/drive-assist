<?php

namespace App\Exceptions;

use Exception;

/**
 * AI Service Exception
 * 
 * Custom exception for AI service errors
 */
class AIServiceException extends Exception
{
  /**
   * Create a new exception for API connection failure
   */
  public static function connectionFailed(string $provider, string $message): self
  {
    return new self("Failed to connect to {$provider} API: {$message}");
  }

  /**
   * Create a new exception for API response parsing failure
   */
  public static function invalidResponse(string $provider, string $message): self
  {
    return new self("Invalid response from {$provider} API: {$message}");
  }

  /**
   * Create a new exception for rate limit exceeded
   */
  public static function rateLimitExceeded(string $provider): self
  {
    return new self("Rate limit exceeded for {$provider} API. Please try again later.");
  }

  /**
   * Create a new exception for invalid configuration
   */
  public static function invalidConfiguration(string $message): self
  {
    return new self("Invalid AI service configuration: {$message}");
  }

  /**
   * Create a new exception for unsupported feature
   */
  public static function unsupportedFeature(string $provider, string $feature): self
  {
    return new self("{$provider} does not support {$feature}");
  }

  /**
   * Create a new exception for API key issues
   */
  public static function invalidApiKey(string $provider): self
  {
    return new self("Invalid or missing API key for {$provider}");
  }

  /**
   * Create a new exception for timeout
   */
  public static function timeout(string $provider, int $seconds): self
  {
    return new self("Request to {$provider} API timed out after {$seconds} seconds");
  }
}
