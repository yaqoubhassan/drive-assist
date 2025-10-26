<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained()->onDelete('set null');
            $table->string('session_id')->nullable()->index();
            $table->enum('category', ['engine', 'brakes', 'electrical', 'transmission', 'tires', 'other']);
            $table->text('user_description');
            $table->string('voice_note_url', 500)->nullable();
            $table->enum('ai_provider', ['openai', 'claude', 'gemini']);
            $table->string('ai_request_id')->nullable();
            $table->string('identified_issue')->nullable();
            $table->integer('confidence_score')->nullable()->comment('0-100');
            $table->text('explanation')->nullable();
            $table->json('diy_steps')->nullable();
            $table->text('safety_warnings')->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->enum('urgency_level', ['low', 'medium', 'critical'])->nullable();
            $table->boolean('safe_to_drive')->nullable();
            $table->json('related_articles')->nullable();
            $table->integer('processing_time_seconds')->nullable();
            $table->enum('user_feedback', ['helpful', 'not_helpful'])->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->timestamps();

            $table->index('category');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnoses');
    }
};
