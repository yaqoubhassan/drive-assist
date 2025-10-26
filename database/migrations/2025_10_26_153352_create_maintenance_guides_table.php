<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_guides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('category', [
                'fluid_check',
                'filter_replacement',
                'tire_maintenance',
                'brake_maintenance',
                'engine_maintenance',
                'electrical',
                'seasonal',
                'general'
            ]);
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->integer('estimated_time_minutes')->nullable(); // Time to complete
            $table->text('description');
            $table->text('tools_required')->nullable(); // JSON array
            $table->text('materials_needed')->nullable(); // JSON array
            $table->text('steps'); // JSON array of step objects
            $table->text('safety_warnings')->nullable();
            $table->text('tips_and_tricks')->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->string('featured_image')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('helpful_count')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('difficulty');
            $table->index('is_popular');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_guides');
    }
};
