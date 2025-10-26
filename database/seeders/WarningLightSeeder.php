<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WarningLight;

class WarningLightSeeder extends Seeder
{
    public function run(): void
    {
        $lights = [
            // CHECK ENGINE LIGHT
            [
                'name' => 'Check Engine Light',
                'severity' => 'warning',
                'color' => 'yellow',
                'icon_description' => 'Engine symbol or words "CHECK ENGINE"',
                'emoji' => '⚠️',
                'meaning' => 'Indicates an emissions or engine-related problem detected by onboard diagnostic system (OBD-II).',
                'possible_causes' => "• Loose or damaged gas cap\n• Faulty oxygen sensor\n• Bad catalytic converter\n• Mass airflow sensor malfunction\n• Spark plug/ignition coil issues\n• Failed emissions equipment\n• Vacuum leak\n• Faulty EGR valve\n• Dozens of other potential issues",
                'immediate_action' => "1. Don't panic - not always urgent\n2. Check gas cap - tighten if loose\n3. If driving normally, can drive to mechanic\n4. Have codes read at auto parts store (free)\n5. If light is flashing: PULL OVER - indicates severe misfire\n6. If engine overheating or losing power: stop driving\n7. Get diagnosed within a week",
                'long_term_solution' => "Have OBD-II codes read to identify specific problem. Address underlying issue. Some causes are minor (gas cap), others serious (catalytic converter). Never ignore - can cause more damage and failed emissions test.",
                'safe_to_drive' => true,
                'driving_restrictions' => "Usually safe to drive if:\n• Light is steady (not flashing)\n• Engine running normally\n• No overheating\n• No unusual noises\n\nSTOP driving if:\n• Light is flashing\n• Engine misfiring badly\n• Loss of power\n• Overheating\n• Strange smells",
                'estimated_repair_cost_min' => 0,
                'estimated_repair_cost_max' => 2000,
                'is_common' => true,
                'is_published' => true,
            ],

            // OIL PRESSURE WARNING
            [
                'name' => 'Oil Pressure Warning Light',
                'severity' => 'critical',
                'color' => 'red',
                'icon_description' => 'Oil can symbol with drip',
                'emoji' => '🛢️',
                'meaning' => 'Dangerously low oil pressure or oil level. Engine may not be receiving adequate lubrication.',
                'possible_causes' => "• Low oil level\n• Oil pump failure\n• Clogged oil filter\n• Worn engine bearings\n• Faulty oil pressure sensor\n• Oil leak\n• Wrong oil viscosity\n• Severe engine wear",
                'immediate_action' => "🚨 CRITICAL - ACT IMMEDIATELY\n\n1. PULL OVER SAFELY and turn off engine\n2. DO NOT continue driving\n3. Let engine cool 10 minutes\n4. Check oil level with dipstick\n5. If oil low, add oil immediately\n6. If oil level OK, DO NOT start engine\n7. Call for tow truck\n8. Never drive with this light on - causes severe engine damage in minutes",
                'long_term_solution' => "If low oil was cause: add oil and monitor closely for leaks. If pressure problem: oil pump, bearings, or sensor need replacement. Can be expensive but necessary to prevent total engine failure.",
                'safe_to_drive' => false,
                'driving_restrictions' => "NEVER drive with this light on except to pull over safely. Driving without oil pressure will destroy your engine within minutes. Even a short drive can cost thousands in repairs.",
                'estimated_repair_cost_min' => 150,
                'estimated_repair_cost_max' => 3000,
                'is_common' => true,
                'is_published' => true,
            ],

            // BATTERY/CHARGING SYSTEM
            [
                'name' => 'Battery/Charging System Light',
                'severity' => 'warning',
                'color' => 'red',
                'icon_description' => 'Battery symbol or GEN/ALT text',
                'emoji' => '🔋',
                'meaning' => 'Charging system not working - battery not being recharged while driving. Running on battery power alone.',
                'possible_causes' => "• Failing alternator\n• Broken serpentine belt\n• Bad battery connection\n• Worn alternator belt\n• Faulty voltage regulator\n• Wiring issues\n• Corroded battery terminals\n• Bad battery (less common)",
                'immediate_action' => "1. Turn off ALL non-essential electrical items (AC, radio, heated seats)\n2. Can drive 30-60 minutes on battery alone\n3. Head directly to mechanic or auto parts store\n4. Don't turn off engine - may not restart\n5. If engine stalls, pull over safely\n6. Avoid nighttime driving (need headlights)\n7. If belt broke, engine may overheat - monitor temp gauge",
                'long_term_solution' => "Most often: alternator replacement ($300-$800). Could be simple belt replacement ($50-$100). Have charging system tested. Don't wait - will leave you stranded.",
                'safe_to_drive' => true,
                'driving_restrictions' => "Safe for SHORT drives to mechanic. Once battery drains completely, car will stall and not restart. Limit distance based on battery age and health. Don't wait - can leave you stranded.",
                'estimated_repair_cost_min' => 50,
                'estimated_repair_cost_max' => 800,
                'is_common' => true,
                'is_published' => true,
            ],

            // BRAKE SYSTEM WARNING
            [
                'name' => 'Brake System Warning Light',
                'severity' => 'critical',
                'color' => 'red',
                'icon_description' => 'Circle with exclamation mark or "BRAKE" text',
                'emoji' => '🛑',
                'meaning' => 'Problem with brake system - low brake fluid, parking brake engaged, or brake system malfunction.',
                'possible_causes' => "• Parking brake still engaged\n• Low brake fluid level\n• Brake fluid leak\n• Worn brake pads\n• ABS system fault\n• Brake line damage\n• Master cylinder failure\n• Proportioning valve issue",
                'immediate_action' => "1. Check if parking brake is fully released\n2. If parking brake off, PULL OVER SAFELY\n3. Test brakes in safe area - pump pedal\n4. If pedal goes to floor: DO NOT DRIVE\n5. If brakes feel normal: drive carefully to mechanic\n6. Use engine braking and give extra distance\n7. If ANY doubt about brakes: call tow truck\n8. Brakes are safety-critical - don't take chances",
                'long_term_solution' => "Inspect entire brake system immediately. Could be simple (low fluid) or serious (brake line leak). Never ignore - brake failure is life-threatening. May need brake line repair, pad replacement, or master cylinder replacement.",
                'safe_to_drive' => false,
                'driving_restrictions' => "Only drive if:\n• Light came on due to parking brake\n• Brakes feel completely normal\n• Driving slowly and carefully to nearby mechanic\n\nDO NOT drive if:\n• Pedal is soft or spongy\n• Pedal goes to floor\n• Unusual noises\n• Pulling to one side\n• Any doubt about brake function",
                'estimated_repair_cost_min' => 100,
                'estimated_repair_cost_max' => 1000,
                'is_common' => true,
                'is_published' => true,
            ],

            // ABS WARNING
            [
                'name' => 'ABS (Anti-lock Brake System) Light',
                'severity' => 'caution',
                'color' => 'yellow',
                'icon_description' => 'Circle with "ABS" text',
                'emoji' => '⚠️',
                'meaning' => 'Anti-lock braking system has a fault. Regular brakes still work, but ABS function disabled.',
                'possible_causes' => "• Faulty wheel speed sensor\n• Damaged ABS sensor wiring\n• Low brake fluid (can trigger both ABS and brake light)\n• ABS module failure\n• Blown fuse\n• Dirty/corroded sensor\n• Failed ABS pump",
                'immediate_action' => "1. Regular brakes still work normally\n2. Safe to drive, but carefully\n3. ABS won't activate in emergency stops\n4. Avoid hard braking if possible\n5. Increase following distance\n6. Be extra careful in rain/snow\n7. Have diagnosed soon\n8. If BOTH ABS and brake light on: more serious - see mechanic immediately",
                'long_term_solution' => "Have ABS system scanned for codes. Often wheel speed sensor ($50-$200). Could be module ($500-$1,500). While not immediately critical, ABS is important safety feature especially in emergency stops and slippery conditions.",
                'safe_to_drive' => true,
                'driving_restrictions' => "Safe to drive normally, but:\n• Be more cautious with braking\n• Allow extra stopping distance\n• Extra careful in wet/icy conditions\n• Avoid panic stops if possible\n• Get repaired within a week or two\n\nNote: If brake pedal feels different or brake warning light is also on, stop driving and have towed.",
                'estimated_repair_cost_min' => 50,
                'estimated_repair_cost_max' => 1500,
                'is_common' => true,
                'is_published' => true,
            ],

            // TIRE PRESSURE
            [
                'name' => 'Tire Pressure Monitoring System (TPMS) Light',
                'severity' => 'caution',
                'color' => 'yellow',
                'icon_description' => 'Tire cross-section with exclamation mark',
                'emoji' => '⚠️',
                'meaning' => 'One or more tires has low air pressure (typically 25% below recommended), or TPMS sensor malfunction.',
                'possible_causes' => "• Natural air loss over time\n• Temperature change (cold weather)\n• Slow leak (nail, puncture)\n• Faulty TPMS sensor\n• Recent tire rotation (sensors need relearn)\n• Dead sensor battery\n• Damaged valve stem\n• Tire damage",
                'immediate_action' => "1. Check all tire pressures (including spare) with gauge\n2. Inflate to recommended pressure (see door jamb sticker)\n3. If tire extremely low (flat): change to spare\n4. Look for visible damage, nails, punctures\n5. If pressure correct and light stays on: sensor issue\n6. If light blinks then stays on: sensor malfunction\n7. Can drive carefully to gas station/tire shop\n8. Don't ignore - underinflated tires are dangerous",
                'long_term_solution' => "If pressure issue: inflate tires and monitor. If slow leak: have tire repaired. If sensor issue: sensors can be tested and replaced individually ($50-$100 each). Sensor batteries last 5-10 years. Light will reset automatically once pressure is correct (may need to drive a bit).",
                'safe_to_drive' => true,
                'driving_restrictions' => "Safe to drive if:\n• Only slightly underinflated\n• No visible tire damage\n• Driving carefully to add air\n\nDO NOT drive if:\n• Tire appears flat or nearly flat\n• Visible damage to tire\n• Unusual handling or vibration\n• Recent rapid pressure loss\n\nUnderinflated tires reduce handling, increase stopping distance, and can cause blowout.",
                'estimated_repair_cost_min' => 0,
                'estimated_repair_cost_max' => 200,
                'is_common' => true,
                'is_published' => true,
            ],

            // ENGINE TEMPERATURE WARNING
            [
                'name' => 'Engine Temperature Warning Light',
                'severity' => 'critical',
                'color' => 'red',
                'icon_description' => 'Thermometer in wavy lines',
                'emoji' => '🌡️',
                'meaning' => 'Engine is overheating or coolant temperature is dangerously high.',
                'possible_causes' => "• Low coolant level\n• Coolant leak\n• Failed thermostat\n• Broken water pump\n• Radiator blockage\n• Failed cooling fan\n• Broken serpentine belt\n• Blown head gasket\n• Clogged radiator\n• Bad radiator cap",
                'immediate_action' => "🚨 CRITICAL - ACT IMMEDIATELY\n\n1. PULL OVER SAFELY immediately\n2. Turn on heater full blast (helps cool engine)\n3. Turn off engine once safely stopped\n4. DO NOT open radiator cap when hot - can spray boiling coolant\n5. Wait 30+ minutes for engine to cool\n6. Check coolant level when cool (if you can safely)\n7. If coolant low and you have some, add it\n8. If no visible leaks and you must drive: go slowly with frequent stops\n9. Best option: call tow truck\n10. Continued overheating causes catastrophic engine damage",
                'long_term_solution' => "Have cooling system inspected immediately. Could be simple (low coolant, bad thermostat - $100-$300) or serious (head gasket, water pump - $500-$2,000+). Overheating can warp engine components and cause total engine failure if ignored.",
                'safe_to_drive' => false,
                'driving_restrictions' => "DO NOT drive with overheating engine except to pull over. Continuing to drive will cause:\n• Warped cylinder head ($1,000+)\n• Blown head gasket ($1,500+)\n• Cracked engine block (engine replacement)\n• Complete engine seizure\n\nIf must drive (emergency): very short distances only, frequent stops to cool, heater on max.",
                'estimated_repair_cost_min' => 100,
                'estimated_repair_cost_max' => 4000,
                'is_common' => true,
                'is_published' => true,
            ],

            // TRACTION CONTROL
            [
                'name' => 'Traction Control / Stability Control Light',
                'severity' => 'info',
                'color' => 'yellow',
                'icon_description' => 'Car with squiggly lines or "TC" / "ESP" / "VSC" text',
                'emoji' => 'ℹ️',
                'meaning' => 'Traction control system is active (flashing) or has a fault (stays on).',
                'possible_causes' => "If flashing:\n• System actively preventing wheel spin\n• Wheels losing traction\n• Slippery road conditions\n\nIf steady on:\n• System manually turned off\n• Faulty wheel speed sensor\n• ABS system problem\n• Steering angle sensor fault\n• System malfunction",
                'immediate_action' => "If FLASHING:\n1. Normal - system is working\n2. Reduce speed on slippery surface\n3. Drive more carefully\n4. No action needed\n\nIf STAYS ON:\n1. Check if you accidentally turned system off (button with same symbol)\n2. Traction control is disabled but brakes work normally\n3. Safe to drive but be extra careful in slippery conditions\n4. If accompanied by other warning lights: more serious\n5. Have diagnosed soon",
                'long_term_solution' => "If light stays on: have system scanned. Often same sensors as ABS (wheel speed sensors). Important safety feature especially in rain, snow, or emergency maneuvers. Repair similar to ABS issues ($50-$1,000).",
                'safe_to_drive' => true,
                'driving_restrictions' => "Safe to drive, but:\n• Extra careful in rain, snow, ice\n• Avoid aggressive acceleration\n• Be gentle with steering inputs\n• Allow more space for stops\n• Reduce highway speeds in bad weather\n\nSystem helps prevent spinouts and loss of control, so its absence requires more careful driving.",
                'estimated_repair_cost_min' => 50,
                'estimated_repair_cost_max' => 1000,
                'is_common' => false,
                'is_published' => true,
            ],

            // AIRBAG WARNING
            [
                'name' => 'Airbag Warning Light (SRS)',
                'severity' => 'warning',
                'color' => 'red',
                'icon_description' => 'Seated person with circle (airbag) in front',
                'emoji' => '⚠️',
                'meaning' => 'Supplemental Restraint System (airbags) has a fault. Airbags may not deploy in crash.',
                'possible_causes' => "• Something under seat disconnecting sensor\n• Faulty seatbelt pretensioner\n• Damaged clock spring (in steering wheel)\n• Previous accident damage\n• Corroded airbag connector\n• Failed airbag module\n• Defective sensor\n• Recall-related issue",
                'immediate_action' => "1. Car is still drivable\n2. Airbags may not work in accident\n3. Make sure seatbelts work properly\n4. Check under seats for anything pressing on sensor\n5. If recently had work done: connection may be loose\n6. Have diagnosed within a few days\n7. Safety-critical system - don't delay\n8. Check for any recalls related to airbags",
                'long_term_solution' => "Have SRS system scanned for codes. Could be simple (loose connector - $50) or expensive (clockspring replacement - $500-$1,000, airbag replacement - $1,000+). Never ignore - airbags are life-saving device. Some issues covered by recalls or warranties.",
                'safe_to_drive' => true,
                'driving_restrictions' => "Technically safe to drive, but:\n• Airbags will not protect you in accident\n• Especially dangerous for driver/front passenger\n• Rely solely on seatbelts\n• Drive extra defensively\n• Avoid highway speeds if possible\n• Get repaired as soon as possible\n• Consider having someone else drive if very concerned\n\nThis is a critical safety system - don't delay repair.",
                'estimated_repair_cost_min' => 50,
                'estimated_repair_cost_max' => 2000,
                'is_common' => false,
                'is_published' => true,
            ],
        ];

        foreach ($lights as $lightData) {
            WarningLight::create($lightData);
        }
    }
}
