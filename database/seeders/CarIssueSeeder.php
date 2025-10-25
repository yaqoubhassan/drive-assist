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
            // ENGINE ISSUES
            [
                'title' => 'Check Engine Light On',
                'category' => 'engine',
                'severity' => 'medium',
                'symptoms' => "• Check engine light is illuminated on dashboard\n• May be solid or flashing\n• No other obvious symptoms initially\n• Possible decrease in fuel efficiency\n• Engine may run rough in some cases",
                'description' => 'The check engine light (CEL) is one of the most common warning indicators. It can indicate anything from a loose gas cap to a serious engine malfunction. The light is triggered when the engine control module (ECM) detects an issue with the emissions system or engine performance.',
                'possible_causes' => "1. Loose or damaged gas cap\n2. Faulty oxygen sensor\n3. Catalytic converter failure\n4. Mass airflow sensor malfunction\n5. Spark plug or ignition coil issues\n6. Vacuum leak\n7. Exhaust gas recirculation (EGR) valve problem\n8. Evaporative emission control system leak",
                'diy_solution' => "Step 1: Check and tighten your gas cap. If it's loose or damaged, replace it.\nStep 2: Purchase an OBD-II scanner (available at auto parts stores for $20-$50) to read the diagnostic trouble code.\nStep 3: Look up the code online to understand the specific issue.\nStep 4: If it's a simple issue (like gas cap), the light should turn off after a few drive cycles.\nStep 5: Clear the code with the scanner and see if it returns.\n\nNote: If the light is flashing, this indicates a serious problem that can cause catalyst damage. Do not attempt DIY repair - seek professional help immediately.",
                'when_to_call_expert' => "• Light is flashing (indicates serious misfire)\n• Light is accompanied by strange noises, smoke, or loss of power\n• You've tried basic fixes (gas cap) but light persists\n• Diagnostic code indicates major component failure\n• You don't have the tools or knowledge to diagnose further\n• Multiple codes are present\n• Vehicle fails emissions test",
                'estimated_cost_min' => 50,
                'estimated_cost_max' => 1500,
                'is_popular' => true,
            ],
            [
                'title' => 'Engine Misfiring',
                'category' => 'engine',
                'severity' => 'high',
                'symptoms' => "• Engine runs rough or shakes\n• Loss of power during acceleration\n• Check engine light flashing\n• Unusual engine sounds (popping, backfiring)\n• Strong smell of unburned fuel\n• Decreased fuel efficiency",
                'description' => 'An engine misfire occurs when one or more cylinders fail to fire properly or at all. This can be caused by ignition system problems, fuel delivery issues, or mechanical problems. Continued driving with a misfire can damage the catalytic converter.',
                'possible_causes' => "1. Worn or fouled spark plugs\n2. Failed ignition coils\n3. Damaged spark plug wires\n4. Clogged fuel injectors\n5. Low fuel pressure\n6. Vacuum leaks\n7. Worn valve guides or seals\n8. Low compression in cylinder",
                'diy_solution' => "Basic Diagnosis:\nStep 1: Use OBD-II scanner to identify which cylinder is misfiring\nStep 2: Inspect spark plugs for wear, damage, or fouling\nStep 3: Check spark plug wires for cracks or damage\nStep 4: Test ignition coils with multimeter\nStep 5: If spark plugs are old or worn, replace them\nStep 6: Replace damaged wires or coils\n\nNote: Spark plug replacement is straightforward on most engines. Follow manufacturer specifications for gap and torque.",
                'when_to_call_expert' => "• Misfire persists after replacing spark plugs/wires\n• Multiple cylinders are misfiring\n• Compression test shows mechanical issues\n• Fuel system problems suspected\n• You lack tools or experience\n• Catalytic converter may be damaged",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 1000,
                'is_popular' => true,
            ],
            [
                'title' => 'Overheating Engine',
                'category' => 'cooling',
                'severity' => 'critical',
                'symptoms' => "• Temperature gauge in red zone\n• Steam coming from under hood\n• Sweet smell (coolant)\n• Loss of power\n• Engine warning light on\n• Heater blowing cold air",
                'description' => 'Engine overheating is a critical problem that can cause severe engine damage within minutes. The cooling system maintains optimal engine temperature, and when it fails, metal components can warp, seize, or crack. Never continue driving an overheating vehicle.',
                'possible_causes' => "1. Low coolant level (leak or evaporation)\n2. Broken water pump\n3. Thermostat stuck closed\n4. Radiator blockage or damage\n5. Cooling fan failure\n6. Blown head gasket\n7. Collapsed radiator hose\n8. Faulty radiator cap\n9. Clogged heater core",
                'diy_solution' => "CRITICAL: If engine is overheating, pull over immediately and turn off engine.\n\nImmediate Actions:\nStep 1: Pull over safely and turn off engine\nStep 2: Wait 30+ minutes for engine to cool completely\nStep 3: DO NOT open radiator cap while hot (serious burn risk)\nStep 4: Once cool, check coolant reservoir level\nStep 5: If low, add 50/50 coolant/water mix to proper level\nStep 6: Check for visible leaks under vehicle\nStep 7: Check if cooling fan operates (turn on AC, fan should run)\nStep 8: Inspect hoses for cracks or soft spots\n\nPrevention:\n• Regularly check coolant level (weekly)\n• Inspect hoses for cracks every oil change\n• Keep radiator clean from debris\n• Service cooling system per manufacturer schedule (typically every 30,000 miles)",
                'when_to_call_expert' => "• Engine is currently overheating (tow vehicle, don't drive)\n• You see significant coolant leaks\n• Overheating happens repeatedly\n• You suspect head gasket failure (white smoke from exhaust, milky oil)\n• Cooling system pressure won't hold\n• Water pump is leaking or making noise\n• Any uncertainty - engine damage is extremely expensive",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 2500,
                'is_popular' => true,
            ],
            [
                'title' => 'Oil Leak',
                'category' => 'engine',
                'severity' => 'medium',
                'symptoms' => "• Oil spots on driveway/parking spot\n• Low oil level on dipstick\n• Burning oil smell\n• Blue smoke from exhaust\n• Oil warning light illuminated\n• Visible oil on engine or undercarriage\n• Decreased oil pressure",
                'description' => 'Oil leaks can range from minor seepage to major drips that rapidly deplete oil levels. While small leaks might only be a nuisance, significant leaks can lead to severe engine damage if oil level drops too low. Regular oil level checks are essential when a leak is present.',
                'possible_causes' => "1. Deteriorated valve cover gasket\n2. Oil pan gasket leak\n3. Rear main seal failure\n4. Oil filter not properly installed\n5. Drain plug loose or damaged\n6. Crankshaft seal leak\n7. Timing cover gasket\n8. Oil cooler lines damaged\n9. PCV valve issues causing pressure buildup",
                'diy_solution' => "Diagnosis and Temporary Fixes:\n\nStep 1: Locate the leak\n• Clean engine with degreaser\n• Add UV dye to oil (available at parts stores)\n• Run engine and inspect with UV light\n• Or place cardboard under car overnight to identify drip location\n\nStep 2: Check simple causes first\n• Ensure oil filter is tight (but not over-tightened)\n• Check drain plug for proper torque\n• Inspect for loose bolts around oil pan\n• Verify PCV valve is functioning\n\nStep 3: Monitor oil level frequently\n• Check dipstick weekly or before long trips\n• Top off as needed with correct oil type and weight\n• Do not let level drop below minimum mark\n\nMinor gasket replacement (valve cover - moderate skill required):\n• Remove valve cover bolts\n• Clean surface thoroughly with gasket remover\n• Replace gasket with new OEM or quality aftermarket\n• Apply thin bead of RTV sealant if specified\n• Torque bolts to specification in proper sequence\n• Allow sealant to cure before adding oil",
                'when_to_call_expert' => "• Large leak (puddles forming quickly)\n• Leak is from hard-to-access area (rear main seal, timing cover)\n• Oil level drops significantly between fill-ups\n• You lack tools or experience for gasket replacement\n• Multiple leak sources\n• Engine needs to be lifted for access\n• Oil warning light stays on\n• Leak involves oil cooler lines",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 1200,
                'is_popular' => false,
            ],
            [
                'title' => 'Rough Idle',
                'category' => 'engine',
                'severity' => 'medium',
                'symptoms' => "• Engine shakes or vibrates at idle\n• RPM fluctuates while idling\n• Engine stalls when stopped\n• Decreased fuel efficiency\n• Check engine light may be on\n• Engine runs smoothly when accelerating",
                'description' => 'A rough idle occurs when the engine runs unevenly at rest, causing vibration and unstable RPMs. This can be caused by various issues ranging from simple vacuum leaks to more complex fuel or ignition problems.',
                'possible_causes' => "1. Vacuum leak\n2. Dirty throttle body\n3. Worn spark plugs\n4. Dirty fuel injectors\n5. Faulty idle air control valve\n6. Dirty mass airflow sensor\n7. Worn motor mounts\n8. Low fuel pressure\n9. Ignition system problems",
                'diy_solution' => "Step 1: Check for vacuum leaks\n• Inspect vacuum hoses for cracks or disconnections\n• Listen for hissing sounds\n• Spray carburetor cleaner around vacuum lines (RPM changes indicate leak)\n\nStep 2: Clean throttle body\n• Remove air intake hose\n• Spray throttle body cleaner on butterfly valve and bore\n• Wipe clean with cloth\n• Reassemble and reset ECU if needed\n\nStep 3: Inspect and replace spark plugs if needed\n• Check gap and condition\n• Replace if fouled or worn\n\nStep 4: Clean MAF sensor\n• Remove sensor carefully\n• Spray MAF sensor cleaner (don't touch element)\n• Let dry completely before reinstalling",
                'when_to_call_expert' => "• Problem persists after basic fixes\n• Check engine light is on with multiple codes\n• You suspect fuel injector issues\n• Compression test is needed\n• Idle air control valve needs replacement\n• Engine stalls frequently",
                'estimated_cost_min' => 75,
                'estimated_cost_max' => 500,
                'is_popular' => false,
            ],

            // BRAKE ISSUES
            [
                'title' => 'Squeaking or Grinding Brakes',
                'category' => 'brakes',
                'severity' => 'high',
                'symptoms' => "• High-pitched squealing when braking\n• Grinding or scraping noise\n• Reduced braking effectiveness\n• Vibration in brake pedal\n• Brake warning light may be on\n• Pulling to one side when braking",
                'description' => 'Squeaking or grinding brakes are serious safety concerns that should not be ignored. Squeaking often indicates worn brake pads reaching their wear indicators, while grinding means the pads are completely worn and metal is contacting metal, potentially damaging rotors.',
                'possible_causes' => "1. Worn brake pads (most common)\n2. Damaged or warped brake rotors\n3. Debris caught in brake assembly\n4. Lack of lubrication on brake components\n5. Worn brake hardware\n6. Moisture on brake components (temporary)\n7. Brake pad material glazing\n8. Worn brake calipers",
                'diy_solution' => "Important: Brake work requires specific knowledge and tools. Only attempt if you have experience.\n\nBasic Inspection:\nStep 1: Safely jack up the vehicle and remove wheels\nStep 2: Visually inspect brake pads through caliper - pads should be at least 1/4 inch thick\nStep 3: Check rotors for deep grooves, blue discoloration, or damage\nStep 4: Inspect brake hardware for rust or damage\nStep 5: Check brake fluid level\n\nBrake Pad Replacement (requires experience):\n• Remove caliper bolts\n• Compress caliper piston with C-clamp\n• Remove old pads\n• Clean and lubricate slide pins\n• Install new pads with shims\n• Reinstall caliper\n• Pump brakes before driving\n\nNote: If you hear grinding, stop driving immediately and have vehicle towed to a mechanic. Continuing to drive will damage rotors significantly.",
                'when_to_call_expert' => "• You hear grinding noises (immediate attention required)\n• Brake pedal feels soft or spongy\n• Vehicle pulls strongly to one side when braking\n• You lack experience with brake repairs\n• Brake warning light is illuminated\n• Any uncertainty about brake safety\n• Rotors need resurfacing or replacement",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 800,
                'is_popular' => true,
            ],
            [
                'title' => 'Spongy or Soft Brake Pedal',
                'category' => 'brakes',
                'severity' => 'critical',
                'symptoms' => "• Brake pedal feels soft or spongy\n• Pedal sinks to floor\n• Increased stopping distance\n• Brake warning light on\n• Need to pump brakes to stop\n• Low brake fluid level",
                'description' => 'A spongy brake pedal is a critical safety issue that usually indicates air in the brake lines or a brake fluid leak. This reduces braking effectiveness and can lead to complete brake failure.',
                'possible_causes' => "1. Air in brake lines\n2. Brake fluid leak\n3. Worn brake master cylinder\n4. Damaged brake hoses\n5. Failed brake booster\n6. Contaminated brake fluid\n7. Worn brake pads (extreme cases)",
                'diy_solution' => "CRITICAL: If brakes feel spongy, have vehicle towed to mechanic. Do not drive.\n\nEmergency Inspection Only:\nStep 1: Check brake fluid reservoir level\nStep 2: Look for visible leaks under vehicle\nStep 3: Check brake lines and hoses for damage\nStep 4: DO NOT attempt to drive vehicle\n\nBrake Bleeding (requires two people and experience):\n• Fill master cylinder with fresh brake fluid\n• Start with furthest wheel from master cylinder\n• Have helper pump brakes and hold\n• Open bleeder valve to release air/fluid\n• Close valve before pedal hits floor\n• Repeat until fluid runs clear without bubbles\n• Work through all wheels in proper sequence",
                'when_to_call_expert' => "• Brake pedal goes to floor\n• You see brake fluid leaks\n• Brake warning light is on\n• You lack brake bleeding equipment\n• Master cylinder replacement is needed\n• ANY brake safety concerns - this is not a DIY project for most people",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 1000,
                'is_popular' => false,
            ],
            [
                'title' => 'Brake Pedal Vibration or Pulsation',
                'category' => 'brakes',
                'severity' => 'medium',
                'symptoms' => "• Steering wheel shakes when braking\n• Brake pedal pulsates\n• Vibration felt through entire vehicle\n• Noise when braking\n• Uneven brake pad wear",
                'description' => 'Brake pedal pulsation or vibration during braking typically indicates warped brake rotors. This can be caused by overheating, improper installation, or age.',
                'possible_causes' => "1. Warped brake rotors (most common)\n2. Uneven brake pad wear\n3. Loose wheel bearings\n4. Out-of-balance wheels\n5. Rotor run-out\n6. Brake caliper issues",
                'diy_solution' => "Inspection:\nStep 1: Jack up vehicle safely\nStep 2: Remove wheel\nStep 3: Visually inspect rotors for:\n• Blue discoloration (overheating)\n• Deep grooves or scoring\n• Uneven wear patterns\nStep 4: Check rotor thickness with micrometer\nStep 5: Spin rotor and watch for wobble\n\nNote: Warped rotors typically require professional resurfacing or replacement. Some vehicles have rotors that cannot be resurfaced.",
                'when_to_call_expert' => "• Rotors need resurfacing or replacement\n• You lack proper measuring tools\n• Vibration is severe\n• Brake pad replacement also needed\n• Wheel bearing issues suspected",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 600,
                'is_popular' => false,
            ],

            // ELECTRICAL ISSUES
            [
                'title' => 'Dead Battery / Car Won\'t Start',
                'category' => 'electrical',
                'severity' => 'medium',
                'symptoms' => "• Engine won't crank or cranks slowly\n• Clicking sound when turning key\n• Dashboard lights dim or don't illuminate\n• Interior lights weak or won't turn on\n• Electrical accessories not working\n• Clock reset or radio presets lost",
                'description' => 'A dead battery is one of the most common car problems. Batteries typically last 3-5 years and can die due to age, extreme temperatures, leaving lights on, parasitic drain, or alternator failure. Modern vehicles\' electrical demands can quickly drain a weak battery.',
                'possible_causes' => "1. Old battery (past its lifespan)\n2. Lights or accessories left on\n3. Faulty alternator not charging battery\n4. Parasitic draw from electrical component\n5. Corroded or loose battery terminals\n6. Extreme cold weather\n7. Faulty starter motor\n8. Bad battery cells",
                'diy_solution' => "Jump Starting:\nStep 1: Position running vehicle close (but not touching)\nStep 2: Connect jumper cables in correct order:\n• Red to dead battery positive\n• Red to good battery positive\n• Black to good battery negative\n• Black to unpainted metal on dead car (not battery)\nStep 3: Start good vehicle, wait 5 minutes\nStep 4: Try starting dead vehicle\nStep 5: If successful, remove cables in reverse order\nStep 6: Drive for 30+ minutes to recharge\n\nBattery Testing:\n• Use multimeter: 12.6V = fully charged, below 12V = needs charge/replacement\n• Most auto parts stores test for free\n• Check terminals for corrosion (clean with baking soda solution)\n\nTerminal Cleaning:\n• Disconnect negative terminal first\n• Clean terminals with wire brush\n• Apply terminal protector spray\n• Reconnect positive first, then negative",
                'when_to_call_expert' => "• Battery is more than 4 years old (replace)\n• Jump start doesn't work\n• Battery repeatedly dies\n• Alternator testing needed\n• Parasitic draw diagnosis required\n• Starter motor replacement needed\n• You don't have jumper cables or another vehicle",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 500,
                'is_popular' => true,
            ],
            [
                'title' => 'Alternator Failure',
                'category' => 'electrical',
                'severity' => 'high',
                'symptoms' => "• Battery warning light illuminated\n• Dimming headlights or interior lights\n• Electrical accessories malfunctioning\n• Difficulty starting or car dies while driving\n• Whining or grinding noise from engine bay\n• Burning rubber smell\n• Battery repeatedly dying",
                'description' => 'The alternator charges your battery and powers electrical systems while the engine runs. When it fails, the car runs on battery power alone until the battery dies. Modern vehicles with extensive electronics are especially dependent on a functioning alternator.',
                'possible_causes' => "1. Worn alternator brushes\n2. Failed voltage regulator\n3. Damaged alternator bearings\n4. Broken serpentine belt\n5. Blown alternator fuse\n6. Corroded wiring connections\n7. Failed diodes in alternator\n8. ECM/computer issues\n9. Bad ground connection",
                'diy_solution' => "Testing and Diagnosis:\n\nStep 1: With engine running, test battery voltage\n• Should read 13.5-14.5 volts\n• Below 13 volts indicates charging problem\n• Above 15 volts indicates overcharging (bad regulator)\n\nStep 2: Visual inspection\n• Check serpentine belt for damage/looseness/cracks\n• Inspect wiring connections for corrosion\n• Listen for unusual noises from alternator\n• Check belt tensioner operation\n\nStep 3: Load test\n• Turn on headlights, AC, radio, rear defroster\n• Voltage should not drop below 13 volts\n• If it does, alternator is failing\n\nStep 4: Check alternator fuse\n• Locate in fuse box (check owner's manual)\n• Test with multimeter or visual inspection\n\nReplacement (requires moderate skill):\n• Disconnect battery negative terminal\n• Remove serpentine belt\n• Disconnect alternator wiring (note positions)\n• Remove mounting bolts\n• Install new alternator\n• Reconnect wiring\n• Install belt and adjust tension\n• Reconnect battery",
                'when_to_call_expert' => "• You lack tools (wrenches, multimeter, socket set)\n• Alternator is difficult to access in your vehicle\n• You're uncomfortable with electrical work\n• Vehicle has already died and won't start\n• Additional issues found during diagnosis\n• Belt or tensioner replacement is also needed\n• Wiring repairs required",
                'estimated_cost_min' => 300,
                'estimated_cost_max' => 800,
                'is_popular' => false,
            ],
            [
                'title' => 'Electrical Short Circuit',
                'category' => 'electrical',
                'severity' => 'high',
                'symptoms' => "• Blown fuses repeatedly\n• Burning smell from wiring\n• Smoke from dashboard or engine bay\n• Intermittent electrical problems\n• Battery drains quickly\n• Accessories stop working suddenly",
                'description' => 'An electrical short occurs when current takes an unintended path, often causing excessive current flow, blown fuses, or even fire. Shorts can be caused by damaged wiring, moisture, or aftermarket equipment installation.',
                'possible_causes' => "1. Damaged or frayed wiring\n2. Moisture in electrical connections\n3. Aftermarket equipment poorly installed\n4. Rodent damage to wiring\n5. Worn wire insulation\n6. Corroded connectors\n7. Failed electrical component",
                'diy_solution' => "WARNING: Electrical shorts can cause fires. If you smell burning or see smoke, disconnect battery immediately.\n\nBasic Diagnosis:\nStep 1: Identify which circuit is affected\n• Note which fuse keeps blowing\n• Check fuse box diagram\nStep 2: Disconnect battery\nStep 3: Visually inspect wiring in affected circuit\n• Look for damaged insulation\n• Check for pinched wires\n• Inspect connectors for corrosion\nStep 4: Check for moisture\nStep 5: Test circuit with multimeter\n\nNote: Electrical diagnosis requires experience and proper tools. Most shorts require professional diagnosis.",
                'when_to_call_expert' => "• You smell burning or see smoke (immediate danger)\n• Short is in hard-to-access area\n• Multiple circuits affected\n• You lack electrical diagnostic tools\n• Wiring harness repair needed\n• Computer module may be damaged",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 1500,
                'is_popular' => false,
            ],

            // TRANSMISSION ISSUES
            [
                'title' => 'Transmission Slipping',
                'category' => 'transmission',
                'severity' => 'critical',
                'symptoms' => "• Engine revs but car doesn't accelerate\n• Delayed engagement when shifting\n• Harsh or jerky shifts\n• Burning smell\n• Transmission fluid leak\n• Check engine light on\n• Unusual noises when shifting",
                'description' => 'Transmission slipping occurs when the transmission doesn\'t properly engage gears, causing loss of power or erratic shifting. This serious problem can lead to complete transmission failure if ignored. Modern automatic transmissions are complex and expensive to repair or replace.',
                'possible_causes' => "1. Low transmission fluid level\n2. Worn transmission bands or clutches\n3. Damaged torque converter\n4. Clogged transmission filter\n5. Worn gears\n6. Solenoid failure\n7. ECM/TCM computer issues\n8. Broken transmission mounts",
                'diy_solution' => "Limited DIY Options (Transmission work is complex):\n\nBasic Checks:\nStep 1: Check transmission fluid level\n• Engine warm, on level ground\n• Shift through all gears\n• Check with engine running (most vehicles)\nStep 2: Inspect fluid color\n• Should be red/pink, transparent\n• Brown/black indicates burnt fluid (serious problem)\n• Milky appearance indicates coolant contamination\nStep 3: Smell fluid\n• Should have mild petroleum smell\n• Burnt smell indicates serious problem\nStep 4: If low, add correct transmission fluid to proper level\n• Use ONLY manufacturer-specified type\n• Add small amounts, recheck frequently\nStep 5: Check for visible leaks under vehicle\n• Common leak points: pan gasket, cooler lines, seals\n\nImportant Notes:\n• Do NOT overfill transmission fluid\n• Use only manufacturer-specified fluid type (critical!)\n• If fluid is burnt or problem persists, seek professional help immediately\n• Continuing to drive can cause catastrophic failure\n• Consider external transmission cooler for towing/heavy use",
                'when_to_call_expert' => "• Transmission fluid is dark, burnt, or contaminated\n• Slipping continues after checking fluid\n• You hear grinding, whining, or clunking noises\n• Transmission won't shift into gear\n• Check engine light is on with transmission codes\n• You notice metal shavings in fluid\n• Any serious transmission concerns (repairs are very expensive)\n• Fluid is leaking significantly",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 5000,
                'is_popular' => true,
            ],
            [
                'title' => 'Delayed Shifting or Hard Shifts',
                'category' => 'transmission',
                'severity' => 'high',
                'symptoms' => "• Noticeable delay when shifting\n• Hard clunk when shifting\n• Rough engagement\n• Slipping between shifts\n• RPMs flare during shifts",
                'description' => 'Delayed or hard shifting indicates transmission problems that can worsen over time. Early attention can prevent more serious damage.',
                'possible_causes' => "1. Low or old transmission fluid\n2. Faulty shift solenoids\n3. Worn clutch packs\n4. Transmission control module issues\n5. Throttle position sensor problems\n6. Vacuum leaks (older vehicles)",
                'diy_solution' => "Step 1: Check transmission fluid level and condition\nStep 2: Change transmission fluid if old/dirty\n• Some vehicles require special procedures\n• Use correct fluid type\n• Replace filter if accessible\nStep 3: Reset transmission adaptation\n• Disconnect battery for 15 minutes\n• Reconnect and drive gently\n• Allow transmission to relearn shifts\nStep 4: Check for vacuum leaks (older vehicles)\n\nNote: Solenoid replacement requires professional service.",
                'when_to_call_expert' => "• Problem persists after fluid service\n• You hear unusual noises\n• Check engine light is on\n• Multiple gears affected\n• Solenoid replacement needed",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 2500,
                'is_popular' => false,
            ],

            // TIRE ISSUES
            [
                'title' => 'Flat Tire / Tire Puncture',
                'category' => 'tires',
                'severity' => 'low',
                'symptoms' => "• Visible deflation of tire\n• Low tire pressure warning\n• Vehicle pulling to one side\n• Thumping sound while driving\n• Visible nail or object in tire\n• Tire pressure gauge shows low reading",
                'description' => 'Flat tires are common and can be caused by punctures, valve stem leaks, or tire damage. Most punctures in the tread area can be repaired if caught early, but sidewall damage requires tire replacement. Maintaining proper tire pressure extends tire life and improves safety.',
                'possible_causes' => "1. Nail or screw puncture\n2. Road debris damage\n3. Valve stem failure\n4. Wheel rim damage\n5. Sidewall cut or tear\n6. Age-related dry rot\n7. Under-inflation causing damage\n8. Impact from pothole",
                'diy_solution' => "Temporary Spare Tire Installation:\n\nStep 1: Pull over safely on level ground, away from traffic\nStep 2: Apply parking brake and put car in Park (or gear for manual)\nStep 3: Locate spare tire, jack, and lug wrench in vehicle\nStep 4: Place wheel chocks if available\nStep 5: Loosen lug nuts before jacking (turn counter-clockwise, don't remove)\nStep 6: Position jack under vehicle frame jack point (check manual for location)\nStep 7: Raise vehicle until flat tire is completely off ground\nStep 8: Remove loosened lug nuts completely\nStep 9: Pull flat tire off hub\nStep 10: Mount spare tire, align holes with studs\nStep 11: Hand-tighten lug nuts in star pattern\nStep 12: Lower vehicle until tire touches ground\nStep 13: Fully tighten lug nuts in star pattern\nStep 14: Lower vehicle completely and remove jack\nStep 15: Stow flat tire and tools securely\n\nImportant Safety Notes:\n• Spare tire (donut) is temporary - drive under 50 mph, less than 50 miles\n• Get tire repaired or replaced ASAP\n• If no spare, use tire sealant (temporary) or call roadside assistance\n• Never go under vehicle supported only by jack\n• Park on level, stable surface\n\nTire Plug Kit (tread punctures only):\n• Locate puncture and mark it\n• Remove object\n• Ream hole with reamer tool\n• Insert plug with installation tool\n• Trim excess plug\n• Inflate tire and check for leaks\n• This is temporary - have professionally repaired",
                'when_to_call_expert' => "• You don't have a spare tire, jack, or tools\n• Lug nuts are stuck, rounded, or require special key\n• Multiple tires are flat\n• Sidewall is damaged (not repairable)\n• You're uncomfortable changing tire\n• Unsafe location (busy highway, steep grade)\n• Tire is shredded from blowout\n• Run-flat tire needs replacement",
                'estimated_cost_min' => 25,
                'estimated_cost_max' => 300,
                'is_popular' => false,
            ],
            [
                'title' => 'Uneven Tire Wear',
                'category' => 'tires',
                'severity' => 'medium',
                'symptoms' => "• Tread wearing unevenly across tire\n• Vibration while driving\n• Vehicle pulling to one side\n• Excessive road noise\n• Reduced handling\n• Shorter tire lifespan",
                'description' => 'Uneven tire wear indicates alignment, balance, or suspension problems. Different wear patterns point to specific issues that should be addressed to prevent premature tire replacement.',
                'possible_causes' => "1. Improper wheel alignment\n2. Unbalanced wheels\n3. Incorrect tire pressure\n4. Worn suspension components\n5. Driving habits (hard cornering)\n6. Lack of tire rotation\n7. Bent wheel rim",
                'diy_solution' => "Inspection:\nStep 1: Check tire pressure (all four tires)\n• Compare to door jamb sticker specification\n• Check when tires are cold\nStep 2: Examine wear patterns:\n• Center wear = over-inflation\n• Edge wear = under-inflation\n• One-side wear = alignment issue\n• Cupping/scalloping = suspension problem\n• Patchy wear = balance issue\nStep 3: Rotate tires every 5,000-7,000 miles\n• Front-to-back on FWD\n• Cross pattern on RWD\n• Follow vehicle manual pattern\nStep 4: Maintain proper inflation\n• Check monthly\n• Adjust for load if towing\n\nNote: Alignment and balancing require professional equipment.",
                'when_to_call_expert' => "• Alignment is needed\n• Wheel balancing required\n• Suspension components worn\n• Tires need replacement\n• Unusual wear patterns\n• Vibration persists",
                'estimated_cost_min' => 50,
                'estimated_cost_max' => 400,
                'is_popular' => false,
            ],
            [
                'title' => 'Tire Pressure Warning Light',
                'category' => 'tires',
                'severity' => 'low',
                'symptoms' => "• TPMS warning light on dashboard\n• May be solid or flashing\n• One or more tires low on pressure\n• Possible handling changes",
                'description' => 'The Tire Pressure Monitoring System (TPMS) alerts when tire pressure is significantly low. Proper tire pressure is crucial for safety, fuel efficiency, and tire longevity.',
                'possible_causes' => "1. Low tire pressure (most common)\n2. Temperature change\n3. Slow leak\n4. TPMS sensor battery dead\n5. Sensor damage\n6. System malfunction",
                'diy_solution' => "Step 1: Check all tire pressures with gauge\n• Include spare tire\n• Check when cold\nStep 2: Compare to specification (door jamb sticker)\nStep 3: Inflate to proper pressure\nStep 4: Drive 10-15 minutes\nStep 5: If light stays on, recheck pressures\nStep 6: If one tire loses pressure repeatedly, inspect for:\n• Punctures\n• Valve stem leak\n• Rim damage\nStep 7: Reset TPMS if needed (check manual)\n\nNote: Flashing TPMS light indicates system malfunction, not just low pressure.",
                'when_to_call_expert' => "• Light flashes (sensor issue)\n• Can't find source of leak\n• Sensor replacement needed\n• TPMS won't reset\n• Multiple sensors failing",
                'estimated_cost_min' => 25,
                'estimated_cost_max' => 200,
                'is_popular' => false,
            ],

            // SUSPENSION ISSUES
            [
                'title' => 'Worn Shock Absorbers or Struts',
                'category' => 'suspension',
                'severity' => 'medium',
                'symptoms' => "• Excessive bouncing over bumps\n• Nose dives when braking\n• Rear squats when accelerating\n• Uneven tire wear\n• Oil leaking from shocks\n• Clunking sounds over bumps",
                'description' => 'Shock absorbers and struts control vehicle bounce and maintain tire contact with the road. Worn shocks affect handling, braking distance, and tire wear.',
                'possible_causes' => "1. Age and mileage (normal wear)\n2. Driving on rough roads\n3. Overloading vehicle\n4. Damaged seals\n5. Internal component wear",
                'diy_solution' => "Bounce Test:\nStep 1: Press down hard on each corner of vehicle\nStep 2: Release and observe bounce\nStep 3: Vehicle should settle within 1-2 bounces\nStep 4: More bouncing indicates worn shocks/struts\n\nVisual Inspection:\n• Look for oil leaks on shock body\n• Check for physical damage\n• Inspect mounting bushings\n• Test for excessive play\n\nNote: Shock/strut replacement requires specialized tools and should be done in pairs (both front or both rear).",
                'when_to_call_expert' => "• Shocks/struts need replacement\n• You lack proper tools\n• Spring compressor needed (struts)\n• Alignment will be needed after\n• Safety concerns with suspension work",
                'estimated_cost_min' => 400,
                'estimated_cost_max' => 1200,
                'is_popular' => false,
            ],
            [
                'title' => 'Clunking or Knocking from Suspension',
                'category' => 'suspension',
                'severity' => 'high',
                'symptoms' => "• Clunking noise over bumps\n• Knocking sound when turning\n• Rattling from undercarriage\n• Steering feels loose\n• Uneven tire wear",
                'description' => 'Suspension noises indicate worn or damaged components that can affect vehicle handling and safety.',
                'possible_causes' => "1. Worn ball joints\n2. Damaged sway bar links\n3. Worn control arm bushings\n4. Loose strut mounts\n5. Worn tie rod ends\n6. Damaged CV joints",
                'diy_solution' => "Inspection (vehicle on jack stands):\nStep 1: Check for play in ball joints\n• Grab tire at top and bottom\n• Rock in and out\n• Excessive movement indicates wear\nStep 2: Inspect sway bar links\n• Look for torn boots\n• Test for looseness\nStep 3: Check control arm bushings\n• Look for cracks or separation\nStep 4: Have helper turn steering while you observe\n• Listen for clicking (CV joints)\n• Watch tie rod ends for movement\n\nNote: Most suspension repairs require professional service.",
                'when_to_call_expert' => "• Components need replacement\n• You lack tools or experience\n• Safety critical repairs\n• Alignment needed after\n• Pressing tools required",
                'estimated_cost_min' => 200,
                'estimated_cost_max' => 1000,
                'is_popular' => false,
            ],

            // STEERING ISSUES
            [
                'title' => 'Power Steering Failure',
                'category' => 'steering',
                'severity' => 'high',
                'symptoms' => "• Heavy or stiff steering\n• Whining noise when turning\n• Power steering warning light\n• Fluid leak under vehicle\n• Groaning sound at full lock",
                'description' => 'Power steering makes steering effort light and easy. When it fails, steering becomes very heavy, especially at low speeds or when parking.',
                'possible_causes' => "1. Low power steering fluid\n2. Worn power steering pump\n3. Broken serpentine belt\n4. Power steering hose leak\n5. Rack and pinion failure\n6. Air in system",
                'diy_solution' => "Step 1: Check power steering fluid level\n• Locate reservoir\n• Check when engine is cold\n• Top off if low with correct fluid\nStep 2: Inspect for leaks\n• Check hoses and connections\n• Look under vehicle\nStep 3: Check serpentine belt\n• Look for damage or looseness\nStep 4: Listen for pump noise\n• Whining indicates pump wear\nStep 5: Bleed system if air present\n• Turn steering lock to lock\n• Top off fluid\n• Repeat until no bubbles\n\nNote: Most power steering repairs require professional service.",
                'when_to_call_expert' => "• Pump needs replacement\n• Rack and pinion failing\n• Significant fluid leaks\n• Belt replacement needed\n• Hose replacement required",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 1500,
                'is_popular' => false,
            ],

            // EXHAUST ISSUES
            [
                'title' => 'Loud Exhaust / Exhaust Leak',
                'category' => 'exhaust',
                'severity' => 'medium',
                'symptoms' => "• Loud exhaust noise\n• Hissing or popping sounds\n• Smell of exhaust in cabin\n• Decreased fuel efficiency\n• Failed emissions test\n• Visible rust on exhaust",
                'description' => 'Exhaust leaks can occur anywhere in the exhaust system. They not only make the vehicle loud but can also allow dangerous carbon monoxide into the cabin.',
                'possible_causes' => "1. Rusted exhaust pipes\n2. Failed exhaust gasket\n3. Damaged muffler\n4. Cracked exhaust manifold\n5. Loose exhaust hangers\n6. Broken catalytic converter",
                'diy_solution' => "Inspection:\nStep 1: Start engine and listen for location of leak\nStep 2: Visually inspect exhaust system\n• Look for rust, holes, or damage\n• Check all connections\nStep 3: Check exhaust hangers\n• Ensure they're not broken\n• Replace if rubber is deteriorated\nStep 4: Temporary fix for small leak:\n• Exhaust repair tape/putty\n• Only temporary until proper repair\n\nNote: Welding or replacement requires professional service.",
                'when_to_call_expert' => "• Major exhaust component replacement\n• Welding required\n• Catalytic converter issues\n• Manifold crack\n• System needs replacement",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 1500,
                'is_popular' => false,
            ],

            // FUEL SYSTEM ISSUES
            [
                'title' => 'Poor Fuel Economy',
                'category' => 'fuel',
                'severity' => 'low',
                'symptoms' => "• Decreased miles per gallon\n• More frequent fill-ups\n• Check engine light may be on\n• Engine running rough\n• Loss of power",
                'description' => 'Poor fuel economy can have many causes ranging from simple maintenance issues to serious mechanical problems.',
                'possible_causes' => "1. Dirty air filter\n2. Worn spark plugs\n3. Underinflated tires\n4. Oxygen sensor failure\n5. Clogged fuel injectors\n6. Thermostat stuck open\n7. Driving habits\n8. Excessive idling",
                'diy_solution' => "Step 1: Check and replace air filter if dirty\nStep 2: Inspect and replace spark plugs if worn\nStep 3: Ensure proper tire pressure\nStep 4: Use fuel system cleaner\nStep 5: Check for dragging brakes\nStep 6: Reduce excessive idling\nStep 7: Remove excess weight from vehicle\nStep 8: Check for Check Engine Light codes\n\nDriving Tips:\n• Accelerate gently\n• Maintain steady speed\n• Anticipate stops\n• Reduce AC use\n• Remove roof racks when not needed",
                'when_to_call_expert' => "• Oxygen sensor replacement needed\n• Fuel injector cleaning required\n• Thermostat replacement\n• Major tune-up needed\n• Transmission issues suspected",
                'estimated_cost_min' => 50,
                'estimated_cost_max' => 600,
                'is_popular' => false,
            ],
            [
                'title' => 'Fuel Pump Failure',
                'category' => 'fuel',
                'severity' => 'high',
                'symptoms' => "• Engine won't start\n• Engine sputters at high speed\n• Loss of power under load\n• Whining noise from fuel tank\n• Engine stalls frequently\n• Difficulty starting when hot",
                'description' => 'The fuel pump delivers gasoline from the tank to the engine. When it fails, the engine cannot get adequate fuel and will not run properly or at all.',
                'possible_causes' => "1. Worn fuel pump motor\n2. Clogged fuel filter\n3. Contaminated fuel\n4. Electrical issues\n5. Low fuel level (pump overheating)\n6. Age and mileage",
                'diy_solution' => "Diagnosis:\nStep 1: Listen for fuel pump when turning key on\n• Should hear whining sound from tank area\n• No sound may indicate pump failure\nStep 2: Check fuel pressure (requires gauge)\nStep 3: Check fuel pump fuse and relay\nStep 4: Inspect fuel filter (if external)\n\nNote: Fuel pump replacement requires dropping fuel tank, which is difficult and dangerous. Professional service strongly recommended.",
                'when_to_call_expert' => "• Fuel pump needs replacement\n• Fuel tank must be dropped\n• Fuel pressure testing needed\n• Electrical diagnostics required\n• Safety concerns with fuel system",
                'estimated_cost_min' => 400,
                'estimated_cost_max' => 1000,
                'is_popular' => false,
            ],

            // COOLING SYSTEM
            [
                'title' => 'Coolant Leak',
                'category' => 'cooling',
                'severity' => 'high',
                'symptoms' => "• Puddles under vehicle\n• Low coolant level\n• Sweet smell\n• Overheating engine\n• White steam from engine\n• Coolant warning light",
                'description' => 'Coolant leaks can lead to overheating and severe engine damage. Early detection and repair are crucial.',
                'possible_causes' => "1. Damaged radiator\n2. Failed water pump\n3. Cracked hoses\n4. Blown head gasket\n5. Leaking heater core\n6. Damaged radiator cap\n7. Corroded freeze plugs",
                'diy_solution' => "Step 1: Locate leak (when engine is cool)\n• Check radiator\n• Inspect hoses\n• Look at water pump\n• Check under dashboard (heater core)\nStep 2: Pressure test system (requires tool)\nStep 3: Replace damaged hoses\n• Drain coolant first\n• Remove old hose\n• Install new hose with clamps\nStep 4: Use stop leak product (temporary)\nStep 5: Monitor coolant level frequently\n\nNote: Major leaks require professional repair.",
                'when_to_call_expert' => "• Radiator replacement needed\n• Water pump failure\n• Head gasket suspected\n• Heater core leak\n• Multiple leak sources\n• System pressure won't hold",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 1500,
                'is_popular' => false,
            ],
            [
                'title' => 'Thermostat Failure',
                'category' => 'cooling',
                'severity' => 'medium',
                'symptoms' => "• Engine overheating\n• Engine not reaching operating temperature\n• Poor heater performance\n• Temperature gauge fluctuating\n• Check engine light\n• Poor fuel economy",
                'description' => 'The thermostat regulates coolant flow to maintain optimal engine temperature. When stuck closed, the engine overheats. When stuck open, the engine runs too cool.',
                'possible_causes' => "1. Age and corrosion\n2. Debris blocking thermostat\n3. Manufacturing defect\n4. Improper installation",
                'diy_solution' => "Thermostat Replacement (moderate skill):\nStep 1: Let engine cool completely\nStep 2: Drain coolant from radiator\nStep 3: Locate thermostat housing\nStep 4: Remove housing bolts\nStep 5: Remove old thermostat and gasket\nStep 6: Clean surfaces thoroughly\nStep 7: Install new thermostat (spring side toward engine)\nStep 8: Install new gasket\nStep 9: Reinstall housing\nStep 10: Refill coolant\nStep 11: Burp air from system\nStep 12: Check for leaks\n\nImportant: Use OEM or quality thermostat with correct temperature rating.",
                'when_to_call_expert' => "• Thermostat is difficult to access\n• You lack tools or experience\n• Coolant system service needed\n• Head gasket failure suspected\n• Additional cooling issues present",
                'estimated_cost_min' => 150,
                'estimated_cost_max' => 400,
                'is_popular' => false,
            ],

            // AC SYSTEM
            [
                'title' => 'Air Conditioning Not Working',
                'category' => 'other',
                'severity' => 'low',
                'symptoms' => "• AC blows warm air\n• No air flow from vents\n• Weak air flow\n• Strange smells from vents\n• AC clutch not engaging\n• Unusual noises when AC is on",
                'description' => 'Air conditioning failures can range from simple fixes like low refrigerant to more complex compressor problems.',
                'possible_causes' => "1. Low refrigerant level\n2. AC compressor failure\n3. Blown fuse\n4. Faulty AC clutch\n5. Clogged cabin air filter\n6. Condenser damage\n7. Electrical issues\n8. Blend door actuator failure",
                'diy_solution' => "Step 1: Check cabin air filter\n• Replace if dirty\nStep 2: Check AC fuse\n• Replace if blown\nStep 3: Inspect AC compressor\n• Watch if clutch engages\n• Listen for unusual sounds\nStep 4: Check refrigerant level (requires gauge)\nStep 5: Recharge AC if low (requires kit)\n• Follow kit instructions carefully\n• Do not overcharge\n\nNote: AC work requires special tools and EPA certification for refrigerant handling.",
                'when_to_call_expert' => "• Compressor replacement needed\n• System requires evacuation and recharge\n• Leak detection required\n• Electrical diagnostics needed\n• Condenser replacement\n• You're uncomfortable with AC work",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 1500,
                'is_popular' => false,
            ],

            // WIPERS AND LIGHTS
            [
                'title' => 'Windshield Wiper Problems',
                'category' => 'other',
                'severity' => 'medium',
                'symptoms' => "• Wipers not working\n• Wipers moving slowly\n• Streaking on windshield\n• Chattering or skipping\n• Wipers stuck in up position",
                'description' => 'Wiper problems can range from simple blade replacement to motor failure. Good wipers are essential for safe driving in rain.',
                'possible_causes' => "1. Worn wiper blades\n2. Failed wiper motor\n3. Broken wiper transmission\n4. Blown fuse\n5. Bad switch\n6. Seized linkage",
                'diy_solution' => "Wiper Blade Replacement:\nStep 1: Lift wiper arm away from windshield\nStep 2: Press release tab on blade\nStep 3: Slide blade off arm\nStep 4: Slide new blade on (listen for click)\nStep 5: Lower arm gently\n\nWiper Motor Check:\nStep 1: Check wiper fuse\nStep 2: Listen for motor sound\nStep 3: Check wiper linkage for binding\nStep 4: Test with multimeter if electrical issue suspected\n\nNote: Replace wiper blades every 6-12 months.",
                'when_to_call_expert' => "• Motor replacement needed\n• Linkage repair required\n• Electrical diagnostics needed\n• Washer pump replacement",
                'estimated_cost_min' => 20,
                'estimated_cost_max' => 400,
                'is_popular' => false,
            ],
            [
                'title' => 'Headlight or Taillight Out',
                'category' => 'electrical',
                'severity' => 'medium',
                'symptoms' => "• One or more lights not working\n• Dim lights\n• Flickering lights\n• Warning message on dash\n• Failed inspection",
                'description' => 'Non-functioning lights are a safety hazard and often illegal. Most are simple bulb replacements.',
                'possible_causes' => "1. Burned out bulb\n2. Blown fuse\n3. Bad socket\n4. Wiring problem\n5. Bad ground connection\n6. Failed light module (LED)",
                'diy_solution' => "Bulb Replacement:\nStep 1: Locate bulb access\n• May be from engine bay or inside trunk/hatch\nStep 2: Twist and remove bulb socket\nStep 3: Remove old bulb\n• Pull or twist depending on type\nStep 4: Install new bulb\n• Don't touch glass with bare hands (halogen)\n• Use bulb grease on weather seal\nStep 5: Test before reassembly\n\nImportant: Use correct bulb type. Check owner's manual.",
                'when_to_call_expert' => "• LED assembly replacement needed\n• Sealed beam headlights\n• Wiring repair required\n• Difficult access\n• Headlight aiming needed",
                'estimated_cost_min' => 10,
                'estimated_cost_max' => 500,
                'is_popular' => false,
            ],

            // BODY AND INTERIOR
            [
                'title' => 'Door Lock or Window Not Working',
                'category' => 'other',
                'severity' => 'low',
                'symptoms' => "• Power window won't move\n• Window moves slowly\n• Door won't lock/unlock\n• Switch not responsive\n• Window off track",
                'description' => 'Power window and lock failures are common, especially in older vehicles. They can usually be repaired individually.',
                'possible_causes' => "1. Failed window motor\n2. Bad window regulator\n3. Blown fuse\n4. Bad switch\n5. Failed door lock actuator\n6. Wiring issues\n7. Window off track",
                'diy_solution' => "Diagnosis:\nStep 1: Check fuse\nStep 2: Test with different switch (driver vs passenger)\nStep 3: Listen for motor sound\nStep 4: Check for obstructions\nStep 5: Inspect window track\n\nNote: Door panel removal required for most repairs. Use proper tools to avoid damage.",
                'when_to_call_expert' => "• Window motor replacement\n• Regulator replacement\n• Lock actuator replacement\n• Complex electrical diagnosis\n• Door panel removal difficult",
                'estimated_cost_min' => 100,
                'estimated_cost_max' => 600,
                'is_popular' => false,
            ],
            [
                'title' => 'Strange Smell Inside Vehicle',
                'category' => 'other',
                'severity' => 'medium',
                'symptoms' => "• Unusual odor in cabin\n• Burning smell\n• Musty or moldy smell\n• Sweet smell\n• Rotten egg smell",
                'description' => 'Different smells indicate different problems. Identifying the smell helps diagnose the issue.',
                'possible_causes' => "1. Burning smell: Brakes, clutch, electrical short, oil leak\n2. Sweet smell: Coolant leak, heater core leak\n3. Rotten egg smell: Catalytic converter, battery\n4. Musty smell: Mold in AC system\n5. Gasoline smell: Fuel leak\n6. Burning plastic: Electrical short\n7. Burning oil: Oil leak on hot components",
                'diy_solution' => "Investigation:\nStep 1: Identify smell type and when it occurs\nStep 2: Check under hood for leaks or damage\nStep 3: Inspect interior for spills or trapped items\nStep 4: Check cabin air filter\nStep 5: Run AC with windows down to clear mold\nStep 6: Use AC cleaner spray in intake\n\nCabin Air Filter Replacement:\n• Located behind glove box or under hood\n• Remove old filter\n• Install new filter with arrows pointing to airflow direction",
                'when_to_call_expert' => "• Gasoline smell (potential fire hazard)\n• Burning smell persists\n• Coolant leak present\n• Electrical short suspected\n• Catalytic converter issues\n• Any smell accompanied by smoke",
                'estimated_cost_min' => 20,
                'estimated_cost_max' => 500,
                'is_popular' => false,
            ],
        ];

        foreach ($issues as $issue) {
            CarIssue::create($issue);
        }

        // Create related issue connections
        $this->createRelations();
    }

    private function createRelations(): void
    {
        // Connect related electrical issues
        $batteryIssue = CarIssue::where('title', 'Dead Battery / Car Won\'t Start')->first();
        $alternatorIssue = CarIssue::where('title', 'Alternator Failure')->first();
        $electricalShort = CarIssue::where('title', 'Electrical Short Circuit')->first();

        if ($batteryIssue && $alternatorIssue) {
            $batteryIssue->relatedIssues()->attach($alternatorIssue->id);
            $alternatorIssue->relatedIssues()->attach($batteryIssue->id);
        }

        if ($batteryIssue && $electricalShort) {
            $batteryIssue->relatedIssues()->attach($electricalShort->id);
        }

        // Connect cooling and engine issues
        $overheatingIssue = CarIssue::where('title', 'Overheating Engine')->first();
        $oilLeakIssue = CarIssue::where('title', 'Oil Leak')->first();
        $coolantLeak = CarIssue::where('title', 'Coolant Leak')->first();
        $thermostat = CarIssue::where('title', 'Thermostat Failure')->first();

        if ($overheatingIssue && $oilLeakIssue) {
            $overheatingIssue->relatedIssues()->attach($oilLeakIssue->id);
        }

        if ($overheatingIssue && $coolantLeak) {
            $overheatingIssue->relatedIssues()->attach($coolantLeak->id);
            $coolantLeak->relatedIssues()->attach($overheatingIssue->id);
        }

        if ($overheatingIssue && $thermostat) {
            $overheatingIssue->relatedIssues()->attach($thermostat->id);
            $thermostat->relatedIssues()->attach($overheatingIssue->id);
        }

        // Connect brake issues
        $brakeIssue = CarIssue::where('title', 'Squeaking or Grinding Brakes')->first();
        $spongeBrakes = CarIssue::where('title', 'Spongy or Soft Brake Pedal')->first();
        $brakeVibration = CarIssue::where('title', 'Brake Pedal Vibration or Pulsation')->first();

        if ($brakeIssue && $spongeBrakes) {
            $brakeIssue->relatedIssues()->attach($spongeBrakes->id);
        }

        if ($brakeIssue && $brakeVibration) {
            $brakeIssue->relatedIssues()->attach($brakeVibration->id);
        }

        // Connect transmission issues
        $transmissionSlip = CarIssue::where('title', 'Transmission Slipping')->first();
        $hardShifts = CarIssue::where('title', 'Delayed Shifting or Hard Shifts')->first();

        if ($transmissionSlip && $hardShifts) {
            $transmissionSlip->relatedIssues()->attach($hardShifts->id);
            $hardShifts->relatedIssues()->attach($transmissionSlip->id);
        }

        // Connect engine issues
        $checkEngine = CarIssue::where('title', 'Check Engine Light On')->first();
        $misfire = CarIssue::where('title', 'Engine Misfiring')->first();
        $roughIdle = CarIssue::where('title', 'Rough Idle')->first();

        if ($checkEngine && $misfire) {
            $checkEngine->relatedIssues()->attach($misfire->id);
            $misfire->relatedIssues()->attach($checkEngine->id);
        }

        if ($misfire && $roughIdle) {
            $misfire->relatedIssues()->attach($roughIdle->id);
            $roughIdle->relatedIssues()->attach($misfire->id);
        }

        // Connect tire issues
        $flatTire = CarIssue::where('title', 'Flat Tire / Tire Puncture')->first();
        $unevenWear = CarIssue::where('title', 'Uneven Tire Wear')->first();
        $tpms = CarIssue::where('title', 'Tire Pressure Warning Light')->first();

        if ($flatTire && $tpms) {
            $flatTire->relatedIssues()->attach($tpms->id);
            $tpms->relatedIssues()->attach($flatTire->id);
        }

        if ($unevenWear && $tpms) {
            $unevenWear->relatedIssues()->attach($tpms->id);
        }

        // Connect suspension issues
        $wornShocks = CarIssue::where('title', 'Worn Shock Absorbers or Struts')->first();
        $suspensionNoise = CarIssue::where('title', 'Clunking or Knocking from Suspension')->first();

        if ($wornShocks && $suspensionNoise) {
            $wornShocks->relatedIssues()->attach($suspensionNoise->id);
            $suspensionNoise->relatedIssues()->attach($wornShocks->id);
        }

        if ($wornShocks && $unevenWear) {
            $wornShocks->relatedIssues()->attach($unevenWear->id);
        }

        // Connect fuel system issues
        $poorFuel = CarIssue::where('title', 'Poor Fuel Economy')->first();
        $fuelPump = CarIssue::where('title', 'Fuel Pump Failure')->first();

        if ($poorFuel && $checkEngine) {
            $poorFuel->relatedIssues()->attach($checkEngine->id);
        }

        if ($fuelPump && $checkEngine) {
            $fuelPump->relatedIssues()->attach($checkEngine->id);
        }
    }
}
