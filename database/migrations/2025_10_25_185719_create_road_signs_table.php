<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('road_signs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', ['warning', 'regulatory', 'information', 'guide']);
            $table->text('description');
            $table->text('meaning');
            $table->text('what_to_do');
            $table->string('image_url');
            $table->string('shape')->nullable(); // circle, triangle, square, rectangle, diamond, octagon
            $table->string('color_scheme')->nullable(); // red-white, yellow-black, blue-white, etc.
            $table->json('keywords')->nullable(); // for better search
            $table->integer('view_count')->default(0);
            $table->boolean('is_popular')->default(false);
            $table->timestamps();

            $table->index('category');
            $table->index('slug');
            $table->index('is_popular');
        });

        Schema::create('road_sign_quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('road_sign_id')->constrained()->onDelete('cascade');
            $table->text('question');
            $table->json('options'); // array of 4 options
            $table->integer('correct_option_index'); // 0-3
            $table->text('explanation')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->timestamps();
        });

        Schema::create('user_quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('session_id')->nullable(); // for guest users
            $table->integer('total_questions');
            $table->integer('correct_answers');
            $table->integer('score_percentage');
            $table->integer('time_taken_seconds');
            $table->json('answers')->nullable(); // detailed answers for review
            $table->timestamps();

            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_quiz_attempts');
        Schema::dropIfExists('road_sign_quiz_questions');
        Schema::dropIfExists('road_signs');
    }
};
