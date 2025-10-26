<?php

namespace Database\Seeders;

use App\Models\Diagnosis;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class DiagnosisSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('user_type', 'driver')->get();
        $vehicles = Vehicle::all();

        $diagnoses = [
            [
                'category' => 'engine',
                'user_description' => 'Check engine light came on, and the car is idling rough. Sometimes stalls at red lights.',
                'identified_issue' => 'Faulty Mass Air Flow Sensor',
                'confidence_score' => 87,
                'explanation' => 'The symptoms indicate a problem with the mass air flow (MAF) sensor, which measures the amount of air entering the engine.',
                'diy_steps' => ['Clean the MAF sensor', 'Check air filter', 'Inspect for vacuum leaks'],
                'safety_warnings' => 'Vehicle may stall unexpectedly. Avoid heavy traffic if possible.',
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 350,
                'urgency_level' => 'medium',
                'safe_to_drive' => true,
                'status' => 'completed',
            ],
            [
                'category' => 'brakes',
                'user_description' => 'Hearing squeaking noise when braking. Pedal feels soft.',
                'identified_issue' => 'Worn Brake Pads',
                'confidence_score' => 92,
                'explanation' => 'Squeaking noise indicates worn brake pads, and soft pedal suggests low brake fluid or air in the system.',
                'diy_steps' => ['Check brake fluid level', 'Inspect brake pads visually'],
                'safety_warnings' => 'CRITICAL: Braking performance is compromised. Do not drive long distances.',
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 400,
                'urgency_level' => 'critical',
                'safe_to_drive' => false,
                'status' => 'completed',
            ],
        ];

        foreach ($drivers as $index => $driver) {
            $vehicle = $vehicles->get($index);
            if ($vehicle && isset($diagnoses[$index])) {
                Diagnosis::create(array_merge($diagnoses[$index], [
                    'user_id' => $driver->id,
                    'vehicle_id' => $vehicle->id,
                    'ai_provider' => 'openai',
                    'processing_time_seconds' => rand(3, 8),
                ]));
            }
        }
    }
}
