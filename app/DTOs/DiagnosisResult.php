<?php

namespace App\DTOs;

/**
 * Diagnosis Result Data Transfer Object
 * 
 * Represents the structured result from an AI diagnosis
 */
class DiagnosisResult
{
  public function __construct(
    public readonly string $identifiedIssue,
    public readonly int $confidenceScore,
    public readonly string $explanation,
    public readonly array $diySteps,
    public readonly ?string $safetyWarnings,
    public readonly ?float $estimatedCostMin,
    public readonly ?float $estimatedCostMax,
    public readonly string $urgencyLevel,
    public readonly bool $safeToDrive,
    public readonly ?string $safeToDriveNotes = null,
    public readonly ?array $relatedArticles = [],
    public readonly ?string $aiProvider = null,
    public readonly ?int $processingTimeSeconds = null,
  ) {
    $this->validate();
  }

  /**
   * Create from array (typically from AI API response)
   */
  public static function fromArray(array $data): self
  {
    return new self(
      identifiedIssue: $data['identified_issue'] ?? 'Unknown Issue',
      confidenceScore: (int) ($data['confidence_score'] ?? 0),
      explanation: $data['explanation'] ?? '',
      diySteps: $data['diy_steps'] ?? [],
      safetyWarnings: $data['safety_warnings'] ?? null,
      estimatedCostMin: isset($data['estimated_cost_min']) ? (float) $data['estimated_cost_min'] : null,
      estimatedCostMax: isset($data['estimated_cost_max']) ? (float) $data['estimated_cost_max'] : null,
      urgencyLevel: $data['urgency_level'] ?? 'medium',
      safeToDrive: (bool) ($data['safe_to_drive'] ?? false),
      safeToDriveNotes: $data['safe_to_drive_notes'] ?? null,
      relatedArticles: $data['related_articles'] ?? [],
      aiProvider: $data['ai_provider'] ?? null,
      processingTimeSeconds: isset($data['processing_time_seconds']) ? (int) $data['processing_time_seconds'] : null,
    );
  }

  /**
   * Convert to array for database storage
   */
  public function toArray(): array
  {
    return [
      'identified_issue' => $this->identifiedIssue,
      'confidence_score' => $this->confidenceScore,
      'explanation' => $this->explanation,
      'diy_steps' => $this->diySteps,
      'safety_warnings' => $this->safetyWarnings,
      'estimated_cost_min' => $this->estimatedCostMin,
      'estimated_cost_max' => $this->estimatedCostMax,
      'urgency_level' => $this->urgencyLevel,
      'safe_to_drive' => $this->safeToDrive,
      'safe_to_drive_notes' => $this->safeToDriveNotes,
      'related_articles' => $this->relatedArticles,
      'ai_provider' => $this->aiProvider,
      'processing_time_seconds' => $this->processingTimeSeconds,
    ];
  }

  /**
   * Validate the result data
   */
  private function validate(): void
  {
    if ($this->confidenceScore < 0 || $this->confidenceScore > 100) {
      throw new \InvalidArgumentException('Confidence score must be between 0 and 100');
    }

    $validUrgencyLevels = ['low', 'medium', 'critical'];
    if (!in_array($this->urgencyLevel, $validUrgencyLevels)) {
      throw new \InvalidArgumentException('Invalid urgency level: ' . $this->urgencyLevel);
    }

    if ($this->estimatedCostMin !== null && $this->estimatedCostMax !== null) {
      if ($this->estimatedCostMin > $this->estimatedCostMax) {
        throw new \InvalidArgumentException('Minimum cost cannot be greater than maximum cost');
      }
    }
  }

  /**
   * Get urgency level color for UI
   */
  public function getUrgencyColor(): string
  {
    return match ($this->urgencyLevel) {
      'low' => 'green',
      'medium' => 'yellow',
      'critical' => 'red',
      default => 'gray',
    };
  }

  /**
   * Get urgency level label for UI
   */
  public function getUrgencyLabel(): string
  {
    return match ($this->urgencyLevel) {
      'low' => 'Low Priority',
      'medium' => 'Medium Priority',
      'critical' => 'Critical - Immediate Attention',
      default => 'Unknown',
    };
  }

  /**
   * Check if this is a critical issue
   */
  public function isCritical(): bool
  {
    return $this->urgencyLevel === 'critical';
  }

  /**
   * Check if DIY repair is possible
   */
  public function hasDIYSteps(): bool
  {
    return !empty($this->diySteps);
  }

  /**
   * Get formatted cost estimate
   */
  public function getFormattedCostEstimate(): ?string
  {
    if ($this->estimatedCostMin === null || $this->estimatedCostMax === null) {
      return null;
    }

    return sprintf('$%.2f - $%.2f', $this->estimatedCostMin, $this->estimatedCostMax);
  }
}
