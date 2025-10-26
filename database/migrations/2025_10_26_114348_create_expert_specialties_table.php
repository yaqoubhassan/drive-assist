<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expert_specialties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expert_profile_id')->constrained()->onDelete('cascade');
            $table->enum('specialty', [
                'engine',
                'brakes',
                'electrical',
                'transmission',
                'tires',
                'bodywork',
                'diagnostics',
                'maintenance',
                'air_conditioning',
                'suspension',
                'exhaust'
            ]);
            $table->timestamps();

            $table->unique(['expert_profile_id', 'specialty']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_specialties');
    }
};
