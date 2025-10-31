<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\ExpertKyc;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExpertKycController extends Controller
{
    public function __construct(
        private FileUploadService $fileUploadService
    ) {}

    /**
     * Display the KYC form
     */
    public function index(): Response
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return Inertia::render('Expert/Onboarding/Index', [
                'error' => 'Please complete your profile first.',
            ]);
        }

        // Get or create KYC record
        $kyc = $expertProfile->kyc ?? $expertProfile->kyc()->create([
            'kyc_status' => 'not_started',
            'current_step' => 1,
        ]);

        return Inertia::render('Expert/Kyc/Index', [
            'kyc' => $this->formatKycForFrontend($kyc),
            'expertProfile' => $expertProfile->only([
                'id',
                'business_name',
                'verification_status',
            ]),
        ]);
    }

    /**
     * Save KYC progress
     */
    public function saveProgress(Request $request)
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return response()->json(['error' => 'Expert profile not found'], 404);
        }

        $kyc = $expertProfile->kyc ?? $expertProfile->kyc()->create([
            'kyc_status' => 'not_started',
        ]);

        $validated = $request->validate([
            'current_step' => 'required|integer|min:1|max:6',
            'business_license_number' => 'nullable|string|max:100',
            'business_license_expiry' => 'nullable|date|after:today',
            'insurance_policy_number' => 'nullable|string|max:100',
            'insurance_expiry' => 'nullable|date|after:today',
            'insurance_provider' => 'nullable|string|max:255',
            'id_type' => 'nullable|in:drivers_license,passport,national_id',
            'id_number' => 'nullable|string|max:100',
            'background_check_consent' => 'nullable|boolean',
            'criminal_record_disclosure' => 'nullable|in:none,disclosed',
            'criminal_record_details' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            'professional_references' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            // Update basic fields
            $updateData = collect($validated)->except([
                'certifications',
                'professional_references',
            ])->filter()->toArray();

            $kyc->update($updateData);

            // Handle JSON fields
            if ($request->has('certifications')) {
                $kyc->certifications = $request->certifications;
                $kyc->save();
            }

            if ($request->has('professional_references')) {
                $kyc->professional_references = $request->professional_references;
                $kyc->save();
            }

            // Update status to in_progress if it was not_started
            if ($kyc->kyc_status === 'not_started') {
                $kyc->kyc_status = 'in_progress';
                $kyc->save();
            }

            // Update completion percentage
            $kyc->updateCompletionPercentage();

            DB::commit();

            Log::info('KYC progress saved', [
                'expert_id' => $expertProfile->id,
                'current_step' => $validated['current_step'],
                'completion' => $kyc->completion_percentage,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Progress saved successfully',
                'kyc' => $this->formatKycForFrontend($kyc->fresh()),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to save KYC progress', [
                'expert_id' => $expertProfile->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to save progress. Please try again.',
            ], 500);
        }
    }

    /**
     * Upload KYC document
     */
    public function uploadDocument(Request $request)
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return response()->json(['error' => 'Expert profile not found'], 404);
        }

        $validated = $request->validate([
            'document_type' => 'required|in:business_license,insurance_certificate,id_front,id_back,utility_bill,certification',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            'certification_index' => 'nullable|integer|min:0',
        ]);

        $kyc = $expertProfile->kyc ?? $expertProfile->kyc()->create([
            'kyc_status' => 'not_started',
        ]);

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $documentType = $validated['document_type'];

            // Delete old file if exists
            $oldPath = $this->getOldDocumentPath($kyc, $documentType);
            if ($oldPath) {
                Storage::disk('public')->delete($oldPath);
            }

            // Upload new file
            $path = $this->fileUploadService->uploadKycDocument(
                $file,
                $expertProfile->id,
                $documentType
            );

            // Update KYC record
            $this->updateDocumentPath($kyc, $documentType, $path, $validated);

            // Update status to in_progress if it was not_started
            if ($kyc->kyc_status === 'not_started') {
                $kyc->kyc_status = 'in_progress';
                $kyc->save();
            }

            // Update completion percentage
            $kyc->updateCompletionPercentage();

            DB::commit();

            Log::info('KYC document uploaded', [
                'expert_id' => $expertProfile->id,
                'document_type' => $documentType,
                'path' => $path,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'kyc' => $this->formatKycForFrontend($kyc->fresh()),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to upload KYC document', [
                'expert_id' => $expertProfile->id,
                'document_type' => $validated['document_type'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to upload document. Please try again.',
            ], 500);
        }
    }

    /**
     * Submit KYC for review
     */
    public function submit(Request $request)
    {
        $user = auth()->user();
        $expertProfile = $user->expertProfile;

        if (!$expertProfile) {
            return response()->json(['error' => 'Expert profile not found'], 404);
        }

        $kyc = $expertProfile->kyc;

        if (!$kyc) {
            return response()->json(['error' => 'KYC record not found'], 404);
        }

        // Validate that all required fields are filled
        $errors = $this->validateKycCompletion($kyc);

        if (!empty($errors)) {
            return response()->json([
                'success' => false,
                'errors' => $errors,
            ], 422);
        }

        DB::beginTransaction();
        try {
            $kyc->submitForReview();

            DB::commit();

            Log::info('KYC submitted for review', [
                'expert_id' => $expertProfile->id,
                'kyc_id' => $kyc->id,
            ]);

            // TODO: Send notification to admin
            // TODO: Send confirmation email to expert

            return response()->json([
                'success' => true,
                'message' => 'KYC submitted successfully! Our team will review your information within 24-48 hours.',
                'kyc' => $this->formatKycForFrontend($kyc->fresh()),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to submit KYC', [
                'expert_id' => $expertProfile->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to submit KYC. Please try again.',
            ], 500);
        }
    }

    /**
     * Get old document path for deletion
     */
    private function getOldDocumentPath(ExpertKyc $kyc, string $documentType): ?string
    {
        return match ($documentType) {
            'business_license' => $kyc->business_license_document_path,
            'insurance_certificate' => $kyc->insurance_certificate_path,
            'id_front' => $kyc->id_document_front_path,
            'id_back' => $kyc->id_document_back_path,
            'utility_bill' => $kyc->utility_bill_path,
            default => null,
        };
    }

    /**
     * Update document path in KYC record
     */
    private function updateDocumentPath(ExpertKyc $kyc, string $documentType, string $path, array $validated): void
    {
        switch ($documentType) {
            case 'business_license':
                $kyc->business_license_document_path = $path;
                break;
            case 'insurance_certificate':
                $kyc->insurance_certificate_path = $path;
                break;
            case 'id_front':
                $kyc->id_document_front_path = $path;
                break;
            case 'id_back':
                $kyc->id_document_back_path = $path;
                break;
            case 'utility_bill':
                $kyc->utility_bill_path = $path;
                break;
            case 'certification':
                $certifications = $kyc->certifications ?? [];
                $index = $validated['certification_index'] ?? count($certifications);
                $certifications[$index]['document_path'] = $path;
                $kyc->certifications = $certifications;
                break;
        }

        $kyc->save();
    }

    /**
     * Validate KYC completion
     */
    private function validateKycCompletion(ExpertKyc $kyc): array
    {
        $errors = [];

        if (empty($kyc->business_license_number)) {
            $errors[] = 'Business license number is required';
        }

        if (empty($kyc->business_license_document_path)) {
            $errors[] = 'Business license document is required';
        }

        if (empty($kyc->business_license_expiry)) {
            $errors[] = 'Business license expiry date is required';
        }

        if (empty($kyc->insurance_policy_number)) {
            $errors[] = 'Insurance policy number is required';
        }

        if (empty($kyc->insurance_certificate_path)) {
            $errors[] = 'Insurance certificate is required';
        }

        if (empty($kyc->insurance_expiry)) {
            $errors[] = 'Insurance expiry date is required';
        }

        if (empty($kyc->id_type)) {
            $errors[] = 'ID type is required';
        }

        if (empty($kyc->id_number)) {
            $errors[] = 'ID number is required';
        }

        if (empty($kyc->id_document_front_path)) {
            $errors[] = 'ID document (front) is required';
        }

        if (!$kyc->background_check_consent) {
            $errors[] = 'Background check consent is required';
        }

        return $errors;
    }

    /**
     * Format KYC data for frontend
     */
    private function formatKycForFrontend(ExpertKyc $kyc): array
    {
        return [
            'id' => $kyc->id,
            'business_license_number' => $kyc->business_license_number,
            'business_license_document_path' => $kyc->business_license_document_path,
            'business_license_document_url' => $kyc->business_license_document_path
                ? Storage::disk('public')->url($kyc->business_license_document_path)
                : null,
            'business_license_expiry' => $kyc->business_license_expiry?->format('Y-m-d'),
            'insurance_policy_number' => $kyc->insurance_policy_number,
            'insurance_certificate_path' => $kyc->insurance_certificate_path,
            'insurance_certificate_url' => $kyc->insurance_certificate_path
                ? Storage::disk('public')->url($kyc->insurance_certificate_path)
                : null,
            'insurance_expiry' => $kyc->insurance_expiry?->format('Y-m-d'),
            'insurance_provider' => $kyc->insurance_provider,
            'id_type' => $kyc->id_type,
            'id_number' => $kyc->id_number,
            'id_document_front_path' => $kyc->id_document_front_path,
            'id_document_front_url' => $kyc->id_document_front_path
                ? Storage::disk('public')->url($kyc->id_document_front_path)
                : null,
            'id_document_back_path' => $kyc->id_document_back_path,
            'id_document_back_url' => $kyc->id_document_back_path
                ? Storage::disk('public')->url($kyc->id_document_back_path)
                : null,
            'background_check_consent' => $kyc->background_check_consent,
            'background_check_status' => $kyc->background_check_status,
            'criminal_record_disclosure' => $kyc->criminal_record_disclosure,
            'criminal_record_details' => $kyc->criminal_record_details,
            'utility_bill_path' => $kyc->utility_bill_path,
            'utility_bill_url' => $kyc->utility_bill_path
                ? Storage::disk('public')->url($kyc->utility_bill_path)
                : null,
            'certifications' => $kyc->certifications ?? [],
            'professional_references' => $kyc->professional_references ?? [],
            'kyc_status' => $kyc->kyc_status,
            'kyc_status_label' => $kyc->getStatusLabel(),
            'status_badge_color' => $kyc->getStatusBadgeColor(),
            'kyc_submitted_at' => $kyc->kyc_submitted_at?->format('M d, Y'),
            'kyc_reviewed_at' => $kyc->kyc_reviewed_at?->format('M d, Y'),
            'kyc_approved_at' => $kyc->kyc_approved_at?->format('M d, Y'),
            'rejection_reason' => $kyc->rejection_reason,
            'completion_percentage' => $kyc->completion_percentage,
            'required_documents_uploaded' => $kyc->required_documents_uploaded,
            'current_step' => $kyc->current_step,
            'is_approved' => $kyc->isApproved(),
            'is_pending_review' => $kyc->isPendingReview(),
            'is_rejected' => $kyc->isRejected(),
            'needs_resubmission' => $kyc->needsResubmission(),
        ];
    }
}
