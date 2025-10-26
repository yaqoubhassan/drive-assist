<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_helpful_feedback', function (Blueprint $table) {
            $table->id();
            $table->morphs('feedbackable', 'mhf_feedbackable_index'); // Custom shorter index name
            $table->string('ip_address');
            $table->boolean('is_helpful');
            $table->text('comment')->nullable();
            $table->timestamps();

            // Prevent duplicate votes from same IP
            $table->unique(['feedbackable_type', 'feedbackable_id', 'ip_address'], 'unique_feedback_vote');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_helpful_feedback');
    }
};
