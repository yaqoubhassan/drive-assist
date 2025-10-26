<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('business_name');
            $table->enum('business_type', ['mechanic', 'electrician', 'body_shop', 'mobile_mechanic', 'other']);
            $table->text('bio')->nullable();
            $table->integer('years_experience')->nullable();
            $table->integer('employee_count')->nullable();
            $table->string('business_license_number', 100)->nullable();
            $table->string('insurance_policy_number', 100)->nullable();
            $table->integer('service_radius_km')->default(25);
            $table->decimal('hourly_rate_min', 10, 2)->nullable();
            $table->decimal('hourly_rate_max', 10, 2)->nullable();
            $table->decimal('diagnostic_fee', 10, 2)->nullable();
            $table->boolean('accepts_emergency')->default(false);

            // Operating hours
            $table->time('monday_open')->nullable();
            $table->time('monday_close')->nullable();
            $table->time('tuesday_open')->nullable();
            $table->time('tuesday_close')->nullable();
            $table->time('wednesday_open')->nullable();
            $table->time('wednesday_close')->nullable();
            $table->time('thursday_open')->nullable();
            $table->time('thursday_close')->nullable();
            $table->time('friday_open')->nullable();
            $table->time('friday_close')->nullable();
            $table->time('saturday_open')->nullable();
            $table->time('saturday_close')->nullable();
            $table->time('sunday_open')->nullable();
            $table->time('sunday_close')->nullable();

            $table->enum('verification_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('profile_views')->default(0);
            $table->integer('total_jobs')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0);
            $table->timestamps();

            $table->index('verification_status');
            $table->index('avg_rating');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_profiles');
    }
};
