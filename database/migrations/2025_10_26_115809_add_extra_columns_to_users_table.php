<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->enum('user_type', ['driver', 'expert', 'admin'])->default('driver')->after('password');
            $table->string('avatar_url', 500)->nullable()->after('user_type');
            $table->decimal('location_latitude', 10, 8)->nullable()->after('avatar_url');
            $table->decimal('location_longitude', 11, 8)->nullable()->after('location_latitude');
            $table->text('location_address')->nullable()->after('location_longitude');
            $table->boolean('is_active')->default(true)->after('location_address');
            $table->timestamp('last_login_at')->nullable()->after('is_active');

            // Add indexes
            $table->index('user_type');
            $table->index(['location_latitude', 'location_longitude']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['user_type']);
            $table->dropIndex(['location_latitude', 'location_longitude']);

            $table->dropColumn([
                'phone',
                'user_type',
                'avatar_url',
                'location_latitude',
                'location_longitude',
                'location_address',
                'is_active',
                'last_login_at',
            ]);
        });
    }
};
