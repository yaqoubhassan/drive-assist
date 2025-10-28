<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Creates a table to track helpful feedback for driving tips using IP addresses.
     * This allows guest users to mark tips as helpful without requiring authentication.
     */
    public function up(): void
    {
        Schema::create('driving_tip_helpful_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driving_tip_id')->constrained()->onDelete('cascade');
            $table->string('ip_address', 45); // IPv4 or IPv6
            $table->boolean('is_helpful')->default(true);
            $table->text('comment')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('driving_tip_id');
            $table->index('ip_address');
            $table->unique(['driving_tip_id', 'ip_address']); // Prevent duplicate votes from same IP
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driving_tip_helpful_feedback');
    }
};
