<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceGuide;
use App\Models\MaintenanceSchedule;
use App\Models\FluidGuide;
use App\Models\WarningLight;
use App\Models\SeasonalChecklist;

class MaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MaintenanceGuideSeeder::class,
            MaintenanceScheduleSeeder::class,
            FluidGuideSeeder::class,
            WarningLightSeeder::class,
            SeasonalChecklistSeeder::class,
        ]);
    }
}
