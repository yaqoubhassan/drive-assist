<?php

namespace Database\Seeders;

use App\Models\CarIssue;
use Illuminate\Database\Seeder;

class CarIssueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $issues = [
            [
                'title' => 'Check Engine Light On',
                'category' => 'engine',
                'severity' => 'medium',
                'symptoms' => "• Check engine light is illuminated on dashboard\n• May be solid or flashing\n• No other obvious symptoms initially\n• Possible decrease in fuel efficiency",
                'description' => 'The check engine light (CEL) is one of the most common warning indicators. It can indicate anything from a loose gas cap to a serious engine malfunction. The light is triggered when the engine control module (ECM) detects an issue with the emissions system or engine performance.',
                'possible_causes' => "1. Loose or damaged gas cap\n2. Faulty oxygen sensor\n3. Catalytic converter failure\n4. Mass airflow sensor malfunction\n5. Spark plug or ignition coil issues\n6. Vacuum leak\n7. Exhaust gas recirculation (EGR) valve problem",
                'diy_solution' => "Step 1: Check and tighten your gas cap. If it's loose or damaged, replace it.\nStep 2: Purchase an OBD-II scanner (available at auto parts stores) to read the diagnostic trouble code.\nStep 3: Look up the code online to understand the specific issue.\nStep 4: If it's a simple issue (like gas cap), the light should turn off after a few drive cycles.\n\nNote: If the light is flashing, this indicates a serious problem. Do not attempt DIY repair - seek professional help immediately.",
                'when_to_call_expert' => "• Light is flashing (indicates serious misfire)\n• Light is accompanied by strange noises, smoke, or loss of power\n• You've tried basic fixes (gas cap) but light persists\n• Diagnostic code indicates major component failure\n• You don't have the tools or knowledge to diagnose further",
                'estimated_cost_min' => 50,
                'estimated_cost_max' => 1500,
                'is_popular' => true,
            ],
            [
                'title' => 'Squeaking or Grinding Brakes',
                'category' => 'brakes',
                'severity' => 'high',
                'symptoms' => "• High-pitched squealing when braking\n• Grinding or scraping noise\n• Reduced braking effectiveness\n• Vibration in brake pedal\n• Brake warning light may be on",
                'description' => 'Squeaking or grinding brakes are serious safety concerns that should not be ignored. Squeaking often indicates worn brake pads reaching their wear indicators, while grinding means the pads are completely worn and metal is contacting metal, potentially damaging rotors.',
                'possible_causes' => "1. Worn brake pads (most common)\n2. Damaged or warped brake rotors\n3. Debris caught in brake assembly\n4. Lack of lubrication on brake components\n5. Worn brake hardware\n6. Moisture on brake components (temporary)\n7. Brake pad material glazing",
                'diy_solution' => "Important: Brake work requires specific knowledge and tools. Only attempt if you have experience.\n\nBasic Inspection:\nStep 1: Safely jack up the vehicle and remove wheels\nStep 2: Visually inspect brake pads through caliper - pads should be at least 1/4 inch thick\nStep 3: Check rotors for deep grooves or damage\nStep 4: If pads are thin or rotors damaged, they need replacement\n\nNote: If you hear grinding, stop driving immediately and have vehicle towed to a mechanic.",
                'when_to_call_expert' => "• You hear grinding noises (immediate attention required)\n• Brake pedal feels soft or spongy\n• Vehicle pulls to one side when braking\n• You lack experience with brake repairs\n• Brake warning light is illuminated\n• Any uncertainty about brake safety",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 800,
                'is_popular' => true,
            ],
            [
                'title' => 'Dead Battery / Car Won\'t Start',
                'category' => 'electrical',
                'severity' => 'medium',
                'symptoms' => "• Engine won't crank or cranks slowly\n• Clicking sound when turning key\n• Dashboard lights dim or don't illuminate\n• Interior lights weak or won't turn on\n• Electrical accessories not working",
                'description' => 'A dead battery is one of the most common car problems. Batteries typically last 3-5 years and can die due to age, extreme temperatures, leaving lights on, or alternator failure. Modern vehicles\' electrical demands can quickly drain a weak battery.',
                'possible_causes' => "1. Old battery (past its lifespan)\n2. Lights or accessories left on\n3. Faulty alternator not charging battery\n4. Parasitic draw from electrical component\n5. Corroded or loose battery terminals\n6. Extreme cold weather\n7. Short trips not allowing full charge",
                'diy_solution' => "Jump Start Procedure:\nStep 1: Get jumper cables and a working vehicle\nStep 2: Position vehicles close, engines off\nStep 3: Connect red cable to dead battery positive (+)\nStep 4: Connect other red cable end to working battery positive (+)\nStep 5: Connect black cable to working battery negative (-)\nStep 6: Connect other black cable to unpainted metal on dead car (not battery)\nStep 7: Start working vehicle, wait 2-3 minutes\nStep 8: Try starting dead vehicle\nStep 9: Once started, remove cables in reverse order\nStep 10: Drive for 20+ minutes to recharge battery\n\nBattery Testing:\n• Most auto parts stores will test your battery for free\n• If battery is old or tests bad, replace it\n• Clean corroded terminals with baking soda solution",
                'when_to_call_expert' => "• You don't have jumper cables or another vehicle\n• Battery repeatedly dies (may indicate alternator problem)\n• Battery is swollen or leaking\n• You're uncomfortable performing jump start\n• Car won't stay running after jump start\n• Unusual burning smell near battery",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 400,
                'is_popular' => true,
            ],
            [
                'title' => 'Overheating Engine',
                'category' => 'cooling',
                'severity' => 'critical',
                'symptoms' => "• Temperature gauge reading hot\n• Steam coming from under hood\n• Sweet smell (coolant leak)\n• Reduced engine power\n• Warning light illuminated\n• Hot air from heater vents",
                'description' => 'An overheating engine is a serious problem that can cause catastrophic engine damage if not addressed immediately. The cooling system maintains optimal engine temperature, and when it fails, metal components can warp or seize. Never continue driving an overheating vehicle.',
                'possible_causes' => "1. Low coolant level (leak or evaporation)\n2. Broken water pump\n3. Thermostat stuck closed\n4. Radiator blockage or damage\n5. Cooling fan failure\n6. Blown head gasket\n7. Collapsed radiator hose\n8. Faulty radiator cap",
                'diy_solution' => "CRITICAL: If engine is overheating, pull over immediately and turn off engine.\n\nImmediate Actions:\nStep 1: Pull over safely and turn off engine\nStep 2: Wait 30+ minutes for engine to cool completely\nStep 3: DO NOT open radiator cap while hot (serious burn risk)\nStep 4: Once cool, check coolant reservoir level\nStep 5: If low, add 50/50 coolant/water mix\nStep 6: Check for visible leaks under vehicle\nStep 7: Check if cooling fan operates (turn on AC, fan should run)\n\nPrevention:\n• Regularly check coolant level\n• Inspect hoses for cracks\n• Keep radiator clean\n• Service cooling system per manufacturer schedule",
                'when_to_call_expert' => "• Engine is currently overheating (tow vehicle, don't drive)\n• You see significant coolant leaks\n• Overheating happens repeatedly\n• You suspect head gasket failure (white smoke from exhaust)\n• Cooling system pressure won't hold\n• Any uncertainty - engine damage is expensive",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 2500,
                'is_popular' => true,
            ],
            [
                'title' => 'Flat Tire / Tire Puncture',
                'category' => 'tires',
                'severity' => 'low',
                'symptoms' => "• Visible deflation of tire\n• Low tire pressure warning\n• Vehicle pulling to one side\n• Thumping sound while driving\n• Visible nail or object in tire\n• Tire pressure gauge shows low reading",
                'description' => 'Flat tires are common and can be caused by punctures, valve stem leaks, or tire damage. Most punctures in the tread area can be repaired if caught early, but sidewall damage requires tire replacement. Maintaining proper tire pressure extends tire life and improves safety.',
                'possible_causes' => "1. Nail or screw puncture\n2. Road debris damage\n3. Valve stem failure\n4. Wheel rim damage\n5. Sidewall cut or tear\n6. Age-related dry rot\n7. Under-inflation causing damage",
                'diy_solution' => "Temporary Spare Tire Installation:\nStep 1: Pull over safely on level ground, away from traffic\nStep 2: Apply parking brake and put car in Park/gear\nStep 3: Locate spare tire, jack, and lug wrench\nStep 4: Loosen lug nuts before jacking (don't remove)\nStep 5: Position jack under vehicle frame jack point\nStep 6: Raise vehicle until flat tire is off ground\nStep 7: Remove lug nuts and flat tire\nStep 8: Mount spare tire, hand-tighten lug nuts\nStep 9: Lower vehicle and fully tighten lug nuts in star pattern\nStep 10: Stow flat tire and tools\n\nImportant:\n• Spare tire (donut) is temporary - drive under 50 mph\n• Get tire repaired or replaced ASAP\n• If no spare, use tire sealant (temporary) or call roadside assistance",
                'when_to_call_expert' => "• You don't have a spare tire or jack\n• Lug nuts are stuck/rounded\n• Multiple tires are flat\n• Sidewall is damaged (not repairable)\n• You're uncomfortable changing tire\n• Unsafe location (busy highway)\n• Tire is shredded (blowout)",
                'estimated_cost_min' => 25,
                'estimated_cost_max' => 300,
                'is_popular' => false,
            ],
            [
                'title' => 'Transmission Slipping',
                'category' => 'transmission',
                'severity' => 'critical',
                'symptoms' => "• Engine revs but car doesn't accelerate\n• Delayed engagement when shifting\n• Harsh or jerky shifts\n• Burning smell\n• Transmission fluid leak\n• Check engine light on\n• Unusual noises when shifting",
                'description' => 'Transmission slipping occurs when the transmission doesn\'t properly engage gears, causing loss of power or erratic shifting. This serious problem can lead to complete transmission failure if ignored. Modern automatic transmissions are complex and expensive to repair or replace.',
                'possible_causes' => "1. Low transmission fluid level\n2. Worn transmission bands or clutches\n3. Damaged torque converter\n4. Clogged transmission filter\n5. Worn gears\n6. Solenoid failure\n7. ECM/TCM computer issues\n8. Broken transmission mounts",
                'diy_solution' => "Limited DIY Options (Transmission work is complex):\n\nBasic Checks:\nStep 1: Check transmission fluid level (engine warm, on level ground)\nStep 2: Inspect fluid color - should be red/pink, not brown/black\nStep 3: Smell fluid - burnt smell indicates serious problem\nStep 4: If low, add correct transmission fluid to proper level\nStep 5: Check for visible leaks under vehicle\n\nImportant Notes:\n• Do NOT overfill transmission fluid\n• Use only manufacturer-specified fluid type\n• If fluid is burnt or problem persists, seek professional help immediately\n• Continuing to drive can cause catastrophic failure",
                'when_to_call_expert' => "• Transmission fluid is dark or burnt\n• Slipping continues after checking fluid\n• You hear grinding or whining noises\n• Transmission won't shift into gear\n• Check engine light is on\n• You notice metal shavings in fluid\n• Any serious transmission concerns (repairs are very expensive)",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 5000,
                'is_popular' => true,
            ],
            [
                'title' => 'Alternator Failure',
                'category' => 'electrical',
                'severity' => 'high',
                'symptoms' => "• Battery warning light illuminated\n• Dimming headlights or interior lights\n• Electrical accessories malfunctioning\n• Difficulty starting or car dies while driving\n• Whining or grinding noise from engine bay\n• Burning rubber smell",
                'description' => 'The alternator charges your battery and powers electrical systems while the engine runs. When it fails, the car runs on battery power alone until the battery dies. Modern vehicles with extensive electronics are especially dependent on a functioning alternator.',
                'possible_causes' => "1. Worn alternator brushes\n2. Failed voltage regulator\n3. Damaged alternator bearings\n4. Broken serpentine belt\n5. Blown alternator fuse\n6. Corroded wiring connections\n7. Failed diodes in alternator\n8. ECM/computer issues",
                'diy_solution' => "Testing and Diagnosis:\n\nStep 1: With engine running, test battery voltage\n• Should read 13.5-14.5 volts\n• Below 13 volts indicates charging problem\n\nStep 2: Visual inspection\n• Check serpentine belt for damage/looseness\n• Inspect wiring connections for corrosion\n• Listen for unusual noises from alternator\n\nStep 3: Load test\n• Turn on headlights, AC, radio\n• Voltage should not drop below 13 volts\n• If it does, alternator is failing\n\nReplacement (requires moderate skill):\n• Disconnect battery\n• Remove serpentine belt\n• Disconnect alternator wiring\n• Remove mounting bolts\n• Install new alternator\n• Reconnect everything\n• Check belt tension",
                'when_to_call_expert' => "• You lack tools (wrenches, multimeter)\n• Alternator is difficult to access in your vehicle\n• You're uncomfortable with electrical work\n• Vehicle has already died and won't start\n• Additional issues found during diagnosis\n• Belt replacement is also needed",
                'estimated_cost_min' => 300,
                'estimated_cost_max' => 800,
                'is_popular' => false,
            ],
            [
                'title' => 'Oil Leak',
                'category' => 'engine',
                'severity' => 'medium',
                'symptoms' => "• Oil spots on driveway/parking spot\n• Low oil level on dipstick\n• Burning oil smell\n• Blue smoke from exhaust\n• Oil warning light illuminated\n• Visible oil on engine or undercarriage",
                'description' => 'Oil leaks can range from minor seepage to major drips that rapidly deplete oil levels. While small leaks might only be a nuisance, significant leaks can lead to severe engine damage if oil level drops too low. Regular oil level checks are essential when a leak is present.',
                'possible_causes' => "1. Deteriorated valve cover gasket\n2. Oil pan gasket leak\n3. Rear main seal failure\n4. Oil filter not properly installed\n5. Drain plug loose or damaged\n6. Crankshaft seal leak\n7. Timing cover gasket\n8. Oil cooler lines damaged",
                'diy_solution' => "Diagnosis and Temporary Fixes:\n\nStep 1: Locate the leak\n• Clean engine with degreaser\n• Add UV dye to oil (available at parts stores)\n• Run engine and inspect with UV light\n• Or place cardboard under car overnight to identify drip location\n\nStep 2: Check simple causes first\n• Ensure oil filter is tight\n• Check drain plug for proper torque\n• Inspect for loose bolts around oil pan\n\nStep 3: Monitor oil level frequently\n• Check dipstick weekly\n• Top off as needed with correct oil type\n• Do not let level drop below minimum mark\n\nMinor gasket replacement (valve cover):\n• Clean surface thoroughly\n• Replace gasket with new OEM or quality aftermarket\n• Torque bolts to specification\n• Use proper sealant if required",
                'when_to_call_expert' => "• Large leak (puddles forming quickly)\n• Leak is from hard-to-access area (rear main seal)\n• Oil level drops significantly between fill-ups\n• You lack tools or experience for gasket replacement\n• Multiple leak sources\n• Engine needs to be lifted for access\n• Oil warning light stays on",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 1200,
                'is_popular' => false,
            ],
        ];

        foreach ($issues as $issue) {
            CarIssue::create($issue);
        }

        // Create some related issue connections
        $this->createRelations();
    }

    private function createRelations(): void
    {
        // Example: Connect related electrical issues
        $batteryIssue = CarIssue::where('title', 'Dead Battery / Car Won\'t Start')->first();
        $alternatorIssue = CarIssue::where('title', 'Alternator Failure')->first();

        if ($batteryIssue && $alternatorIssue) {
            $batteryIssue->relatedIssues()->attach($alternatorIssue->id);
            $alternatorIssue->relatedIssues()->attach($batteryIssue->id);
        }

        // Connect cooling and engine issues
        $overheatingIssue = CarIssue::where('title', 'Overheating Engine')->first();
        $oilLeakIssue = CarIssue::where('title', 'Oil Leak')->first();

        if ($overheatingIssue && $oilLeakIssue) {
            $overheatingIssue->relatedIssues()->attach($oilLeakIssue->id);
        }

        // Connect brake issues (if you add more brake issues later)
        $brakeIssue = CarIssue::where('title', 'Squeaking or Grinding Brakes')->first();
        $checkEngineIssue = CarIssue::where('title', 'Check Engine Light On')->first();

        if ($brakeIssue && $checkEngineIssue) {
            $brakeIssue->relatedIssues()->attach($checkEngineIssue->id);
        }
    }
}
