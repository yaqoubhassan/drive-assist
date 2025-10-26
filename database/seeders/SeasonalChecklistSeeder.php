<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SeasonalChecklist;

class SeasonalChecklistSeeder extends Seeder
{
    public function run(): void
    {
        $checklists = [
            // SPRING
            [
                'title' => 'Spring Vehicle Preparation Checklist',
                'season' => 'spring',
                'description' => 'Prepare your vehicle for warmer weather after winter\'s harsh conditions. Address winter damage and get ready for spring road trips.',
                'checklist_items' => json_encode([
                    [
                        'item' => 'Thoroughly wash and wax entire vehicle',
                        'description' => 'Remove road salt and winter grime that can cause rust',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Clean undercarriage',
                        'description' => 'Remove salt and debris from underneath vehicle',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Inspect and clean battery terminals',
                        'description' => 'Cold weather is hard on batteries',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Check tire pressure and tread',
                        'description' => 'Adjust for warmer temps, rotate if needed',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Switch to summer wiper blades',
                        'description' => 'Replace winter blades if used',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Inspect brake system',
                        'description' => 'Check for salt damage and pad wear',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Replace cabin air filter',
                        'description' => 'Improve AC performance and air quality for allergy season',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Test air conditioning system',
                        'description' => 'Make sure it works before hot weather hits',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Check all fluid levels',
                        'description' => 'Top off any fluids that ran low in winter',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Inspect belts and hoses',
                        'description' => 'Look for winter cracking or damage',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Deep clean interior',
                        'description' => 'Remove winter floor mats, vacuum thoroughly',
                        'priority' => 'low',
                    ],
                    [
                        'item' => 'Check alignment if hitting potholes',
                        'description' => 'Potholes common in spring can throw off alignment',
                        'priority' => 'medium',
                    ],
                ]),
                'why_important' => 'Spring maintenance addresses damage from winter conditions (salt, cold, ice) and prepares your vehicle for warm weather driving. Road salt can cause rust if not removed, and systems stressed by cold need inspection.',
                'additional_tips' => "• Don't wait until summer to test AC\n• Address any new noises or vibrations from winter driving\n• Check for rust spots early before they spread\n• Consider paint touch-up for chips from winter road debris\n• Inspect suspension after rough winter roads",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 400,
                'estimated_time_hours' => 3,
                'is_published' => true,
            ],

            // SUMMER
            [
                'title' => 'Summer Vehicle Preparation Checklist',
                'season' => 'summer',
                'description' => 'Prepare your vehicle for hot weather and summer road trips. Heat is hard on vehicles - proper preparation prevents breakdowns.',
                'checklist_items' => json_encode([
                    [
                        'item' => 'Check cooling system thoroughly',
                        'description' => 'Test coolant strength, check for leaks, inspect hoses',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Test air conditioning',
                        'description' => 'Ensure AC is blowing cold before peak summer heat',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Inspect battery',
                        'description' => 'Heat is harder on batteries than cold - test and clean',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Check tire pressure',
                        'description' => 'Heat causes air to expand - may need to reduce pressure',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Inspect tire condition',
                        'description' => 'Hot pavement can cause blowouts on worn tires',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Top off all fluids',
                        'description' => 'Engine works harder in heat - needs proper fluid levels',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Replace engine air filter',
                        'description' => 'Dusty summer conditions can clog filter faster',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Check belts and hoses',
                        'description' => 'Heat causes rubber to crack and fail',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Clean or replace cabin air filter',
                        'description' => 'Improves AC efficiency and air quality',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Wax and protect paint',
                        'description' => 'UV protection against intense summer sun',
                        'priority' => 'low',
                    ],
                    [
                        'item' => 'Check wiper blades',
                        'description' => 'Summer storms require good wipers',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Prepare emergency kit',
                        'description' => 'Include water, sunscreen, first aid for breakdowns',
                        'priority' => 'medium',
                    ],
                ]),
                'why_important' => 'Extreme heat is one of the hardest conditions on vehicles. Cooling systems work overtime, batteries fail more frequently in heat, tires are prone to blowouts, and AC systems can fail. Proper preparation prevents getting stranded in dangerous heat.',
                'additional_tips' => "• Park in shade when possible\n• Use sunshade for windshield\n• Never leave children or pets in hot car\n• Check coolant level more frequently\n• Carry extra water in trunk\n• Monitor temperature gauge closely on hot days\n• Plan for heavy traffic generating more heat",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 500,
                'estimated_time_hours' => 3,
                'is_published' => true,
            ],

            // FALL
            [
                'title' => 'Fall Vehicle Preparation Checklist',
                'season' => 'fall',
                'description' => 'Prepare your vehicle for cooler weather and get ready for winter. Fall is the best time to address issues before harsh winter conditions.',
                'checklist_items' => json_encode([
                    [
                        'item' => 'Check battery and charging system',
                        'description' => 'Cold weather is coming - weak batteries will fail',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Inspect tire tread and pressure',
                        'description' => 'Consider winter tires if in cold climate',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Test heater and defrost',
                        'description' => 'Make sure heater works before you need it',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Replace wiper blades',
                        'description' => 'Fall rain requires good visibility',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Switch to winter windshield fluid',
                        'description' => 'Won\'t freeze in cold temperatures',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Check antifreeze strength',
                        'description' => 'Must protect to lowest expected temperature',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Inspect belts and hoses',
                        'description' => 'Cold can cause cracking - replace if questionable',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Clean leaves from cowl and drains',
                        'description' => 'Prevent water damage and musty smells',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Lubricate door locks and hinges',
                        'description' => 'Prevent freezing in cold weather',
                        'priority' => 'low',
                    ],
                    [
                        'item' => 'Check all lights',
                        'description' => 'Days getting shorter - need all lights working',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Wax exterior',
                        'description' => 'Protect paint from coming salt and harsh weather',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Prepare winter emergency kit',
                        'description' => 'Include blanket, ice scraper, sand/salt, flashlight',
                        'priority' => 'high',
                    ],
                ]),
                'why_important' => 'Fall maintenance prevents winter breakdowns. Cold weather is extremely hard on vehicles - batteries fail, fluids thicken, rubber components crack. Addressing issues in mild fall weather is easier and prevents being stranded in winter cold.',
                'additional_tips' => "• Have winter tires mounted by first freeze\n• Add fuel stabilizer if storing vehicle for winter\n• Check exhaust system for leaks before running heat\n• Keep gas tank at least half full to prevent line freeze\n• Practice driving in slippery conditions in safe area\n• Review winter driving techniques",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 600,
                'estimated_time_hours' => 4,
                'is_published' => true,
            ],

            // WINTER
            [
                'title' => 'Winter Vehicle Preparation Checklist',
                'season' => 'winter',
                'description' => 'Essential maintenance and preparations for safe winter driving. Cold weather and road conditions create unique challenges.',
                'checklist_items' => json_encode([
                    [
                        'item' => 'Install winter tires (if applicable)',
                        'description' => 'Essential for safety in snow and ice',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Test battery fully',
                        'description' => 'Cold reduces battery power by 35% or more',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Check antifreeze protection level',
                        'description' => 'Must protect to -35°F or colder',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Switch to winter oil (if needed)',
                        'description' => '5W-30 or 0W-40 flows better in cold',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Install winter wiper blades',
                        'description' => 'Heavy-duty blades resist ice buildup',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Fill with winter windshield fluid',
                        'description' => 'Rated to -25°F or colder',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Check tire pressure weekly',
                        'description' => 'Cold causes pressure to drop significantly',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Keep gas tank at least half full',
                        'description' => 'Prevents gas line freeze and provides weight for traction',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Pack winter emergency kit',
                        'description' => 'Blankets, food, water, flashlight, jumper cables, sand/salt, shovel',
                        'priority' => 'critical',
                    ],
                    [
                        'item' => 'Apply rust protection',
                        'description' => 'Undercoat spray protects from road salt',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Lubricate locks',
                        'description' => 'Graphite lubricant prevents freezing',
                        'priority' => 'medium',
                    ],
                    [
                        'item' => 'Check 4WD/AWD system',
                        'description' => 'Test before you need it in snow',
                        'priority' => 'high',
                    ],
                    [
                        'item' => 'Treat door seals',
                        'description' => 'Silicone spray prevents freezing shut',
                        'priority' => 'low',
                    ],
                ]),
                'why_important' => 'Winter is the most demanding season for vehicles and the most dangerous for drivers. Cold temperatures reduce battery power, thicken fluids, and make rubber brittle. Snow and ice create hazardous conditions. Proper preparation is literally life-saving.',
                'additional_tips' => "• Never warm up car in enclosed space (carbon monoxide)\n• Brush ALL snow off car before driving (safety and legal)\n• Clear ice from lights and windows completely\n• Practice stopping and turning in empty parking lot\n• Allow 2-3x normal following distance\n• Accelerate and brake gently on ice\n• Know how your ABS feels and sounds\n• Keep phone charged and tell someone your route",
                'estimated_cost_min' => 300,
                'estimated_cost_max' => 1000,
                'estimated_time_hours' => 4,
                'is_published' => true,
            ],
        ];

        foreach ($checklists as $checklistData) {
            SeasonalChecklist::create($checklistData);
        }
    }
}
