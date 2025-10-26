<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('expert_leads')->onDelete('cascade');
            $table->foreignId('expert_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            $table->string('service_type');
            $table->text('description')->nullable();
            $table->date('scheduled_date')->nullable();
            $table->time('scheduled_time')->nullable();
            $table->timestamp('actual_start_time')->nullable();
            $table->timestamp('actual_end_time')->nullable();
            $table->decimal('parts_cost', 10, 2)->nullable();
            $table->decimal('labor_cost', 10, 2)->nullable();
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])->default('pending');
            $table->enum('job_status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->text('completion_notes')->nullable();
            $table->timestamps();

            $table->index('expert_profile_id');
            $table->index('driver_id');
            $table->index('job_status');
            $table->index('scheduled_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_jobs');
    }
};
