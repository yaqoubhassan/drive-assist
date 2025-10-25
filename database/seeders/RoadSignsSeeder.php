<?php

namespace Database\Seeders;

use App\Models\RoadSign;
use App\Models\RoadSignQuizQuestion;
use Illuminate\Database\Seeder;

class RoadSignsSeeder extends Seeder
{
    public function run(): void
    {
        $signs = [
            // WARNING SIGNS
            [
                'name' => 'Stop Sign',
                'category' => 'regulatory',
                'description' => 'Octagonal red sign with white letters',
                'meaning' => 'You must come to a complete stop at the marked stop line, crosswalk, or before entering the intersection.',
                'what_to_do' => 'Come to a complete stop, yield to vehicles and pedestrians, and proceed when safe.',
                'image_url' => '/images/road-signs/stop.svg',
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
                'image_url' => '/images/road-signs/yield.svg',
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
                'image_url' => '/images/road-signs/speed-limit.svg',
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
                'image_url' => '/images/road-signs/no-entry.svg',
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
                'image_url' => '/images/road-signs/one-way.svg',
                'shape' => 'rectangle',
                'color_scheme' => 'black-white',
                'keywords' => ['one way', 'direction', 'arrow'],
                'is_popular' => true,
            ],

            // WARNING SIGNS
            [
                'name' => 'Sharp Turn Ahead',
                'category' => 'warning',
                'description' => 'Yellow diamond with black curved arrow',
                'meaning' => 'The road ahead curves sharply in the direction shown.',
                'what_to_do' => 'Slow down before entering the curve. Stay in your lane.',
                'image_url' => '/images/road-signs/sharp-turn.svg',
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
                'image_url' => '/images/road-signs/pedestrian-crossing.svg',
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
                'image_url' => '/images/road-signs/school-zone.svg',
                'shape' => 'pentagon',
                'color_scheme' => 'yellow-black',
                'keywords' => ['school', 'children', 'zone', 'warning'],
                'is_popular' => true,
            ],
            [
                'name' => 'Slippery When Wet',
                'category' => 'warning',
                'description' => 'Yellow diamond with skidding car symbol',
                'meaning' => 'The road may be slippery when wet.',
                'what_to_do' => 'Reduce speed in wet conditions. Avoid sudden braking or sharp turns.',
                'image_url' => '/images/road-signs/slippery.svg',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['slippery', 'wet', 'rain', 'skid'],
                'is_popular' => false,
            ],
            [
                'name' => 'Deer Crossing',
                'category' => 'warning',
                'description' => 'Yellow diamond with deer symbol',
                'meaning' => 'Watch for deer crossing the roadway.',
                'what_to_do' => 'Slow down and be alert, especially at dawn and dusk.',
                'image_url' => '/images/road-signs/deer-crossing.svg',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['deer', 'animal', 'crossing', 'wildlife'],
                'is_popular' => false,
            ],
            [
                'name' => 'Merge',
                'category' => 'warning',
                'description' => 'Yellow diamond with merging arrows',
                'meaning' => 'Traffic from another road will be merging with your lane.',
                'what_to_do' => 'Be prepared to adjust speed. Watch for merging vehicles.',
                'image_url' => '/images/road-signs/merge.svg',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['merge', 'join', 'traffic', 'lane'],
                'is_popular' => true,
            ],
            [
                'name' => 'Railroad Crossing',
                'category' => 'warning',
                'description' => 'Yellow circle with X and RR letters',
                'meaning' => 'A railroad crossing is ahead.',
                'what_to_do' => 'Slow down, look both ways, and be prepared to stop for trains.',
                'image_url' => '/images/road-signs/railroad.svg',
                'shape' => 'circle',
                'color_scheme' => 'yellow-black',
                'keywords' => ['railroad', 'train', 'crossing', 'tracks'],
                'is_popular' => true,
            ],
            [
                'name' => 'Hill',
                'category' => 'warning',
                'description' => 'Yellow diamond with upward arrow and percentage',
                'meaning' => 'Steep hill or grade ahead.',
                'what_to_do' => 'Use lower gear when descending. Check brakes before descent.',
                'image_url' => '/images/road-signs/hill.svg',
                'shape' => 'diamond',
                'color_scheme' => 'yellow-black',
                'keywords' => ['hill', 'grade', 'steep', 'slope'],
                'is_popular' => false,
            ],

            // INFORMATION SIGNS
            [
                'name' => 'Hospital',
                'category' => 'information',
                'description' => 'Blue square with white H symbol',
                'meaning' => 'Hospital or medical services available.',
                'what_to_do' => 'Note location for emergency medical needs.',
                'image_url' => '/images/road-signs/hospital.svg',
                'shape' => 'square',
                'color_scheme' => 'blue-white',
                'keywords' => ['hospital', 'medical', 'emergency', 'health'],
                'is_popular' => true,
            ],
            [
                'name' => 'Gas Station',
                'category' => 'information',
                'description' => 'Blue square with gas pump symbol',
                'meaning' => 'Gas station or fuel services ahead.',
                'what_to_do' => 'Note location if you need fuel.',
                'image_url' => '/images/road-signs/gas-station.svg',
                'shape' => 'square',
                'color_scheme' => 'blue-white',
                'keywords' => ['gas', 'fuel', 'station', 'petrol'],
                'is_popular' => true,
            ],
            [
                'name' => 'Rest Area',
                'category' => 'information',
                'description' => 'Blue square with rest area symbol',
                'meaning' => 'Rest area with facilities ahead.',
                'what_to_do' => 'Exit here if you need to rest or use facilities.',
                'image_url' => '/images/road-signs/rest-area.svg',
                'shape' => 'square',
                'color_scheme' => 'blue-white',
                'keywords' => ['rest', 'area', 'facilities', 'break'],
                'is_popular' => false,
            ],
            [
                'name' => 'Food',
                'category' => 'information',
                'description' => 'Blue square with fork and knife symbol',
                'meaning' => 'Food services or restaurants available.',
                'what_to_do' => 'Exit here if you need food.',
                'image_url' => '/images/road-signs/food.svg',
                'shape' => 'square',
                'color_scheme' => 'blue-white',
                'keywords' => ['food', 'restaurant', 'dining', 'eat'],
                'is_popular' => false,
            ],
            [
                'name' => 'Lodging',
                'category' => 'information',
                'description' => 'Blue square with bed symbol',
                'meaning' => 'Hotels or lodging available.',
                'what_to_do' => 'Exit here if you need accommodation.',
                'image_url' => '/images/road-signs/lodging.svg',
                'shape' => 'square',
                'color_scheme' => 'blue-white',
                'keywords' => ['hotel', 'lodging', 'accommodation', 'sleep'],
                'is_popular' => false,
            ],

            // GUIDE SIGNS
            [
                'name' => 'Interstate Highway',
                'category' => 'guide',
                'description' => 'Red, white, and blue shield with highway number',
                'meaning' => 'Interstate highway route marker.',
                'what_to_do' => 'Use this to identify and navigate interstate highways.',
                'image_url' => '/images/road-signs/interstate.svg',
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
                'image_url' => '/images/road-signs/exit.svg',
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
                'image_url' => '/images/road-signs/distance.svg',
                'shape' => 'rectangle',
                'color_scheme' => 'green-white',
                'keywords' => ['distance', 'miles', 'city', 'destination'],
                'is_popular' => false,
            ],
        ];

        foreach ($signs as $signData) {
            $sign = RoadSign::create($signData);

            // Add quiz questions for each sign
            $this->createQuizQuestions($sign);
        }
    }

    private function createQuizQuestions($sign)
    {
        $questions = [];

        switch ($sign->slug) {
            case 'stop-sign':
                $questions = [
                    [
                        'question' => 'What shape is a stop sign?',
                        'options' => ['Circle', 'Triangle', 'Octagon', 'Square'],
                        'correct_option_index' => 2,
                        'explanation' => 'A stop sign is an octagon (8-sided shape), which is unique to stop signs in the US.',
                        'difficulty' => 'easy',
                    ],
                    [
                        'question' => 'What must you do at a stop sign?',
                        'options' => [
                            'Slow down and proceed',
                            'Come to a complete stop',
                            'Honk your horn',
                            'Flash your lights'
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
                        'question' => 'What does a yield sign mean?',
                        'options' => [
                            'Stop completely',
                            'Speed up',
                            'Slow down and give right of way',
                            'Turn around'
                        ],
                        'correct_option_index' => 2,
                        'explanation' => 'A yield sign means you must slow down and give the right of way to other vehicles and pedestrians.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'speed-limit':
                $questions = [
                    [
                        'question' => 'A speed limit sign shows:',
                        'options' => [
                            'Minimum speed allowed',
                            'Maximum speed allowed',
                            'Suggested speed',
                            'Average speed'
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'Speed limit signs show the maximum legal speed you can travel under ideal conditions.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'sharp-turn-ahead':
                $questions = [
                    [
                        'question' => 'What should you do when you see this sign?',
                        'options' => [
                            'Speed up',
                            'Slow down before the curve',
                            'Maintain current speed',
                            'Change lanes'
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'You should slow down before entering a sharp curve to maintain control.',
                        'difficulty' => 'easy',
                    ],
                ];
                break;

            case 'school-zone':
                $questions = [
                    [
                        'question' => 'When should you be most cautious in a school zone?',
                        'options' => [
                            'Only during summer',
                            'During school hours',
                            'At night',
                            'On weekends'
                        ],
                        'correct_option_index' => 1,
                        'explanation' => 'Be most cautious during school hours when children are arriving or leaving.',
                        'difficulty' => 'medium',
                    ],
                ];
                break;
        }

        foreach ($questions as $questionData) {
            RoadSignQuizQuestion::create([
                'road_sign_id' => $sign->id,
                ...$questionData,
            ]);
        }
    }
}
