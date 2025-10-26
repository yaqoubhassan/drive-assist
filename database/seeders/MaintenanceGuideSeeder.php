<?php

namespace Database\Seeders;

use App\Models\MaintenanceGuide;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaintenanceGuideSeeder extends Seeder
{
    public function run(): void
    {
        $guides = [
            // OIL CHANGE
            [
                'title' => 'How to Change Your Engine Oil',
                'category' => 'fluid_check',
                'difficulty' => 'beginner',
                'estimated_time_minutes' => 30,
                'description' => 'Learn how to perform a complete engine oil change yourself. This comprehensive guide covers everything from draining old oil to selecting the right oil grade for your vehicle.',
                'tools_required' => json_encode([
                    'Socket wrench set',
                    'Oil filter wrench',
                    'Oil drain pan',
                    'Funnel',
                    'Jack and jack stands',
                    'Wheel chocks',
                    'Gloves',
                    'Rags or paper towels',
                ]),
                'materials_needed' => json_encode([
                    'Engine oil (check manual for type and quantity)',
                    'New oil filter',
                    'New drain plug gasket (if required)',
                ]),
                'steps' => json_encode([
                    [
                        'step_number' => 1,
                        'title' => 'Prepare Your Vehicle',
                        'description' => 'Run the engine for 2-3 minutes to warm the oil (makes it flow easier). Park on level ground, engage parking brake, and place wheel chocks. Let engine cool for 5-10 minutes.',
                    ],
                    [
                        'step_number' => 2,
                        'title' => 'Safely Raise the Vehicle',
                        'description' => 'Use a jack to lift the front of the vehicle. Secure it with jack stands - never work under a car supported only by a jack. Ensure stability before proceeding.',
                    ],
                    [
                        'step_number' => 3,
                        'title' => 'Locate and Remove Drain Plug',
                        'description' => 'Locate the oil drain plug at the bottom of the oil pan. Position drain pan underneath. Using the appropriate socket, carefully loosen and remove the drain plug. Let oil drain completely (5-10 minutes).',
                    ],
                    [
                        'step_number' => 4,
                        'title' => 'Replace Drain Plug',
                        'description' => 'Once oil has fully drained, wipe the drain plug and surrounding area clean. Replace the drain plug gasket if required. Hand-tighten the plug, then use a wrench to snug it (do not overtighten).',
                    ],
                    [
                        'step_number' => 5,
                        'title' => 'Remove Old Oil Filter',
                        'description' => 'Position drain pan under the oil filter. Use oil filter wrench to loosen and remove the filter (it will contain oil). Let drain completely. Clean the filter mounting surface.',
                    ],
                    [
                        'step_number' => 6,
                        'title' => 'Install New Oil Filter',
                        'description' => 'Dip your finger in new oil and lubricate the rubber gasket on the new filter. Hand-tighten the filter until the gasket contacts the mounting surface, then tighten an additional 3/4 turn. Do not use wrench.',
                    ],
                    [
                        'step_number' => 7,
                        'title' => 'Add New Engine Oil',
                        'description' => 'Lower the vehicle. Remove oil filler cap. Using a funnel, pour in the recommended amount of new oil (check manual). Replace filler cap.',
                    ],
                    [
                        'step_number' => 8,
                        'title' => 'Check Oil Level',
                        'description' => 'Start engine and let run for 30 seconds. Turn off and wait 1 minute. Check oil level with dipstick. Add more oil if needed. Check underneath for leaks.',
                    ],
                    [
                        'step_number' => 9,
                        'title' => 'Clean Up and Dispose Properly',
                        'description' => 'Clean tools and work area. Never pour used oil down drains or on ground. Store used oil in sealed container and take to recycling center or auto parts store.',
                    ],
                ]),
                'safety_warnings' => "• Always use jack stands - never work under a car supported only by a jack\n• Ensure engine is cool before working\n• Hot oil can cause burns\n• Wear safety glasses and gloves\n• Work in well-ventilated area\n• Keep oil away from hot exhaust components",
                'tips_and_tricks' => "• Change oil when engine is slightly warm (oil flows better)\n• Keep old oil filter box for recycling used oil\n• Take a photo before starting so you remember where everything goes\n• Check your manual for recommended oil grade and quantity\n• Consider upgrading to synthetic oil for better protection",
                'estimated_cost_min' => 30,
                'estimated_cost_max' => 60,
                'video_url' => null,
                'view_count' => 5420,
                'helpful_count' => 342,
                'is_popular' => true,
                'is_published' => true,
            ],

            // AIR FILTER
            [
                'title' => 'Replace Your Engine Air Filter',
                'category' => 'filter_replacement',
                'difficulty' => 'beginner',
                'estimated_time_minutes' => 10,
                'description' => 'One of the easiest DIY maintenance tasks. Replacing your air filter improves engine performance and fuel economy. Most vehicles allow access without any tools.',
                'tools_required' => json_encode([
                    'Screwdriver (sometimes not needed)',
                    'Clean cloth',
                ]),
                'materials_needed' => json_encode([
                    'New air filter (check manual for correct part number)',
                ]),
                'steps' => json_encode([
                    [
                        'step_number' => 1,
                        'title' => 'Locate Air Filter Box',
                        'description' => 'Open hood. Locate the air filter housing - usually a black plastic box near the engine. Consult your manual if unsure.',
                    ],
                    [
                        'step_number' => 2,
                        'title' => 'Open the Housing',
                        'description' => 'Release clips or remove screws holding the housing cover. Some have metal clips, others may require a screwdriver. Carefully lift off the cover.',
                    ],
                    [
                        'step_number' => 3,
                        'title' => 'Remove Old Filter',
                        'description' => 'Lift out the old air filter. Take note of its orientation. Inspect it - if it\'s dark with debris, it definitely needs replacing.',
                    ],
                    [
                        'step_number' => 4,
                        'title' => 'Clean the Housing',
                        'description' => 'Wipe out the inside of the air filter box with a clean, dry cloth. Remove any leaves, debris, or dust.',
                    ],
                    [
                        'step_number' => 5,
                        'title' => 'Install New Filter',
                        'description' => 'Place the new filter in the same orientation as the old one. Ensure it fits snugly and seals properly around the edges.',
                    ],
                    [
                        'step_number' => 6,
                        'title' => 'Reassemble Housing',
                        'description' => 'Replace the housing cover. Secure all clips or screws. Ensure everything is tight - air leaks reduce performance.',
                    ],
                ]),
                'safety_warnings' => "• Ensure engine is off and cool\n• Do not touch any hot components\n• Make sure all clips are securely fastened",
                'tips_and_tricks' => "• Replace air filter every 12,000-15,000 miles or annually\n• Check filter more frequently if driving in dusty conditions\n• A clogged filter reduces fuel economy by up to 10%\n• Take a photo before removal to remember orientation\n• Some filters can be cleaned and reused (check manufacturer)",
                'estimated_cost_min' => 15,
                'estimated_cost_max' => 40,
                'video_url' => null,
                'view_count' => 3210,
                'helpful_count' => 245,
                'is_popular' => true,
                'is_published' => true,
            ],

            // TIRE ROTATION
            [
                'title' => 'How to Rotate Your Tires',
                'category' => 'tire_maintenance',
                'difficulty' => 'intermediate',
                'estimated_time_minutes' => 45,
                'description' => 'Regular tire rotation extends tire life and ensures even wear. Learn the correct rotation pattern for your vehicle and how to safely perform this important maintenance task.',
                'tools_required' => json_encode([
                    'Car jack',
                    'Jack stands (4)',
                    'Lug wrench or impact wrench',
                    'Torque wrench',
                    'Wheel chocks',
                    'Gloves',
                    'Tire pressure gauge',
                ]),
                'materials_needed' => json_encode([
                    'None required',
                ]),
                'steps' => json_encode([
                    [
                        'step_number' => 1,
                        'title' => 'Determine Rotation Pattern',
                        'description' => 'Check your manual for the recommended pattern. For FWD: front tires to rear (same side), rear tires cross to front. For RWD: rear tires forward (same side), front tires cross to rear. For AWD: X-pattern (all tires cross).',
                    ],
                    [
                        'step_number' => 2,
                        'title' => 'Prepare Vehicle',
                        'description' => 'Park on level ground. Engage parking brake. Place wheel chocks behind rear wheels. Loosen (don\'t remove) lug nuts on all four wheels while vehicle is still on ground.',
                    ],
                    [
                        'step_number' => 3,
                        'title' => 'Lift and Secure Vehicle',
                        'description' => 'Lift one corner at a time using jack. Place jack stand under frame. Repeat for all four corners until entire vehicle is safely supported on jack stands.',
                    ],
                    [
                        'step_number' => 4,
                        'title' => 'Remove All Wheels',
                        'description' => 'Completely remove lug nuts from all four wheels. Mark each wheel with chalk to track position (FL, FR, RL, RR). Carefully remove all four wheels.',
                    ],
                    [
                        'step_number' => 5,
                        'title' => 'Rotate According to Pattern',
                        'description' => 'Move wheels to their new positions according to the rotation pattern for your drivetrain. Hand-thread lug nuts onto wheel studs.',
                    ],
                    [
                        'step_number' => 6,
                        'title' => 'Lower Vehicle and Torque',
                        'description' => 'Lower vehicle until wheels just touch ground but aren\'t bearing full weight. Using torque wrench, tighten lug nuts to manufacturer spec (usually 80-100 ft-lbs) in star pattern. Fully lower vehicle.',
                    ],
                    [
                        'step_number' => 7,
                        'title' => 'Final Check',
                        'description' => 'Once vehicle is on ground, do final tighten of all lug nuts in star pattern. Check tire pressure on all tires and adjust as needed.',
                    ],
                ]),
                'safety_warnings' => "• Never work under vehicle supported only by jack\n• Use all four jack stands\n• Ensure vehicle is on level, solid surface\n• Use wheel chocks\n• Don't over-torque lug nuts\n• Wear safety glasses when working with wheels",
                'tips_and_tricks' => "• Rotate tires every 5,000-7,500 miles\n• Check tire tread depth while wheels are off\n• Inspect brake pads and rotors during rotation\n• Good time to check for tire damage\n• Keep rotation records to track tire wear patterns\n• Consider professional rotation if you have directional tires",
                'estimated_cost_min' => 0,
                'estimated_cost_max' => 0,
                'video_url' => null,
                'view_count' => 2840,
                'helpful_count' => 198,
                'is_popular' => true,
                'is_published' => true,
            ],

            // BATTERY MAINTENANCE
            [
                'title' => 'Clean and Maintain Your Car Battery',
                'category' => 'electrical',
                'difficulty' => 'beginner',
                'estimated_time_minutes' => 20,
                'description' => 'Corrosion on battery terminals can prevent your car from starting. Learn how to safely clean and maintain your battery to ensure reliable performance.',
                'tools_required' => json_encode([
                    'Wrench or socket set',
                    'Wire brush or battery terminal cleaner',
                    'Baking soda',
                    'Water',
                    'Small container',
                    'Gloves',
                    'Safety glasses',
                    'Old toothbrush',
                ]),
                'materials_needed' => json_encode([
                    'Baking soda',
                    'Battery terminal protectant spray',
                    'Dielectric grease (optional)',
                ]),
                'steps' => json_encode([
                    [
                        'step_number' => 1,
                        'title' => 'Safety First',
                        'description' => 'Turn off engine and remove keys. Wear safety glasses and gloves. Open hood and locate battery. Identify positive (+) and negative (-) terminals.',
                    ],
                    [
                        'step_number' => 2,
                        'title' => 'Disconnect Terminals',
                        'description' => 'ALWAYS disconnect negative (-) terminal first to prevent sparks. Loosen nut with wrench and carefully lift cable off terminal. Then disconnect positive (+) terminal the same way.',
                    ],
                    [
                        'step_number' => 3,
                        'title' => 'Inspect Battery',
                        'description' => 'Check battery case for cracks or damage. Look for corrosion (white/blue crusty substance) on terminals and cable ends. Check date code to determine battery age.',
                    ],
                    [
                        'step_number' => 4,
                        'title' => 'Make Cleaning Solution',
                        'description' => 'Mix 1 tablespoon baking soda with 1 cup of water in container. This neutralizes battery acid (which causes corrosion).',
                    ],
                    [
                        'step_number' => 5,
                        'title' => 'Clean Terminals',
                        'description' => 'Dip toothbrush in baking soda solution and scrub battery terminals. Use wire brush to clean cable ends. The fizzing means it\'s working - that\'s the acid being neutralized.',
                    ],
                    [
                        'step_number' => 6,
                        'title' => 'Rinse and Dry',
                        'description' => 'Spray or wipe terminals with clean water to remove baking soda residue. Dry thoroughly with cloth - moisture can cause electrical issues.',
                    ],
                    [
                        'step_number' => 7,
                        'title' => 'Reconnect Battery',
                        'description' => 'Reconnect positive (+) terminal first, then negative (-). Tighten securely but don\'t overtighten. Apply terminal protectant spray or dielectric grease to prevent future corrosion.',
                    ],
                ]),
                'safety_warnings' => "• Always wear safety glasses - battery acid can splash\n• Remove jewelry and metal objects\n• Never touch both terminals simultaneously\n• Work in well-ventilated area\n• Battery acid is corrosive - wash hands after\n• Don't smoke or create sparks near battery\n• If acid contacts skin, rinse with water immediately",
                'tips_and_tricks' => "• Clean terminals every 6 months to prevent corrosion\n• If corrosion is severe, battery may need replacement\n• Check for loose connections while cleaning\n• Most batteries last 3-5 years\n• Have battery tested free at most auto parts stores\n• Park in garage during extreme temperatures to extend battery life\n• Consider trickle charger if car sits unused for extended periods",
                'estimated_cost_min' => 5,
                'estimated_cost_max' => 15,
                'video_url' => null,
                'view_count' => 2650,
                'helpful_count' => 187,
                'is_popular' => false,
                'is_published' => true,
            ],

            // WINDSHIELD WIPERS
            [
                'title' => 'Replace Windshield Wiper Blades',
                'category' => 'general',
                'difficulty' => 'beginner',
                'estimated_time_minutes' => 10,
                'description' => 'Worn wiper blades reduce visibility and can scratch your windshield. Learn how to replace them quickly - it\'s one of the easiest maintenance tasks you can do.',
                'tools_required' => json_encode([
                    'No tools required (usually)',
                    'Cloth or paper towels',
                ]),
                'materials_needed' => json_encode([
                    'New wiper blades (measure or check manual for size)',
                ]),
                'steps' => json_encode([
                    [
                        'step_number' => 1,
                        'title' => 'Measure Existing Blades',
                        'description' => 'Measure your current wiper blades or check your manual for correct size. Driver and passenger blades are often different sizes. Note the attachment type.',
                    ],
                    [
                        'step_number' => 2,
                        'title' => 'Lift Wiper Arm',
                        'description' => 'Pull wiper arm away from windshield until it stays in raised position. Place a cloth on windshield beneath to protect it in case arm snaps back.',
                    ],
                    [
                        'step_number' => 3,
                        'title' => 'Remove Old Blade',
                        'description' => 'Locate the release tab on blade (usually where blade meets arm). Press tab while pulling blade downward. Some blades have buttons or clips - consult packaging if unsure.',
                    ],
                    [
                        'step_number' => 4,
                        'title' => 'Attach New Blade',
                        'description' => 'Slide new blade onto arm until you hear it click into place. Make sure connection is secure - tug gently to test.',
                    ],
                    [
                        'step_number' => 5,
                        'title' => 'Lower Arm Carefully',
                        'description' => 'Gently lower wiper arm back to windshield. Do not let it snap down - it could crack the windshield.',
                    ],
                    [
                        'step_number' => 6,
                        'title' => 'Repeat and Test',
                        'description' => 'Repeat process for other blade(s). Turn on wipers to test. They should wipe smoothly without streaking or chattering.',
                    ],
                ]),
                'safety_warnings' => "• Be careful not to scratch windshield with metal arm\n• Don't let wiper arm snap back onto glass\n• Replace both blades at same time for even wear",
                'tips_and_tricks' => "• Replace wipers every 6-12 months\n• Replace immediately if streaking, skipping, or making noise\n• Clean blades monthly with glass cleaner\n• Lift blades away from windshield during ice/snow\n• Consider beam-style blades for better performance\n• Keep old blades for emergency backup in trunk",
                'estimated_cost_min' => 15,
                'estimated_cost_max' => 40,
                'video_url' => null,
                'view_count' => 1920,
                'helpful_count' => 143,
                'is_popular' => false,
                'is_published' => true,
            ],
        ];

        foreach ($guides as $guideData) {
            MaintenanceGuide::create($guideData);
        }
    }
}
