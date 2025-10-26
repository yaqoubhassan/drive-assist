<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Foundation: Create users first (drivers, experts, admin)
            UserSeeder::class,

            // 2. User-dependent data
            VehicleSeeder::class,              // Needs: User (drivers)
            ExpertProfileSeeder::class,        // Needs: User (experts)
            ExpertSpecialtySeeder::class,      // Needs: ExpertProfile

            // 3. Diagnosis flow
            DiagnosisSeeder::class,            // Needs: User, Vehicle
            ExpertLeadSeeder::class,           // Needs: User, ExpertProfile, Diagnosis
            JobSeeder::class,                  // Needs: ExpertLead
            ReviewSeeder::class,               // Needs: Job

            // 4. Additional features
            MaintenanceReminderSeeder::class,  // Needs: Vehicle
            FavoriteSeeder::class,             // Needs: User, ExpertProfile
            ArticleSeeder::class,              // Needs: User (author)

            // 5. Independent data (can go anywhere)
            // RoadSignsSeeder::class,            // Independent
            // CarIssueSeeder::class,             // Independent
        ]);
    }
}
