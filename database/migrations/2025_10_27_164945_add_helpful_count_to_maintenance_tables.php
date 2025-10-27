<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Adds the missing helpful_count column to all maintenance resource tables.
     * This column is used to track positive feedback from users.
     */
    public function up(): void
    {
        // Add helpful_count to seasonal_checklists
        if (Schema::hasTable('seasonal_checklists') && !Schema::hasColumn('seasonal_checklists', 'helpful_count')) {
            Schema::table('seasonal_checklists', function (Blueprint $table) {
                $table->integer('helpful_count')->default(0)->after('view_count');
            });
        }

        // Add helpful_count to fluid_guides
        if (Schema::hasTable('fluid_guides') && !Schema::hasColumn('fluid_guides', 'helpful_count')) {
            Schema::table('fluid_guides', function (Blueprint $table) {
                $table->integer('helpful_count')->default(0)->after('view_count');
            });
        }

        // Add helpful_count to warning_lights
        if (Schema::hasTable('warning_lights') && !Schema::hasColumn('warning_lights', 'helpful_count')) {
            Schema::table('warning_lights', function (Blueprint $table) {
                $table->integer('helpful_count')->default(0)->after('view_count');
            });
        }

        // Add helpful_count to maintenance_schedules
        if (Schema::hasTable('maintenance_schedules') && !Schema::hasColumn('maintenance_schedules', 'helpful_count')) {
            Schema::table('maintenance_schedules', function (Blueprint $table) {
                $table->integer('helpful_count')->default(0)->after('view_count');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove helpful_count from all tables
        if (Schema::hasColumn('seasonal_checklists', 'helpful_count')) {
            Schema::table('seasonal_checklists', function (Blueprint $table) {
                $table->dropColumn('helpful_count');
            });
        }

        if (Schema::hasColumn('fluid_guides', 'helpful_count')) {
            Schema::table('fluid_guides', function (Blueprint $table) {
                $table->dropColumn('helpful_count');
            });
        }

        if (Schema::hasColumn('warning_lights', 'helpful_count')) {
            Schema::table('warning_lights', function (Blueprint $table) {
                $table->dropColumn('helpful_count');
            });
        }

        if (Schema::hasColumn('maintenance_schedules', 'helpful_count')) {
            Schema::table('maintenance_schedules', function (Blueprint $table) {
                $table->dropColumn('helpful_count');
            });
        }
    }
};
