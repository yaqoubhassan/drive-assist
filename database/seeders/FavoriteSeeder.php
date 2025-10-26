<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\User;
use App\Models\ExpertProfile;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('user_type', 'driver')->get();
        $profiles = ExpertProfile::all();

        foreach ($drivers->take(3) as $driver) {
            foreach ($profiles->random(2) as $profile) {
                Favorite::create([
                    'driver_id' => $driver->id,
                    'expert_profile_id' => $profile->id,
                ]);
            }
        }
    }
}
