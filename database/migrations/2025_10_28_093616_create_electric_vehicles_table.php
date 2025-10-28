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
        Schema::create('electric_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('category', [
                'buying_guide',
                'charging',
                'battery_maintenance',
                'cost_comparison',
                'tax_incentives',
                'model_reviews',
                'technology',
                'environmental',
                'infrastructure',
                'general'
            ]);
            $table->text('description');
            $table->longText('content');
            $table->text('key_takeaways')->nullable(); // JSON array
            $table->text('pros')->nullable(); // JSON array
            $table->text('cons')->nullable(); // JSON array
            $table->decimal('estimated_cost_min', 10, 2)->nullable(); // For cost-related articles
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->string('featured_image')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('reading_time_minutes')->default(5);
            $table->integer('view_count')->default(0);
            $table->integer('helpful_count')->default(0);
            $table->integer('not_helpful_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('order')->default(0); // For manual ordering
            $table->string('icon')->nullable(); // Lucide icon name
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('is_featured');
            $table->index('is_popular');
            $table->index('is_published');
            $table->index('slug');
            $table->index('order');
        });

        // Related articles pivot table
        Schema::create('electric_vehicle_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ev_article_id')->constrained('electric_vehicles')->onDelete('cascade');
            $table->foreignId('related_article_id')->constrained('electric_vehicles')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['ev_article_id', 'related_article_id'], 'unique_ev_relation');
        });

        // Helpful feedback table (polymorphic for consistency with other resources)
        Schema::create('electric_vehicle_helpful_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('electric_vehicle_id')->constrained()->onDelete('cascade');
            $table->string('ip_address', 45); // IPv4 or IPv6
            $table->boolean('is_helpful')->default(true);
            $table->text('comment')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('electric_vehicle_id');
            $table->index('ip_address');
            $table->unique(['electric_vehicle_id', 'ip_address'], 'unique_ev_feedback');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('electric_vehicle_helpful_feedback');
        Schema::dropIfExists('electric_vehicle_relations');
        Schema::dropIfExists('electric_vehicles');
    }
};
