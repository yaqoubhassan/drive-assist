<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expert_kyc', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expert_profile_id')->constrained('expert_profiles')->onDelete('cascade');

            // Business Verification Documents
            $table->string('business_license_number', 100)->nullable();
            $table->string('business_license_document_path', 500)->nullable();
            $table->date('business_license_expiry')->nullable();

            // Insurance Information
            $table->string('insurance_policy_number', 100)->nullable();
            $table->string('insurance_certificate_path', 500)->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->string('insurance_provider', 255)->nullable();

            // Identity Verification
            $table->enum('id_type', ['drivers_license', 'passport', 'national_id'])->nullable();
            $table->string('id_number', 100)->nullable();
            $table->string('id_document_front_path', 500)->nullable();
            $table->string('id_document_back_path', 500)->nullable();

            // Background Check
            $table->boolean('background_check_consent')->default(false);
            $table->enum('background_check_status', ['pending', 'in_progress', 'completed', 'failed'])->default('pending');
            $table->timestamp('background_check_completed_at')->nullable();
            $table->enum('criminal_record_disclosure', ['none', 'disclosed'])->nullable();
            $table->text('criminal_record_details')->nullable();

            // Banking Information (encrypted)
            $table->string('bank_name', 255)->nullable();
            $table->string('account_holder_name', 255)->nullable();
            $table->text('account_number_encrypted')->nullable();
            $table->string('routing_number', 20)->nullable();
            $table->text('tax_id_encrypted')->nullable();

            // Address Verification
            $table->string('utility_bill_path', 500)->nullable();

            // Professional Certifications (stored as JSON)
            $table->json('certifications')->nullable();

            // Professional References (stored as JSON)
            $table->json('professional_references')->nullable();

            // KYC Status and Tracking
            $table->enum('kyc_status', [
                'not_started',
                'in_progress',
                'submitted',
                'under_review',
                'approved',
                'rejected',
                'resubmission_required'
            ])->default('not_started');

            $table->timestamp('kyc_submitted_at')->nullable();
            $table->timestamp('kyc_reviewed_at')->nullable();
            $table->timestamp('kyc_approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();

            // Completion Tracking
            $table->integer('completion_percentage')->default(0);
            $table->boolean('required_documents_uploaded')->default(false);

            // Current Step (for resuming progress)
            $table->integer('current_step')->default(1);

            $table->timestamps();

            // Indexes
            $table->index('kyc_status');
            $table->index('expert_profile_id');
            $table->index(['kyc_status', 'kyc_submitted_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expert_kyc');
    }
};
