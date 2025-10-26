<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\ExpertLead;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        $leads = ExpertLead::all();

        foreach ($leads as $lead) {
            Job::create([
                'lead_id' => $lead->id,
                'expert_profile_id' => $lead->expert_profile_id,
                'driver_id' => $lead->driver_id,
                'vehicle_id' => $lead->diagnosis->vehicle_id ?? null,
                'service_type' => 'Repair',
                'scheduled_date' => now()->addDays(3),
                'scheduled_time' => '10:00:00',
                'parts_cost' => rand(100, 300),
                'labor_cost' => rand(150, 350),
                'job_status' => 'scheduled',
                'payment_status' => 'pending',
            ]);
        }
    }
}
