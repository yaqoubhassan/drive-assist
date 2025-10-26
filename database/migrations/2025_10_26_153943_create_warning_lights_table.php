<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warning_lights', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Check Engine Light"
            $table->string('slug')->unique();
            $table->enum('severity', ['info', 'caution', 'warning', 'critical'])->default('warning');
            $table->string('color'); // red, yellow, orange, blue, green, etc.
            $table->text('icon_description'); // What the icon looks like
            $table->string('emoji')->nullable(); // Visual representation
            $table->text('meaning'); // What it indicates
            $table->text('possible_causes'); // JSON array
            $table->text('immediate_action'); // What to do right away
            $table->text('long_term_solution')->nullable();
            $table->boolean('safe_to_drive')->default(true);
            $table->text('driving_restrictions')->nullable(); // If safe_to_drive is conditional
            $table->decimal('estimated_repair_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_repair_cost_max', 10, 2)->nullable();
            $table->integer('view_count')->default(0);
            $table->boolean('is_common')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('severity');
            $table->index('color');
            $table->index('is_common');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warning_lights');
    }
};
