<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpertKyc extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'expert_kyc';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'expert_profile_id',
        // Business Documents
        'business_license_number',
        'business_license_document_path',
        'business_license_expiry',
        // Insurance
        'insurance_policy_number',
        'insurance_certificate_path',
        'insurance_expiry',
        'insurance_provider',
        // Identity
        'id_type',
        'id_number',
        'id_document_front_path',
        'id_document_back_path',
        // Background Check
        'background_check_consent',
        'background_check_status',
        'background_check_completed_at',
        'criminal_record_disclosure',
        'criminal_record_details',
        // Address Verification
        'utility_bill_path',
        // Professional
        'certifications',
        'professional_references',
        // KYC Status
        'kyc_status',
        'kyc_submitted_at',
        'kyc_reviewed_at',
        'kyc_approved_at',
        'rejection_reason',
        'admin_notes',
        'completion_percentage',
        'required_documents_uploaded',
        'current_step',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'business_license_expiry' => 'date',
        'insurance_expiry' => 'date',
        'background_check_consent' => 'boolean',
        'background_check_completed_at' => 'datetime',
        'kyc_submitted_at' => 'datetime',
        'kyc_reviewed_at' => 'datetime',
        'kyc_approved_at' => 'datetime',
        'certifications' => 'array',
        'professional_references' => 'array',
        'completion_percentage' => 'integer',
        'required_documents_uploaded' => 'boolean',
        'current_step' => 'integer',
    ];

    /**
     * Get the expert profile that owns this KYC record
     */
    public function expertProfile(): BelongsTo
    {
        return $this->belongsTo(ExpertProfile::class);
    }

    /**
     * Check if KYC is approved
     */
    public function isApproved(): bool
    {
        return $this->kyc_status === 'approved';
    }

    /**
     * Check if KYC is pending review
     */
    public function isPendingReview(): bool
    {
        return in_array($this->kyc_status, ['submitted', 'under_review']);
    }

    /**
     * Check if KYC is rejected
     */
    public function isRejected(): bool
    {
        return $this->kyc_status === 'rejected';
    }

    /**
     * Check if KYC needs resubmission
     */
    public function needsResubmission(): bool
    {
        return $this->kyc_status === 'resubmission_required';
    }

    /**
     * Check if KYC is in progress
     */
    public function isInProgress(): bool
    {
        return $this->kyc_status === 'in_progress';
    }

    /**
     * Check if all required documents are uploaded
     */
    public function hasRequiredDocuments(): bool
    {
        return $this->business_license_document_path !== null
            && $this->insurance_certificate_path !== null
            && $this->id_document_front_path !== null;
    }

    /**
     * Calculate and update completion percentage
     * Updated to reflect 4 steps (removed banking - Step 4)
     * 
     * Step 1: Business Documents (30%)
     * Step 2: Identity Verification (25%)
     * Step 3: Insurance (20%)
     * Step 4: Background Check (25%)
     * Step 5: Review (not counted in completion)
     */
    public function updateCompletionPercentage(): void
    {
        $fields = [
            // Business Documents (30% total)
            'business_license_number' => 10,
            'business_license_document_path' => 15,
            'business_license_expiry' => 5,

            // Identity Verification (25% total)
            'id_type' => 6,
            'id_number' => 6,
            'id_document_front_path' => 10,
            'id_document_back_path' => 3,

            // Insurance (20% total)
            'insurance_policy_number' => 5,
            'insurance_certificate_path' => 10,
            'insurance_expiry' => 3,
            'insurance_provider' => 2,

            // Background Check (25% total)
            'background_check_consent' => 25,
        ];

        $totalPercentage = 0;

        foreach ($fields as $field => $weight) {
            if ($field === 'background_check_consent') {
                if ($this->$field === true) {
                    $totalPercentage += $weight;
                }
            } else {
                if (!empty($this->$field)) {
                    $totalPercentage += $weight;
                }
            }
        }

        // Ensure we never exceed 100%
        $this->completion_percentage = min($totalPercentage, 100);
        $this->required_documents_uploaded = $this->hasRequiredDocuments();
        $this->save();
    }

    /**
     * Submit KYC for review
     */
    public function submitForReview(): void
    {
        $this->kyc_status = 'submitted';
        $this->kyc_submitted_at = now();
        $this->save();
    }

    /**
     * Approve KYC
     */
    public function approve(string $adminNotes = null): void
    {
        $this->kyc_status = 'approved';
        $this->kyc_approved_at = now();
        $this->kyc_reviewed_at = now();
        $this->rejection_reason = null;
        if ($adminNotes) {
            $this->admin_notes = $adminNotes;
        }
        $this->save();

        // Update expert profile verification status
        $this->expertProfile->update([
            'verification_status' => 'approved',
            'verified_at' => now(),
        ]);
    }

    /**
     * Reject KYC
     */
    public function reject(string $reason, string $adminNotes = null): void
    {
        $this->kyc_status = 'rejected';
        $this->rejection_reason = $reason;
        $this->kyc_reviewed_at = now();
        if ($adminNotes) {
            $this->admin_notes = $adminNotes;
        }
        $this->save();
    }

    /**
     * Request resubmission
     */
    public function requestResubmission(string $reason, string $adminNotes = null): void
    {
        $this->kyc_status = 'resubmission_required';
        $this->rejection_reason = $reason;
        $this->kyc_reviewed_at = now();
        if ($adminNotes) {
            $this->admin_notes = $adminNotes;
        }
        $this->save();
    }

    /**
     * Get KYC status badge color
     */
    public function getStatusBadgeColor(): string
    {
        return match ($this->kyc_status) {
            'not_started' => 'gray',
            'in_progress' => 'blue',
            'submitted', 'under_review' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            'resubmission_required' => 'orange',
            default => 'gray',
        };
    }

    /**
     * Get human-readable KYC status
     */
    public function getStatusLabel(): string
    {
        return match ($this->kyc_status) {
            'not_started' => 'Not Started',
            'in_progress' => 'In Progress',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'resubmission_required' => 'Resubmission Required',
            default => 'Unknown',
        };
    }
}
