<?php

namespace Database\Seeders;

use App\Models\ExpertProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExpertProfileSeeder extends Seeder
{
    public function run(): void
    {
        $experts = User::where('user_type', 'expert')->get();

        $profiles = [
            [
                'business_name' => "John's Auto Repair",
                'business_type' => 'mechanic',
                'bio' => 'Family-owned shop with 20+ years of experience. Specializing in engine diagnostics and repair.',
                'years_experience' => 20,
                'employee_count' => 5,
                'hourly_rate_min' => 80,
                'hourly_rate_max' => 120,
                'diagnostic_fee' => 75,
                'avg_rating' => 4.9,
                'total_jobs' => 234,
            ],
            [
                'business_name' => "Bob's Garage",
                'business_type' => 'mechanic',
                'bio' => 'Expert in brake systems and electrical diagnostics. ASE certified technicians.',
                'years_experience' => 15,
                'employee_count' => 3,
                'hourly_rate_min' => 75,
                'hourly_rate_max' => 110,
                'diagnostic_fee' => 70,
                'avg_rating' => 4.7,
                'total_jobs' => 156,
            ],
            [
                'business_name' => "Carlos Auto Service",
                'business_type' => 'mechanic',
                'bio' => 'Transmission specialists with state-of-the-art equipment.',
                'years_experience' => 12,
                'employee_count' => 4,
                'hourly_rate_min' => 85,
                'hourly_rate_max' => 130,
                'diagnostic_fee' => 80,
                'avg_rating' => 4.8,
                'total_jobs' => 189,
            ],
            [
                'business_name' => "Lisa's Mobile Mechanics",
                'business_type' => 'mobile_mechanic',
                'bio' => 'We come to you! Expert mobile mechanics for on-site repairs.',
                'years_experience' => 10,
                'employee_count' => 2,
                'hourly_rate_min' => 90,
                'hourly_rate_max' => 140,
                'diagnostic_fee' => 85,
                'avg_rating' => 4.9,
                'total_jobs' => 142,
            ],
            [
                'business_name' => "Tom's Complete Auto Care",
                'business_type' => 'mechanic',
                'bio' => 'Full-service automotive repair and maintenance. All makes and models welcome.',
                'years_experience' => 18,
                'employee_count' => 6,
                'hourly_rate_min' => 78,
                'hourly_rate_max' => 115,
                'diagnostic_fee' => 72,
                'avg_rating' => 4.6,
                'total_jobs' => 298,
            ],
        ];

        foreach ($experts as $index => $expert) {
            if (isset($profiles[$index])) {
                ExpertProfile::create(array_merge($profiles[$index], [
                    'user_id' => $expert->id,
                    'verification_status' => 'approved',
                    'verified_at' => now(),
                    'monday_open' => '08:00:00',
                    'monday_close' => '18:00:00',
                    'tuesday_open' => '08:00:00',
                    'tuesday_close' => '18:00:00',
                    'wednesday_open' => '08:00:00',
                    'wednesday_close' => '18:00:00',
                    'thursday_open' => '08:00:00',
                    'thursday_close' => '18:00:00',
                    'friday_open' => '08:00:00',
                    'friday_close' => '18:00:00',
                    'saturday_open' => '09:00:00',
                    'saturday_close' => '15:00:00',
                ]));
            }
        }
    }
}
