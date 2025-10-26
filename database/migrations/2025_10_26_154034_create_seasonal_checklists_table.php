<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seasonal_checklists', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('season', ['spring', 'summer', 'fall', 'winter']);
            $table->text('description');
            $table->text('checklist_items'); // JSON array of checklist items
            $table->text('why_important'); // Why this seasonal maintenance matters
            $table->text('additional_tips')->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->integer('estimated_time_hours')->nullable();
            $table->integer('view_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('season');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seasonal_checklists');
    }
};
