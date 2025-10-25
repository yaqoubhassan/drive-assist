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
        Schema::create('car_issues', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('category', [
                'engine',
                'brakes',
                'electrical',
                'transmission',
                'tires',
                'suspension',
                'cooling',
                'fuel',
                'exhaust',
                'steering',
                'other'
            ]);
            $table->string('severity')->default('medium'); // low, medium, high, critical
            $table->text('symptoms'); // JSON or text describing common symptoms
            $table->text('description');
            $table->text('possible_causes')->nullable();
            $table->text('diy_solution')->nullable();
            $table->text('when_to_call_expert')->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->string('featured_image')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('helpful_count')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('severity');
            $table->index('is_popular');
            $table->index('view_count');
            $table->index('slug');
        });

        // Related issues pivot table
        Schema::create('car_issue_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('issue_id')->constrained('car_issues')->onDelete('cascade');
            $table->foreignId('related_issue_id')->constrained('car_issues')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['issue_id', 'related_issue_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_issue_relations');
        Schema::dropIfExists('car_issues');
    }
};
