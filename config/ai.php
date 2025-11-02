<?php

return [

  /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | This option controls which AI service will be used by default for
    | vehicle diagnostics. You can override this at runtime by passing
    | a provider name to the AIServiceFactory.
    |
    | Supported: "groq", "gemini", "openai"
    |
    */

  'default_provider' => env('AI_DEFAULT_PROVIDER', 'groq'),

  /*
    |--------------------------------------------------------------------------
    | Fallback Order
    |--------------------------------------------------------------------------
    |
    | If the primary provider fails, the system will attempt to use these
    | providers in the order specified. Remove providers you don't want
    | to use as fallbacks.
    |
    */

  'fallback_order' => [
    'groq',
    'gemini',
    'openai',
  ],

  /*
    |--------------------------------------------------------------------------
    | Provider Configurations
    |--------------------------------------------------------------------------
    |
    | Configuration for each AI provider. Add your API keys to .env file
    | and configure provider-specific settings here.
    |
    */

  'providers' => [

    'groq' => [
      'api_key' => env('GROQ_API_KEY'),
      'api_url' => env('GROQ_API_URL', 'https://api.groq.com/openai/v1'),
      'model' => env('GROQ_MODEL', 'llama-3.3-70b-versatile'),
      'timeout' => env('GROQ_TIMEOUT', 30), // seconds
      'max_retries' => env('GROQ_MAX_RETRIES', 2),

      // Cost information (for reference)
      'cost_per_1m_input_tokens' => 0.59, // USD
      'cost_per_1m_output_tokens' => 0.79, // USD

      // Features
      'supports_vision' => false,
      'supports_function_calling' => false,
      'max_tokens' => 8192,
    ],

    'gemini' => [
      'api_key' => env('GEMINI_API_KEY'),
      'api_url' => env('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1beta'),
      'model' => env('GEMINI_MODEL', 'gemini-1.5-flash'),
      'timeout' => env('GEMINI_TIMEOUT', 30),
      'max_retries' => env('GEMINI_MAX_RETRIES', 2),

      // Cost information
      'cost_per_1m_input_tokens' => 0.075, // USD
      'cost_per_1m_output_tokens' => 0.30, // USD

      // Features
      'supports_vision' => true,
      'supports_function_calling' => true,
      'max_tokens' => 8192,
    ],

    'openai' => [
      'api_key' => env('OPENAI_API_KEY'),
      'api_url' => env('OPENAI_API_URL', 'https://api.openai.com/v1'),
      'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
      'vision_model' => env('OPENAI_VISION_MODEL', 'gpt-4o'),
      'timeout' => env('OPENAI_TIMEOUT', 30),
      'max_retries' => env('OPENAI_MAX_RETRIES', 2),

      // Cost information
      'cost_per_1m_input_tokens' => 0.15, // USD (gpt-4o-mini)
      'cost_per_1m_output_tokens' => 0.60, // USD (gpt-4o-mini)

      // Features
      'supports_vision' => true,
      'supports_function_calling' => true,
      'max_tokens' => 16384,
    ],

  ],

  /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limits for AI diagnoses to control costs and prevent
    | abuse. Limits are per IP address unless user is authenticated.
    |
    */

  'rate_limits' => [
    'guest' => [
      'max_requests' => env('AI_GUEST_RATE_LIMIT', 5),
      'decay_hours' => env('AI_GUEST_RATE_DECAY', 1),
    ],
    'authenticated' => [
      'max_requests' => env('AI_AUTH_RATE_LIMIT', 20),
      'decay_hours' => env('AI_AUTH_RATE_DECAY', 24),
    ],
    'premium' => [
      'max_requests' => env('AI_PREMIUM_RATE_LIMIT', 100),
      'decay_hours' => env('AI_PREMIUM_RATE_DECAY', 24),
    ],
  ],

  /*
    |--------------------------------------------------------------------------
    | Caching
    |--------------------------------------------------------------------------
    |
    | Enable caching of AI responses for identical queries to reduce costs
    | and improve response times. Cache keys are generated from user input.
    |
    */

  'cache' => [
    'enabled' => env('AI_CACHE_ENABLED', true),
    'ttl' => env('AI_CACHE_TTL', 604800), // 1 week in seconds
    'driver' => env('AI_CACHE_DRIVER', 'redis'),

    // Only cache for text-only queries (no images)
    'cache_image_queries' => env('AI_CACHE_IMAGES', false),
  ],

  /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    |
    | Configure logging for AI service requests and responses. Useful for
    | debugging and monitoring API usage.
    |
    */

  'logging' => [
    'enabled' => env('AI_LOGGING_ENABLED', true),
    'log_requests' => env('AI_LOG_REQUESTS', true),
    'log_responses' => env('AI_LOG_RESPONSES', false), // Can be verbose
    'log_errors' => env('AI_LOG_ERRORS', true),
    'channel' => env('AI_LOG_CHANNEL', 'stack'),
  ],

  /*
    |--------------------------------------------------------------------------
    | Response Validation
    |--------------------------------------------------------------------------
    |
    | Configure validation rules for AI responses to ensure quality and
    | consistency. Invalid responses will trigger retries or fallback.
    |
    */

  'validation' => [
    'min_confidence_score' => env('AI_MIN_CONFIDENCE', 30),
    'require_diy_steps' => env('AI_REQUIRE_DIY', false),
    'require_cost_estimate' => env('AI_REQUIRE_COST', true),
    'max_processing_time' => env('AI_MAX_PROCESSING_TIME', 45), // seconds
  ],

];
