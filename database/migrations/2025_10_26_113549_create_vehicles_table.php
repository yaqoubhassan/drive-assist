<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('make', 100);
            $table->string('model', 100);
            $table->integer('year');
            $table->string('vin', 17)->nullable();
            $table->integer('mileage')->nullable();
            $table->enum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid', 'other'])->nullable();
            $table->enum('transmission_type', ['automatic', 'manual'])->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
