<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fluid_guides', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Engine Oil", "Coolant"
            $table->string('slug')->unique();
            $table->string('fluid_type')->nullable(); // e.g., "5W-30", "DOT 3"
            $table->text('description');
            $table->text('function'); // What the fluid does
            $table->text('check_procedure'); // How to check the fluid
            $table->text('change_procedure')->nullable(); // How to change it
            $table->integer('check_interval_miles')->nullable();
            $table->integer('check_interval_months')->nullable();
            $table->integer('change_interval_miles')->nullable();
            $table->integer('change_interval_months')->nullable();
            $table->text('warning_signs'); // Signs of low/bad fluid
            $table->decimal('typical_capacity_min', 10, 2)->nullable(); // In liters/quarts
            $table->decimal('typical_capacity_max', 10, 2)->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->string('color_when_good')->nullable();
            $table->string('color_when_bad')->nullable();
            $table->string('icon')->nullable(); // Emoji or icon identifier
            $table->integer('view_count')->default(0);
            $table->boolean('is_critical')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('slug');
            $table->index('is_critical');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fluid_guides');
    }
};
