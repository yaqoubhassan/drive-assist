<?php

namespace Database\Seeders;

use App\Models\ExpertProfile;
use App\Models\ExpertSpecialty;
use Illuminate\Database\Seeder;

class ExpertSpecialtySeeder extends Seeder
{
    public function run(): void
    {
        $profiles = ExpertProfile::all();

        $specialtiesMap = [
            1 => ['engine', 'brakes', 'diagnostics', 'maintenance'],
            2 => ['brakes', 'electrical', 'diagnostics'],
            3 => ['transmission', 'engine', 'diagnostics'],
            4 => ['engine', 'brakes', 'electrical', 'maintenance'],
            5 => ['engine', 'brakes', 'transmission', 'maintenance', 'diagnostics'],
        ];

        foreach ($profiles as $profile) {
            $specialties = $specialtiesMap[$profile->id] ?? ['engine', 'maintenance'];

            foreach ($specialties as $specialty) {
                ExpertSpecialty::create([
                    'expert_profile_id' => $profile->id,
                    'specialty' => $specialty,
                ]);
            }
        }
    }
}
