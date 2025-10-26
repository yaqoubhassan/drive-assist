<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@driveassist.com',
            'password' => Hash::make('password'),
            'user_type' => 'admin',
            'phone' => '+1-555-0100',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create sample drivers
        $drivers = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'phone' => '+1-555-0101',
                'location_latitude' => 34.0522,
                'location_longitude' => -118.2437,
                'location_address' => 'Los Angeles, CA',
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike.chen@example.com',
                'phone' => '+1-555-0102',
                'location_latitude' => 40.7128,
                'location_longitude' => -74.0060,
                'location_address' => 'New York, NY',
            ],
            [
                'name' => 'Emily Rodriguez',
                'email' => 'emily.rodriguez@example.com',
                'phone' => '+1-555-0103',
                'location_latitude' => 29.7604,
                'location_longitude' => -95.3698,
                'location_address' => 'Houston, TX',
            ],
            [
                'name' => 'David Kim',
                'email' => 'david.kim@example.com',
                'phone' => '+1-555-0104',
                'location_latitude' => 37.7749,
                'location_longitude' => -122.4194,
                'location_address' => 'San Francisco, CA',
            ],
            [
                'name' => 'Jessica Taylor',
                'email' => 'jessica.taylor@example.com',
                'phone' => '+1-555-0105',
                'location_latitude' => 41.8781,
                'location_longitude' => -87.6298,
                'location_address' => 'Chicago, IL',
            ],
        ];

        foreach ($drivers as $driver) {
            User::create(array_merge($driver, [
                'password' => Hash::make('password'),
                'user_type' => 'driver',
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
        }

        // Create sample experts
        $experts = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'phone' => '+1-555-0200',
                'location_latitude' => 34.0522,
                'location_longitude' => -118.2437,
                'location_address' => '123 Main St, Los Angeles, CA',
            ],
            [
                'name' => 'Robert Martinez',
                'email' => 'robert.martinez@example.com',
                'phone' => '+1-555-0201',
                'location_latitude' => 40.7128,
                'location_longitude' => -74.0060,
                'location_address' => '456 Broadway, New York, NY',
            ],
            [
                'name' => 'Carlos Garcia',
                'email' => 'carlos.garcia@example.com',
                'phone' => '+1-555-0202',
                'location_latitude' => 29.7604,
                'location_longitude' => -95.3698,
                'location_address' => '789 Houston St, Houston, TX',
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.anderson@example.com',
                'phone' => '+1-555-0203',
                'location_latitude' => 37.7749,
                'location_longitude' => -122.4194,
                'location_address' => '321 Market St, San Francisco, CA',
            ],
            [
                'name' => 'Tom Wilson',
                'email' => 'tom.wilson@example.com',
                'phone' => '+1-555-0204',
                'location_latitude' => 41.8781,
                'location_longitude' => -87.6298,
                'location_address' => '654 State St, Chicago, IL',
            ],
        ];

        foreach ($experts as $expert) {
            User::create(array_merge($expert, [
                'password' => Hash::make('password'),
                'user_type' => 'expert',
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
        }
    }
}
