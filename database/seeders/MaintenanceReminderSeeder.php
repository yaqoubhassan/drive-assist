<?php

namespace Database\Seeders;

use App\Models\MaintenanceReminder;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class MaintenanceReminderSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = Vehicle::all();

        foreach ($vehicles as $vehicle) {
            MaintenanceReminder::create([
                'vehicle_id' => $vehicle->id,
                'reminder_type' => 'oil_change',
                'due_date' => now()->addWeeks(2),
                'due_mileage' => ($vehicle->mileage ?? 0) + 3000,
                'description' => 'Regular oil change due',
            ]);

            MaintenanceReminder::create([
                'vehicle_id' => $vehicle->id,
                'reminder_type' => 'tire_rotation',
                'due_date' => now()->addMonths(1),
                'due_mileage' => ($vehicle->mileage ?? 0) + 5000,
                'description' => 'Rotate tires for even wear',
            ]);
        }
    }
}
