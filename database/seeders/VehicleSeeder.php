<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $drivers = User::where('user_type', 'driver')->get();

        $vehicles = [
            ['make' => 'Toyota', 'model' => 'Camry', 'year' => 2018, 'fuel_type' => 'gasoline', 'transmission_type' => 'automatic', 'mileage' => 45000],
            ['make' => 'Honda', 'model' => 'Accord', 'year' => 2020, 'fuel_type' => 'gasoline', 'transmission_type' => 'automatic', 'mileage' => 28000],
            ['make' => 'Ford', 'model' => 'F-150', 'year' => 2019, 'fuel_type' => 'gasoline', 'transmission_type' => 'automatic', 'mileage' => 52000],
            ['make' => 'Tesla', 'model' => 'Model 3', 'year' => 2021, 'fuel_type' => 'electric', 'transmission_type' => 'automatic', 'mileage' => 15000],
            ['make' => 'Chevrolet', 'model' => 'Silverado', 'year' => 2017, 'fuel_type' => 'diesel', 'transmission_type' => 'automatic', 'mileage' => 78000],
        ];

        foreach ($drivers as $index => $driver) {
            if (isset($vehicles[$index])) {
                Vehicle::create(array_merge($vehicles[$index], [
                    'user_id' => $driver->id,
                    'vin' => strtoupper(substr(md5(uniqid()), 0, 17)),
                ]));
            }
        }
    }
}
