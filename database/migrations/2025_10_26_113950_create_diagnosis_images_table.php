<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnosis_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diagnosis_id')->constrained()->onDelete('cascade');
            $table->string('image_url', 500);
            $table->string('image_path', 500);
            $table->integer('file_size');
            $table->string('mime_type', 50);
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();

            $table->index('diagnosis_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnosis_images');
    }
};
