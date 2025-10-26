<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('interval', [
                'daily',
                'weekly',
                'monthly',
                'quarterly',
                'semi_annually',
                'annually'
            ]);
            $table->integer('mileage_interval')->nullable(); // e.g., 5000, 10000 miles
            $table->text('description');
            $table->text('tasks'); // JSON array of maintenance tasks
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('season', ['spring', 'summer', 'fall', 'winter', 'all'])->default('all');
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->boolean('diy_possible')->default(true);
            $table->integer('view_count')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('interval');
            $table->index('priority');
            $table->index('season');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};
