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
        Schema::create('driving_tips', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('category', [
                'beginner',
                'defensive',
                'fuel_efficiency',
                'weather',
                'advanced',
                'safety',
                'parking',
                'highway'
            ]);
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->text('excerpt'); // Short summary for cards
            $table->longText('content'); // Main content with markdown support
            $table->json('key_points')->nullable(); // Array of key takeaways
            $table->json('dos')->nullable(); // Array of things to do
            $table->json('donts')->nullable(); // Array of things NOT to do
            $table->text('pro_tip')->nullable(); // Expert advice
            $table->string('icon')->nullable(); // Icon name (lucide-react)
            $table->string('featured_image')->nullable();
            $table->integer('reading_time_minutes')->default(3);
            $table->integer('view_count')->default(0);
            $table->integer('helpful_count')->default(0);
            $table->integer('order')->default(0); // For manual ordering
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('difficulty');
            $table->index('is_featured');
            $table->index('is_popular');
            $table->index('view_count');
            $table->index('slug');
            $table->index('order');
        });

        // Related tips pivot table
        Schema::create('driving_tip_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tip_id')->constrained('driving_tips')->onDelete('cascade');
            $table->foreignId('related_tip_id')->constrained('driving_tips')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['tip_id', 'related_tip_id']);
        });

        // User progress tracking (optional - for logged-in users)
        Schema::create('user_tip_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('driving_tip_id')->constrained()->onDelete('cascade');
            $table->boolean('is_read')->default(false);
            $table->boolean('is_bookmarked')->default(false);
            $table->boolean('is_helpful')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'driving_tip_id']);
            $table->index('user_id');
            $table->index('is_bookmarked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_tip_progress');
        Schema::dropIfExists('driving_tip_relations');
        Schema::dropIfExists('driving_tips');
    }
};
