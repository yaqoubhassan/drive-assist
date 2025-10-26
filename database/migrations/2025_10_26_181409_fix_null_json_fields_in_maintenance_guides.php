<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fix maintenance_guides table
        if (Schema::hasTable('maintenance_guides')) {
            if (Schema::hasColumn('maintenance_guides', 'tools_required')) {
                DB::table('maintenance_guides')
                    ->whereNull('tools_required')
                    ->update(['tools_required' => json_encode([])]);

                DB::table('maintenance_guides')
                    ->where('tools_required', '')
                    ->update(['tools_required' => json_encode([])]);
            }

            if (Schema::hasColumn('maintenance_guides', 'materials_needed')) {
                DB::table('maintenance_guides')
                    ->whereNull('materials_needed')
                    ->update(['materials_needed' => json_encode([])]);

                DB::table('maintenance_guides')
                    ->where('materials_needed', '')
                    ->update(['materials_needed' => json_encode([])]);
            }

            if (Schema::hasColumn('maintenance_guides', 'steps')) {
                DB::table('maintenance_guides')
                    ->whereNull('steps')
                    ->update(['steps' => json_encode([])]);

                DB::table('maintenance_guides')
                    ->where('steps', '')
                    ->update(['steps' => json_encode([])]);
            }
        }

        // Fix maintenance_schedules table
        if (Schema::hasTable('maintenance_schedules')) {
            if (Schema::hasColumn('maintenance_schedules', 'tasks')) {
                DB::table('maintenance_schedules')
                    ->whereNull('tasks')
                    ->update(['tasks' => json_encode([])]);

                DB::table('maintenance_schedules')
                    ->where('tasks', '')
                    ->update(['tasks' => json_encode([])]);
            }
        }

        // Fix seasonal_checklists table
        if (Schema::hasTable('seasonal_checklists')) {
            if (Schema::hasColumn('seasonal_checklists', 'checklist_items')) {
                DB::table('seasonal_checklists')
                    ->whereNull('checklist_items')
                    ->update(['checklist_items' => json_encode([])]);

                DB::table('seasonal_checklists')
                    ->where('checklist_items', '')
                    ->update(['checklist_items' => json_encode([])]);
            }
        }

        // Fix warning_lights table - only if typical_causes column exists
        if (Schema::hasTable('warning_lights')) {
            if (Schema::hasColumn('warning_lights', 'typical_causes')) {
                DB::table('warning_lights')
                    ->whereNull('typical_causes')
                    ->update(['typical_causes' => json_encode([])]);

                DB::table('warning_lights')
                    ->where('typical_causes', '')
                    ->update(['typical_causes' => json_encode([])]);
            }
        }

        Log::info('✅ Fixed null JSON fields in maintenance tables');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this data fix
        Log::info('⚠️  No rollback needed for data fixes');
    }
};
