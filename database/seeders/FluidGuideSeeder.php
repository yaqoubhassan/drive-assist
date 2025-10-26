<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FluidGuide;

class FluidGuideSeeder extends Seeder
{
    public function run(): void
    {
        $fluids = [
            // ENGINE OIL
            [
                'name' => 'Engine Oil',
                'fluid_type' => '5W-30, 5W-20, 10W-30 (varies by vehicle)',
                'description' => 'Engine oil lubricates moving parts, reduces friction, cleans, cools, and protects your engine from wear.',
                'function' => 'Lubricates engine components, reduces friction and heat, cleans by suspending dirt particles, prevents corrosion, and seals gaps between pistons and cylinder walls.',
                'check_procedure' => "1. Park on level ground and turn off engine\n2. Wait 5-10 minutes for oil to settle\n3. Locate and remove dipstick (usually has yellow/orange handle)\n4. Wipe dipstick clean with cloth\n5. Reinsert dipstick fully\n6. Remove again and check oil level\n7. Oil should be between MIN and MAX marks\n8. Check oil color - should be amber/brown, not black\n9. Reinsert dipstick when done",
                'change_procedure' => "See full 'How to Change Your Engine Oil' guide. Change oil every 3,000-7,500 miles depending on oil type (conventional vs synthetic) and driving conditions.",
                'check_interval_miles' => 1000,
                'check_interval_months' => 1,
                'change_interval_miles' => 5000,
                'change_interval_months' => 6,
                'warning_signs' => "• Oil level below MIN mark\n• Oil is dark black or gritty\n• Oil smells burnt\n• Check engine light on\n• Engine running rough or making noise\n• Smoke from exhaust\n• Low oil pressure warning light",
                'typical_capacity_min' => 4.0,
                'typical_capacity_max' => 6.0,
                'estimated_cost_min' => 35,
                'estimated_cost_max' => 75,
                'color_when_good' => 'Amber or light brown',
                'color_when_bad' => 'Dark black, milky brown (coolant contamination)',
                'icon' => '🛢️',
                'is_critical' => true,
                'is_published' => true,
            ],

            // COOLANT
            [
                'name' => 'Coolant (Antifreeze)',
                'fluid_type' => 'Ethylene glycol or Propylene glycol based',
                'description' => 'Coolant regulates engine temperature, preventing overheating in summer and freezing in winter.',
                'function' => 'Absorbs heat from engine, transfers it to radiator, prevents corrosion in cooling system, lubricates water pump, and prevents freezing in cold weather.',
                'check_procedure' => "⚠️ NEVER CHECK HOT COOLANT - SEVERE BURN RISK\n\n1. Ensure engine is completely cool (wait at least 1 hour)\n2. Locate coolant reservoir (usually white/translucent tank)\n3. Check level against MIN/MAX marks on side\n4. Level should be between marks when cold\n5. Look at coolant color through reservoir\n6. Check for debris or oil contamination\n7. If need to open radiator cap, wait until engine is cold, cover cap with cloth, turn slowly to release pressure",
                'change_procedure' => "Coolant should be flushed and replaced every 30,000-50,000 miles or every 3-5 years. This requires draining entire system and is best done by professional. Never mix different coolant types.",
                'check_interval_miles' => 3000,
                'check_interval_months' => 3,
                'change_interval_miles' => 30000,
                'change_interval_months' => 36,
                'warning_signs' => "• Coolant level consistently low\n• Engine overheating\n• Sweet smell from engine\n• White smoke from exhaust\n• Temperature gauge reading high\n• Coolant puddles under car\n• Coolant is rusty or has particles\n• Heater not working properly",
                'typical_capacity_min' => 8.0,
                'typical_capacity_max' => 12.0,
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 150,
                'color_when_good' => 'Bright green, orange, pink, or blue (depends on type)',
                'color_when_bad' => 'Rusty brown, murky, or has particles/sludge',
                'icon' => '🌡️',
                'is_critical' => true,
                'is_published' => true,
            ],

            // BRAKE FLUID
            [
                'name' => 'Brake Fluid',
                'fluid_type' => 'DOT 3, DOT 4, or DOT 5.1 (check manual)',
                'description' => 'Hydraulic fluid that transfers force from brake pedal to brake calipers, allowing you to stop your vehicle.',
                'function' => 'Transmits pressure from brake pedal through brake lines to activate calipers/wheel cylinders. Must withstand high heat and pressure without boiling or corroding brake components.',
                'check_procedure' => "1. Locate brake fluid reservoir (usually on firewall, driver side)\n2. Clean area around reservoir cap\n3. Check level through translucent reservoir walls\n4. Level should be between MIN and MAX\n5. If need better view, carefully remove cap\n6. Check fluid color - should be clear to light amber\n7. Replace cap securely\n8. If level is low, have brakes inspected - may indicate wear or leak",
                'change_procedure' => "Brake fluid should be flushed every 2-3 years or 24,000-36,000 miles. Brake fluid absorbs moisture over time, reducing effectiveness and causing corrosion. This service requires special equipment and should be done by professional.",
                'check_interval_miles' => 6000,
                'check_interval_months' => 6,
                'change_interval_miles' => 24000,
                'change_interval_months' => 24,
                'warning_signs' => "• Fluid level consistently low\n• Brake pedal feels spongy or soft\n• Brake pedal sinks to floor\n• Brake warning light on\n• Fluid is dark or murky\n• Longer stopping distances\n• Brake pedal requires more pressure\n• Grinding or squealing when braking",
                'typical_capacity_min' => 0.5,
                'typical_capacity_max' => 1.0,
                'estimated_cost_min' => 80,
                'estimated_cost_max' => 130,
                'color_when_good' => 'Clear to light amber',
                'color_when_bad' => 'Dark brown or black',
                'icon' => '🛑',
                'is_critical' => true,
                'is_published' => true,
            ],

            // TRANSMISSION FLUID
            [
                'name' => 'Transmission Fluid (ATF)',
                'fluid_type' => 'Dexron, Mercon, or vehicle-specific (check manual)',
                'description' => 'Lubricates transmission gears, provides hydraulic pressure for gear changes, and cools transmission components.',
                'function' => 'Lubricates gears and bearings, transmits power through torque converter, provides hydraulic pressure for shifting, cools transmission, and cleans internal components.',
                'check_procedure' => "⚠️ Check procedure varies by vehicle - consult manual\n\nTypical process:\n1. Engine should be warm and running (some vehicles: off)\n2. Park on level ground\n3. Set parking brake\n4. Locate dipstick (usually red handle) or check plug\n5. If dipstick: remove, wipe clean, reinsert, remove again\n6. Check level - should be in HOT range when warm\n7. Check color and smell\n8. Some newer vehicles have no dipstick - must be checked underneath\n\nNote: Many modern transmissions are 'sealed' and require professional checking.",
                'change_procedure' => "Change intervals vary widely:\n• Traditional: every 30,000-60,000 miles\n• Synthetic: every 60,000-100,000 miles\n• Some manufacturers claim 'lifetime' fluid (not truly lifetime)\n\nService options:\n• Drain and refill (replaces ~50% of fluid)\n• Complete flush (replaces all fluid, more thorough)\n\nAlways use correct fluid type for your transmission.",
                'check_interval_miles' => 6000,
                'check_interval_months' => 6,
                'change_interval_miles' => 60000,
                'change_interval_months' => 48,
                'warning_signs' => "• Fluid is dark brown or black\n• Burnt smell\n• Metal particles in fluid\n• Shifting delays or roughness\n• Slipping gears\n• Unusual transmission noises\n• Fluid leaks (red fluid under car)\n• Check engine light",
                'typical_capacity_min' => 8.0,
                'typical_capacity_max' => 13.0,
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 300,
                'color_when_good' => 'Bright red or pink',
                'color_when_bad' => 'Dark brown or black, burnt smell',
                'icon' => '⚙️',
                'is_critical' => true,
                'is_published' => true,
            ],

            // POWER STEERING FLUID
            [
                'name' => 'Power Steering Fluid',
                'fluid_type' => 'ATF or specific power steering fluid',
                'description' => 'Hydraulic fluid that assists in turning the steering wheel, making it easier to maneuver your vehicle.',
                'function' => 'Transmits pressure from power steering pump to steering rack/gearbox, lubricates components, and reduces wear on steering system.',
                'check_procedure' => "1. Park on level ground, engine off (some cars: running)\n2. Locate power steering reservoir (usually has steering wheel symbol)\n3. Clean around cap\n4. Check level - some have transparent reservoir, others require opening cap\n5. Level should be between MIN and MAX (cold or hot marks)\n6. Check fluid color and condition\n7. If adding fluid, use exact type specified in manual\n8. Don't overfill\n\nNote: Many newer cars have electric power steering (no fluid)",
                'change_procedure' => "Not typically a scheduled maintenance item. Change if:\n• Fluid is dark or has debris\n• System has been opened for repairs\n• Fluid is contaminated\n• Every 50,000-75,000 miles as preventive measure\n\nService involves flushing old fluid and replacing with new.",
                'check_interval_miles' => 3000,
                'check_interval_months' => 3,
                'change_interval_miles' => 50000,
                'change_interval_months' => 60,
                'warning_signs' => "• Difficult or stiff steering\n• Whining noise when turning\n• Groaning or squealing sounds\n• Fluid level consistently low\n• Fluid is dark or murky\n• Jerky steering response\n• Burning smell\n• Fluid leaks",
                'typical_capacity_min' => 0.5,
                'typical_capacity_max' => 1.0,
                'estimated_cost_min' => 80,
                'estimated_cost_max' => 150,
                'color_when_good' => 'Clear, red, or amber',
                'color_when_bad' => 'Dark brown or black',
                'icon' => '🔄',
                'is_critical' => false,
                'is_published' => true,
            ],

            // WINDSHIELD WASHER FLUID
            [
                'name' => 'Windshield Washer Fluid',
                'fluid_type' => 'Windshield washer fluid (various formulations)',
                'description' => 'Cleaning solution for windshield that removes dirt, bugs, and grime for clear visibility.',
                'function' => 'Cleans windshield when sprayed through washer jets, helps wiper blades remove debris, prevents freezing in cold weather (if winter formula), and improves visibility.',
                'check_procedure' => "1. Locate washer fluid reservoir (usually blue/white cap with windshield/water symbol)\n2. Reservoir is typically translucent - check level visually\n3. If low, simply add washer fluid to fill line\n4. Don't use plain water - won't clean well and can freeze\n5. Use winter formula in cold climates\n6. Cap securely after filling",
                'change_procedure' => "Doesn't need changing - just refill when low. In spring/fall, you might drain and switch between summer and winter formulas.",
                'check_interval_miles' => 1000,
                'check_interval_months' => 1,
                'change_interval_miles' => null,
                'change_interval_months' => null,
                'warning_signs' => "• Washer fluid low light on\n• No fluid sprays when activated\n• Weak spray pattern\n• Washer jets frozen (in winter)\n• Fluid leaks from reservoir",
                'typical_capacity_min' => 3.0,
                'typical_capacity_max' => 5.0,
                'estimated_cost_min' => 3,
                'estimated_cost_max' => 8,
                'color_when_good' => 'Blue, pink, or green (depending on brand)',
                'color_when_bad' => 'N/A - doesn\'t degrade',
                'icon' => '💧',
                'is_critical' => false,
                'is_published' => true,
            ],
        ];

        foreach ($fluids as $fluidData) {
            FluidGuide::create($fluidData);
        }
    }
}
