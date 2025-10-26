<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceSchedule;

class MaintenanceScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = [
            // DAILY
            [
                'title' => 'Daily Pre-Drive Check',
                'interval' => 'daily',
                'mileage_interval' => null,
                'description' => 'Quick checks you should perform daily before driving to ensure safety and catch potential issues early.',
                'tasks' => json_encode([
                    'Check tire pressure visually (look for flat or low tires)',
                    'Look for puddles or leaks under vehicle',
                    'Check all exterior lights (headlights, brake lights, turn signals)',
                    'Ensure windshield is clean',
                    'Check mirrors and adjust if needed',
                    'Verify horn works',
                    'Test parking brake',
                ]),
                'priority' => 'medium',
                'season' => 'all',
                'estimated_cost_min' => 0,
                'estimated_cost_max' => 0,
                'diy_possible' => true,
                'is_published' => true,
            ],

            // WEEKLY
            [
                'title' => 'Weekly Maintenance Checklist',
                'interval' => 'weekly',
                'mileage_interval' => null,
                'description' => 'Essential weekly checks to maintain vehicle health and performance.',
                'tasks' => json_encode([
                    'Check tire pressure with gauge (including spare)',
                    'Inspect tires for damage, cuts, or embedded objects',
                    'Check all fluid levels (oil, coolant, washer fluid)',
                    'Clean windshield inside and out',
                    'Remove debris from under hood',
                    'Check wiper blade condition',
                    'Test all lights (headlights, turn signals, brake lights, reverse lights)',
                    'Inspect under vehicle for leaks',
                    'Check battery terminals for corrosion',
                ]),
                'priority' => 'high',
                'season' => 'all',
                'estimated_cost_min' => 0,
                'estimated_cost_max' => 10,
                'diy_possible' => true,
                'is_published' => true,
            ],

            // MONTHLY
            [
                'title' => 'Monthly Maintenance Checklist',
                'interval' => 'monthly',
                'mileage_interval' => null,
                'description' => 'Comprehensive monthly maintenance to keep your vehicle running smoothly.',
                'tasks' => json_encode([
                    'Deep clean interior (vacuum, wipe surfaces)',
                    'Wash and wax exterior',
                    'Check air filter condition',
                    'Inspect belts and hoses for wear',
                    'Check brake pad thickness (if visible through wheel)',
                    'Test air conditioning / heater',
                    'Check tire tread depth',
                    'Lubricate door hinges and locks',
                    'Clean battery terminals',
                    'Check for unusual noises or vibrations',
                    'Review maintenance records',
                ]),
                'priority' => 'high',
                'season' => 'all',
                'estimated_cost_min' => 20,
                'estimated_cost_max' => 50,
                'diy_possible' => true,
                'is_published' => true,
            ],

            // QUARTERLY (3 MONTHS)
            [
                'title' => 'Quarterly Maintenance - Every 3 Months',
                'interval' => 'quarterly',
                'mileage_interval' => 3000,
                'description' => 'Important checks every 3 months or 3,000 miles to prevent major issues.',
                'tasks' => json_encode([
                    'Change engine oil and filter',
                    'Rotate tires',
                    'Check and top off all fluids',
                    'Inspect brake system (pads, rotors, fluid)',
                    'Check suspension components',
                    'Inspect exhaust system',
                    'Test battery',
                    'Check all lights and replace bulbs as needed',
                    'Inspect wipers and replace if needed',
                    'Check wheel alignment (if pulling)',
                    'Inspect drive belts',
                ]),
                'priority' => 'critical',
                'season' => 'all',
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 250,
                'diy_possible' => true,
                'is_published' => true,
            ],

            // SEMI-ANNUALLY (6 MONTHS)
            [
                'title' => 'Semi-Annual Maintenance - Every 6 Months',
                'interval' => 'semi_annually',
                'mileage_interval' => 6000,
                'description' => 'Comprehensive maintenance every 6 months or 6,000 miles.',
                'tasks' => json_encode([
                    'Change engine oil and filter',
                    'Replace engine air filter',
                    'Replace cabin air filter',
                    'Inspect and clean fuel system',
                    'Check spark plugs condition',
                    'Inspect transmission fluid',
                    'Check differential fluid (if applicable)',
                    'Inspect cooling system',
                    'Check power steering fluid',
                    'Inspect all belts and hoses',
                    'Test battery and charging system',
                    'Inspect brakes thoroughly',
                    'Check wheel bearings',
                    'Rotate tires',
                    'Check wheel balance',
                ]),
                'priority' => 'critical',
                'season' => 'all',
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 400,
                'diy_possible' => false,
                'is_published' => true,
            ],

            // ANNUALLY
            [
                'title' => 'Annual Comprehensive Maintenance',
                'interval' => 'annually',
                'mileage_interval' => 12000,
                'description' => 'Complete annual inspection and maintenance - the most thorough service your vehicle needs.',
                'tasks' => json_encode([
                    'Full engine diagnostic scan',
                    'Change all fluids (oil, coolant, brake, transmission, differential)',
                    'Replace all filters (engine, cabin, fuel)',
                    'Inspect and possibly replace spark plugs',
                    'Replace spark plug wires/coils if needed',
                    'Flush cooling system',
                    'Service transmission',
                    'Inspect and service differential',
                    'Complete brake system service',
                    'Tire rotation and balancing',
                    'Wheel alignment check',
                    'Inspect entire suspension system',
                    'Inspect exhaust system',
                    'Replace wiper blades',
                    'Deep clean fuel injection system',
                    'Replace timing belt (if due by mileage)',
                    'Inspect and adjust valves (if needed)',
                    'Test all electrical systems',
                    'Check for recall notices',
                    'Update maintenance records',
                ]),
                'priority' => 'critical',
                'season' => 'all',
                'estimated_cost_min' => 500,
                'estimated_cost_max' => 1500,
                'diy_possible' => false,
                'is_published' => true,
            ],
        ];

        foreach ($schedules as $scheduleData) {
            MaintenanceSchedule::create($scheduleData);
        }
    }
}
