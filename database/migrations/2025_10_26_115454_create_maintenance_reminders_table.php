<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->enum('reminder_type', [
                'oil_change',
                'tire_rotation',
                'brake_inspection',
                'battery_check',
                'general'
            ]);
            $table->date('due_date')->nullable();
            $table->integer('due_mileage')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index('vehicle_id');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_reminders');
    }
};
