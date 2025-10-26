<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expert_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('job_id')->nullable()->constrained('expert_jobs')->onDelete('set null');
            $table->unsignedTinyInteger('overall_rating'); // 1-5
            $table->unsignedTinyInteger('quality_rating')->nullable(); // 1-5
            $table->unsignedTinyInteger('professionalism_rating')->nullable(); // 1-5
            $table->unsignedTinyInteger('pricing_rating')->nullable(); // 1-5
            $table->unsignedTinyInteger('communication_rating')->nullable(); // 1-5
            $table->text('review_text')->nullable();
            $table->text('expert_response')->nullable();
            $table->timestamp('expert_responded_at')->nullable();
            $table->boolean('is_verified_purchase')->default(false);
            $table->integer('helpful_count')->default(0);
            $table->timestamps();

            $table->index('expert_profile_id');
            $table->index('overall_rating');
            $table->index('created_at');
        });

        // Note: Rating validation (1-5) should be handled at the application level
        // in the Review model or form request validation, not at database level
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
