<?php

namespace Database\Seeders;

use App\Models\RoadSign;
use App\Models\RoadSignQuizQuestion;
use Illuminate\Database\Seeder;

class RoadSignsSeeder extends Seeder
{
    public function run(): void
    {
        $signs = $this->getRoadSigns();

        foreach ($signs as $signData) {
            $sign = RoadSign::create($signData);

            // Add quiz questions for each sign
            $this->createQuizQuestions($sign);
        }
    }

    private function getRoadSigns(): array
    {
        return [
            // ========== REGULATORY SIGNS ==========
            [
                'name' => 'Stop Sign',
                'category' => 'regulatory',
                'description' => 'Octagonal red sign with white letters',
                'meaning' => 'You must come to a complete stop at the marked stop line, crosswalk, or before entering the intersection.',
                'what_to_do' => 'Come to a complete stop, yield to vehicles and pedestrians, and proceed when safe.',
                'image_url' => '🛑',
                'shape' => 'octagon',
                'color_scheme' => 'red-white',
                'keywords' => ['stop', 'halt', 'regulatory'],
                'is_popular' => true,
            ],
            [
                'name' => 'Yield Sign',
                'category' => 'regulatory',
                'description' => 'Downward pointing triangle with red border and white background',
                'meaning' => 'Slow down and give the right of way to vehicles and pedestrians.',
                'what_to_do' => 'Slow down, be prepared to stop if necessary, and yield to other vehicles and pedestrians.',
                'image_url' => '⚠️',
                'shape' => 'triangle',
                'color_scheme' => 'red-white',
                'keywords' => ['yield', 'give way', 'slow down'],
                'is_popular' => true,
            ],
            [
                'name' => 'Speed Limit',
                'category' => 'regulatory',
                'description' => 'White rectangular sign with black numbers',
                'meaning' => 'The maximum legal speed allowed on this road under ideal conditions.',
                'what_to_do' => 'Do not exceed the posted speed limit. Adjust speed for weather and traffic conditions.',
                'image_url' => '🚦',
                'shape' => 'rectangle',
                'color_scheme' => 'white-black',
                'keywords' => ['speed', 'limit', 'mph', 'regulatory'],
                'is_popular' => true,
            ],
            [
                'name' => 'No Entry',
                'category' => 'regulatory',
                'description' => 'White horizontal bar on red circular background',
                'meaning' => 'You are not allowed to enter this road or area.',
                'what_to_do' => 'Do not enter. Find an alternative route.',
                'image_url' => '⛔',
                'shape' => 'circle',
                'color_scheme' => 'red-white',
                'keywords' => ['no entry', 'prohibited', 'restricted'],
                'is_popular' => false,
            ],
            [
                'name' => 'One Way',
                'category' => 'regulatory',
                'description' => 'White arrow on black rectangular background',
                'meaning' => 'Traffic moves in one direction only.',
                'what_to_do' => 'You may only travel in the direction indicated by the arrow.',
                'image_url' => '➡️',
                'shape' => 'rectangle',
                'color_scheme' => 'black-white',
                'keywords' => ['one way', 'direction', 'arrow'],
                'is_popular' => true,
            ],
            [
                'name' => 'Do Not Enter',
                'category' => 'regulatory',
                'description' => 'Red circle with white horizontal bar',
                'meaning' => 'Vehicles are not permitted to enter this area.',
                'what_to_do' => 'Turn around and find another route immediately.',
                'image_url' => '🚫',
                'shape' => 'circle',
                'color_scheme' => 'red-white',
                'keywords' => ['do not enter', 'wrong way', 'prohibited'],
                'is_popular' => true,
            ],
            [
                'name' => 'No Parking',
                'category' => 'regulatory',
                'description' => 'Red circle with diagonal line through letter P',
                'meaning' => 'Parking is not allowed in this area.',
                'what_to_do' => 'Do not park your vehicle here. You may receive a ticket or be towed.',
                'image_url' => '🅿️',
                'shape' => 'circle',
                'color_scheme' => 'red-white-black',
                'keywords' => ['no parking', 'parking prohibited'],
                'is_popular' => true,
            ],
            [
                'name' => 'No U-Turn',
                'category' => 'regulatory',
                'description' => 'Red circle with U-turn arrow crossed out',
                'meaning' => 'U-turns are prohibited.',
                'what_to_do' => 'Do not make a U-turn. Continue ahead and turn around at a legal location.',
                'image_url' => '↩️',
                'shape' => 'circle',
                'color_scheme' => 'red-white-black',
                'keywords' => ['no u-turn', 'prohibited turn'],
                'is_popular' => false,
            ],

            // ========== WARNING SIGNS ==========
            [
                'name' => 'Sharp Turn Ahead',
                'category' => 'warning',
                'description' => 'Yellow diamond with black curved arrow',
                'meaning' => 'The road ahead curves sharply in the direction shown.',
                'what_to_do' => 'Slow down before entering the curve. Stay in your lane.',
                'image_url' => '↪️',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['turn', 'curve', 'bend', 'warning'],
                'is_popular' => true,
            ],
            [
                'name' => 'Pedestrian Crossing',
                'category' => 'warning',
                'description' => 'Yellow diamond with pedestrian symbol',
                'meaning' => 'Watch for pedestrians crossing or entering the roadway.',
                'what_to_do' => 'Reduce speed and be prepared to stop for pedestrians.',
                'image_url' => '🚶',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['pedestrian', 'crossing', 'people', 'crosswalk'],
                'is_popular' => true,
            ],
            [
                'name' => 'School Zone',
                'category' => 'warning',
                'description' => 'Yellow pentagon with children symbol',
                'meaning' => 'You are entering a school zone with children present.',
                'what_to_do' => 'Reduce speed to the posted school zone speed limit. Watch for children.',
                'image_url' => '🏫',
                'shape' => 'pentagon',
                'color_scheme' => 'yellow-black',
                'keywords' => ['school', 'children', 'zone'],
                'is_popular' => true,
            ],
            [
                'name' => 'Traffic Signal Ahead',
                'category' => 'warning',
                'description' => 'Yellow diamond with traffic light symbol',
                'meaning' => 'There is a traffic signal ahead.',
                'what_to_do' => 'Be prepared to stop if the light is red or yellow.',
                'image_url' => '🚦',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['traffic light', 'signal', 'stoplight'],
                'is_popular' => false,
            ],
            [
                'name' => 'Slippery When Wet',
                'category' => 'warning',
                'description' => 'Yellow diamond with car skidding symbol',
                'meaning' => 'The road becomes slippery when wet.',
                'what_to_do' => 'Reduce speed in wet conditions and avoid sudden braking.',
                'image_url' => '💦',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['slippery', 'wet', 'rain', 'caution'],
                'is_popular' => true,
            ],
            [
                'name' => 'Deer Crossing',
                'category' => 'warning',
                'description' => 'Yellow diamond with deer symbol',
                'meaning' => 'Deer frequently cross the road in this area.',
                'what_to_do' => 'Be alert, especially at dawn and dusk. Slow down and watch for animals.',
                'image_url' => '🦌',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['deer', 'animal', 'wildlife', 'crossing'],
                'is_popular' => false,
            ],
            [
                'name' => 'Railroad Crossing',
                'category' => 'warning',
                'description' => 'Yellow circle with X and R symbols',
                'meaning' => 'A railroad crossing is ahead.',
                'what_to_do' => 'Slow down, look both ways, and be prepared to stop. Never stop on the tracks.',
                'image_url' => '🚂',
                'shape' => 'circle',
                'color_scheme' => 'yellow-black',
                'keywords' => ['railroad', 'train', 'tracks', 'crossing'],
                'is_popular' => true,
            ],
            [
                'name' => 'Hill / Steep Grade',
                'category' => 'warning',
                'description' => 'Yellow diamond with truck on slope',
                'meaning' => 'A steep downgrade is ahead.',
                'what_to_do' => 'Use lower gear and check brakes. Trucks should use escape ramps if needed.',
                'image_url' => '⛰️',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['hill', 'grade', 'steep', 'slope'],
                'is_popular' => false,
            ],
            [
                'name' => 'Merge',
                'category' => 'warning',
                'description' => 'Yellow diamond with merging arrows',
                'meaning' => 'Traffic from another roadway merges ahead.',
                'what_to_do' => 'Be prepared to adjust speed and position to allow merging traffic.',
                'image_url' => '🔀',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['merge', 'join', 'traffic'],
                'is_popular' => true,
            ],

            // ========== INFORMATION SIGNS ==========
            [
                'name' => 'Hospital',
                'category' => 'information',
                'description' => 'Blue rectangle with white H symbol',
                'meaning' => 'A hospital or medical facility is nearby.',
                'what_to_do' => 'Be aware of emergency vehicles and patients in the area.',
                'image_url' => '🏥',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['hospital', 'medical', 'health', 'emergency'],
                'is_popular' => true,
            ],
            [
                'name' => 'Gas Station',
                'category' => 'information',
                'description' => 'Blue rectangle with gas pump symbol',
                'meaning' => 'A gas station is available ahead.',
                'what_to_do' => 'Note the location if you need fuel.',
                'image_url' => '⛽',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['gas', 'fuel', 'station', 'petrol'],
                'is_popular' => true,
            ],
            [
                'name' => 'Rest Area',
                'category' => 'information',
                'description' => 'Blue rectangle with rest area symbol',
                'meaning' => 'A rest stop is available ahead.',
                'what_to_do' => 'Take a break if tired. Use facilities and rest before continuing.',
                'image_url' => '🅿️',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['rest', 'stop', 'park', 'break'],
                'is_popular' => true,
            ],
            [
                'name' => 'Food Services',
                'category' => 'information',
                'description' => 'Blue rectangle with knife and fork symbol',
                'meaning' => 'Food and dining options are available.',
                'what_to_do' => 'Exit here for restaurants or food services.',
                'image_url' => '🍴',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['food', 'restaurant', 'dining'],
                'is_popular' => false,
            ],
            [
                'name' => 'Lodging',
                'category' => 'information',
                'description' => 'Blue rectangle with bed symbol',
                'meaning' => 'Hotels or motels are available in this area.',
                'what_to_do' => 'Exit here for overnight accommodations.',
                'image_url' => '🏨',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['hotel', 'motel', 'lodging', 'accommodation'],
                'is_popular' => false,
            ],
            [
                'name' => 'Telephone',
                'category' => 'information',
                'description' => 'Blue rectangle with phone symbol',
                'meaning' => 'Public telephone available.',
                'what_to_do' => 'Stop here if you need to make an emergency call.',
                'image_url' => '📞',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['phone', 'telephone', 'call'],
                'is_popular' => false,
            ],
            [
                'name' => 'Disabled Parking',
                'category' => 'information',
                'description' => 'Blue rectangle with wheelchair symbol',
                'meaning' => 'Parking reserved for vehicles with disabled permits.',
                'what_to_do' => 'Only park here if you have a valid disabled parking permit.',
                'image_url' => '♿',
                'shape' => 'rectangle',
                'color_scheme' => 'blue-white',
                'keywords' => ['disabled', 'handicapped', 'parking', 'wheelchair'],
                'is_popular' => true,
            ],

            // ========== GUIDE SIGNS ==========
            [
                'name' => 'Interstate Highway',
                'category' => 'guide',
                'description' => 'Red, white, and blue shield with highway number',
                'meaning' => 'Interstate highway route marker.',
                'what_to_do' => 'Use this to identify the interstate highway number.',
                'image_url' => '🛣️',
                'shape' => 'shield',
                'color_scheme' => 'red-white-blue',
                'keywords' => ['interstate', 'highway', 'route', 'number'],
                'is_popular' => true,
            ],
            [
                'name' => 'Exit',
                'category' => 'guide',
                'description' => 'Green rectangular sign with white letters',
                'meaning' => 'Highway exit ahead with exit number and destinations.',
                'what_to_do' => 'Use this to identify your exit and prepare to exit.',
                'image_url' => '🚪',
                'shape' => 'rectangle',
                'color_scheme' => 'green-white',
                'keywords' => ['exit', 'highway', 'leave', 'off-ramp'],
                'is_popular' => true,
            ],
            [
                'name' => 'Distance Sign',
                'category' => 'guide',
                'description' => 'Green sign showing cities and distances',
                'meaning' => 'Shows distance to upcoming cities or destinations.',
                'what_to_do' => 'Use this to estimate travel time and plan fuel stops.',
                'image_url' => '🗺️',
                'shape' => 'rectangle',
                'color_scheme' => 'green-white',
                'keywords' => ['distance', 'miles', 'city', 'destination'],
                'is_popular' => false,
            ],
            [
                'name' => 'Mile Marker',
                'category' => 'guide',
                'description' => 'Small green sign with white numbers',
                'meaning' => 'Indicates your location along the highway.',
                'what_to_do' => 'Use for navigation or reporting location in emergencies.',
                'image_url' => '📍',
                'shape' => 'rectangle',
                'color_scheme' => 'green-white',
                'keywords' => ['mile', 'marker', 'location', 'position'],
                'is_popular' => false,
            ],
            [
                'name' => 'Airport',
                'category' => 'guide',
                'description' => 'Brown sign with airplane symbol',
                'meaning' => 'Direction to nearby airport.',
                'what_to_do' => 'Follow directional signs if heading to airport.',
                'image_url' => '✈️',
                'shape' => 'rectangle',
                'color_scheme' => 'brown-white',
                'keywords' => ['airport', 'plane', 'flight'],
                'is_popular' => true,
            ],
        ];
    }

    private function createQuizQuestions($sign): void
    {
        $questions = [];

        // Generate questions based on sign slug
        switch ($sign->slug) {
            case 'stop-sign':
                $questions = [
                    [
                        'question' => 'What shape is a stop sign?',
                        'options' => ['Circle', 'Triangle', 'Octagon', 'Square'],
                        'correct_option_index' => 2,
                        'explanation' => 'A stop sign is an octagon (8-sided shape), which is unique to stop signs.',
                        'difficulty' => 'easy',
                    ],
                    [
                        'question' => 'What must you do at a stop sign?',
                        'options' => [
                            'Slow down and proceed',
                            'Come to a complete stop',
                            'Honk your horn',
                            'Flash your lights',
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'You must come to a complete stop at the marked line or before entering the intersection.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'yield-sign':
                $questions = [
                    [
                        'question' => 'What shape is a yield sign?',
                        'options' => ['Octagon', 'Circle', 'Inverted Triangle', 'Diamond'],
                        'correct_option_index' => 2,
                        'explanation' => 'Yield signs are inverted (upside-down) triangles with a red border and white background.',
                        'difficulty' => 'easy',
                    ],
                    [
                        'question' => 'What does a yield sign require you to do?',
                        'options' => [
                            'Stop completely',
                            'Speed up to merge',
                            'Slow down and give way to other traffic',
                            'Proceed without stopping',
                        ],
                        'correct_option_index' => 2,
                        'explanation' => 'A yield sign requires you to slow down and give the right of way to other vehicles and pedestrians.',
                        'difficulty' => 'medium',
                    ],
                ];
                break;

            case 'speed-limit':
                $questions = [
                    [
                        'question' => 'A speed limit sign shows:',
                        'options' => [
                            'The minimum speed allowed',
                            'The maximum speed allowed under ideal conditions',
                            'The recommended speed',
                            'The average speed of traffic',
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'Speed limit signs show the maximum legal speed under ideal driving conditions.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'pedestrian-crossing':
                $questions = [
                    [
                        'question' => 'When you see a pedestrian crossing sign, you should:',
                        'options' => [
                            'Speed up to pass quickly',
                            'Honk to warn pedestrians',
                            'Reduce speed and watch for pedestrians',
                            'Ignore it unless you see someone crossing',
                        ],
                        'correct_option_index' => 2,
                        'explanation' => 'Pedestrian crossing signs warn you to slow down and be prepared to stop for people crossing.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'school-zone':
                $questions = [
                    [
                        'question' => 'In a school zone, you should:',
                        'options' => [
                            'Maintain highway speed',
                            'Reduce speed and watch for children',
                            'Only slow down if school is in session',
                            'Speed up to pass quickly',
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'Always reduce speed in school zones and watch carefully for children who may enter the roadway.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'railroad-crossing':
                $questions = [
                    [
                        'question' => 'At a railroad crossing sign, you should:',
                        'options' => [
                            'Speed up to cross quickly',
                            'Stop on the tracks and look',
                            'Slow down, look both ways, and be prepared to stop',
                            'Cross without looking if no train is visible',
                        ],
                        'correct_option_index' => 2,
                        'explanation' => 'Always slow down at railroad crossings, look both ways, and never stop on the tracks.',
                        'difficulty' => 'medium',
                    ],
                ];
                break;

            case 'sharp-turn-ahead':
                $questions = [
                    [
                        'question' => 'When you see a sharp turn warning sign, you should:',
                        'options' => [
                            'Maintain your current speed',
                            'Speed up through the turn',
                            'Slow down before entering the curve',
                            'Honk your horn',
                        ],
                        'correct_option_index' => 2,
                        'explanation' => 'Always slow down before entering a sharp curve to maintain control of your vehicle.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'one-way':
                $questions = [
                    [
                        'question' => 'A one-way sign means:',
                        'options' => [
                            'You can go in either direction',
                            'Traffic moves in one direction only',
                            'Only one vehicle at a time',
                            'One lane road ahead',
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'One-way signs indicate that all traffic must travel in the direction shown by the arrow.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            default:
                // Generic questions for signs without specific questions
                $questions = [
                    [
                        'question' => "What category does the \"{$sign->name}\" belong to?",
                        'options' => ['Warning', 'Regulatory', 'Information', 'Guide'],
                        'correct_option_index' => array_search(
                            ucfirst($sign->category),
                            ['Warning', 'Regulatory', 'Information', 'Guide']
                        ),
                        'explanation' => "The {$sign->name} is a {$sign->category} sign. {$sign->meaning}",
                        'difficulty' => 'medium',
                    ],
                ];
        }

        foreach ($questions as $questionData) {
            RoadSignQuizQuestion::create([
                'road_sign_id' => $sign->id,
                'question' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_option_index' => $questionData['correct_option_index'],
                'explanation' => $questionData['explanation'],
                'difficulty' => $questionData['difficulty'],
            ]);
        }
    }
}
