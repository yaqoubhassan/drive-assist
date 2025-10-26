<?php

namespace Database\Seeders;

use App\Models\ExpertLead;
use App\Models\ExpertProfile;
use App\Models\User;
use App\Models\Diagnosis;
use Illuminate\Database\Seeder;

class ExpertLeadSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('user_type', 'driver')->limit(3)->get();
        $profiles = ExpertProfile::limit(3)->get();
        $diagnoses = Diagnosis::limit(3)->get();

        foreach ($drivers as $index => $driver) {
            if (isset($profiles[$index]) && isset($diagnoses[$index])) {
                ExpertLead::create([
                    'expert_profile_id' => $profiles[$index]->id,
                    'driver_id' => $driver->id,
                    'diagnosis_id' => $diagnoses[$index]->id,
                    'driver_name' => $driver->name,
                    'driver_email' => $driver->email,
                    'driver_phone' => $driver->phone,
                    'message' => 'I need help with the issue identified in my diagnosis. Can you help?',
                    'preferred_contact_method' => 'phone',
                    'status' => 'contacted',
                    'expert_responded_at' => now()->subHours(2),
                ]);
            }
        }
    }
}
