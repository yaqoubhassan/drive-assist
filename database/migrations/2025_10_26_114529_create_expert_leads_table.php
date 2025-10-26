<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expert_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('diagnosis_id')->nullable()->constrained()->onDelete('set null');
            $table->string('driver_name');
            $table->string('driver_email');
            $table->string('driver_phone', 20)->nullable();
            $table->text('message')->nullable();
            $table->enum('preferred_contact_method', ['email', 'phone', 'sms'])->default('email');
            $table->string('best_time_to_contact', 100)->nullable();
            $table->enum('status', ['new', 'contacted', 'in_progress', 'completed', 'cancelled'])->default('new');
            $table->text('expert_response')->nullable();
            $table->timestamp('expert_responded_at')->nullable();
            $table->timestamps();

            $table->index('expert_profile_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_leads');
    }
};
