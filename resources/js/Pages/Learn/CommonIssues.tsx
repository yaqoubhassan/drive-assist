import Layout from '@/Components/Layout/Layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CommonIssues() {
  const [activeCategory, setActiveCategory] = useState('engine');

  const issues = {
    engine: [
      {
        problem: 'Car Won\'t Start',
        symptoms: ['Engine cranks but doesn\'t start', 'Clicking sound when turning key', 'Complete silence'],
        causes: ['Dead battery', 'Faulty starter motor', 'Empty fuel tank', 'Bad alternator'],
        solutions: [
          'Check battery connections - clean corrosion',
          'Try jump-starting the battery',
          'Check fuel gauge - add fuel if empty',
          'If clicking sound, likely starter motor issue - call mechanic',
        ],
        difficulty: 'Easy',
        cost: 'GH₵ 50 - 500',
        urgent: true,
      },
      {
        problem: 'Engine Overheating',
        symptoms: ['Temperature gauge in red zone', 'Steam from hood', 'Sweet smell from engine'],
        causes: ['Low coolant level', 'Leaking radiator', 'Broken water pump', 'Faulty thermostat'],
        solutions: [
          'STOP driving immediately to prevent engine damage',
          'Let engine cool for 30 minutes',
          'Check coolant level when cool',
          'Look for leaks under car',
          'Top up coolant if low',
          'If problem persists, call mechanic',
        ],
        difficulty: 'Medium',
        cost: 'GH₵ 100 - 1,000',
        urgent: true,
      },
      {
        problem: 'Check Engine Light On',
        symptoms: ['Warning light on dashboard', 'May have reduced performance'],
        causes: ['Loose gas cap', 'Oxygen sensor failure', 'Catalytic converter issue', 'Spark plug problems'],
        solutions: [
          'Check if gas cap is loose - tighten it',
          'If light stays on after 3 drives, get diagnostic scan',
          'Don\'t ignore - small issues become expensive',
          'Visit mechanic for OBD-II scan',
        ],
        difficulty: 'Medium',
        cost: 'GH₵ 50 - 2,000',
        urgent: false,
      },
    ],
    electrical: [
      {
        problem: 'Battery Keeps Dying',
        symptoms: ['Need frequent jump starts', 'Dim lights', 'Slow cranking'],
        causes: ['Old battery (3+ years)', 'Parasitic drain', 'Faulty alternator', 'Corroded terminals'],
        solutions: [
          'Clean battery terminals with baking soda solution',
          'Test battery voltage (should be 12.6V when off)',
          'Check alternator output (should be 13.5-14.5V when running)',
          'Replace battery if over 3 years old',
          'Check for lights/accessories left on',
        ],
        difficulty: 'Easy to Medium',
        cost: 'GH₵ 200 - 800',
        urgent: false,
      },
      {
        problem: 'Headlights Not Working',
        symptoms: ['One or both headlights out', 'Flickering lights', 'Dim lights'],
        causes: ['Burned out bulb', 'Blown fuse', 'Bad relay', 'Wiring issue'],
        solutions: [
          'Check bulbs - replace if burned out (DIY friendly)',
          'Check fuse box for blown headlight fuse',
          'Inspect wiring for damage',
          'If both sides out, likely fuse or relay',
          'If one side out, likely bulb',
        ],
        difficulty: 'Easy',
        cost: 'GH₵ 20 - 300',
        urgent: true,
      },
    ],
    brakes: [
      {
        problem: 'Squeaking or Grinding Brakes',
        symptoms: ['High-pitched squeal when braking', 'Grinding metal sound', 'Vibration in brake pedal'],
        causes: ['Worn brake pads', 'Warped rotors', 'Debris in brakes', 'Lack of lubrication'],
        solutions: [
          'Squeaking = warning - brake pads getting thin',
          'Grinding = URGENT - metal on metal damage',
          'Stop driving immediately if grinding',
          'Inspect brake pads thickness',
          'Replace pads if less than 3mm thick',
          'Get professional inspection ASAP',
        ],
        difficulty: 'Hard (Professional)',
        cost: 'GH₵ 300 - 1,500',
        urgent: true,
      },
      {
        problem: 'Soft or Spongy Brake Pedal',
        symptoms: ['Pedal goes to floor', 'Requires more pressure to stop', 'Mushy feeling'],
        causes: ['Air in brake lines', 'Brake fluid leak', 'Worn brake pads', 'Master cylinder failure'],
        solutions: [
          'Check brake fluid level immediately',
          'Look under car for leaks',
          'DO NOT drive if pedal goes to floor',
          'Likely needs brake bleeding',
          'Call mechanic or tow truck',
        ],
        difficulty: 'Hard (Professional)',
        cost: 'GH₵ 200 - 1,200',
        urgent: true,
      },
    ],
    tires: [
      {
        problem: 'Flat Tire',
        symptoms: ['Car pulling to one side', 'Thumping sound', 'Visible deflation'],
        causes: ['Puncture from nail/debris', 'Valve stem leak', 'Rim damage', 'Worn tire'],
        solutions: [
          'Pull over safely - use hazard lights',
          'Use spare tire if available',
          'Call roadside assistance if no spare',
          'Don\'t drive on flat - damages rim',
          'Get tire repaired or replaced',
          'Check other tires while you\'re at it',
        ],
        difficulty: 'Medium',
        cost: 'GH₵ 50 - 500',
        urgent: true,
      },
      {
        problem: 'Uneven Tire Wear',
        symptoms: ['Bald spots on tires', 'Excessive wear on edges', 'Car pulling to side'],
        causes: ['Improper alignment', 'Wrong tire pressure', 'Suspension issues', 'Lack of rotation'],
        solutions: [
          'Check tire pressure monthly (recommended PSI on door jamb)',
          'Rotate tires every 10,000 km',
          'Get wheel alignment checked',
          'Inspect suspension components',
          'Replace tires when tread depth below 2mm',
        ],
        difficulty: 'Medium (Professional)',
        cost: 'GH₵ 150 - 2,000',
        urgent: false,
      },
    ],
  };

  const categories = [
    { key: 'engine', name: 'Engine Issues', icon: '🔧' },
    { key: 'electrical', name: 'Electrical', icon: '⚡' },
    { key: 'brakes', name: 'Brakes', icon: '🛑' },
    { key: 'tires', name: 'Tires', icon: '🔘' },
  ];

  return (
    <Layout
      title="Common Car Problems & Solutions"
      description="Quick DIY fixes for common car issues. Learn to diagnose and solve engine, electrical, brake, and tire problems."
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Common Issues</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Common Car Problems & Solutions</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Quick diagnostic guide and DIY solutions for the most common car problems. Know when you can fix it yourself and when to call a mechanic.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${activeCategory === cat.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Issues List */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {issues[activeCategory as keyof typeof issues].map((issue, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{issue.problem}</h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${issue.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        issue.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {issue.difficulty}
                      </span>
                      {issue.urgent && (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
                          🚨 Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🔍</span>
                        Symptoms
                      </h4>
                      <ul className="space-y-1 mb-4">
                        {issue.symptoms.map((symptom, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="mr-2 text-primary-600">•</span>
                            {symptom}
                          </li>
                        ))}
                      </ul>

                      <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Possible Causes
                      </h4>
                      <ul className="space-y-1">
                        {issue.causes.map((cause, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="mr-2 text-orange-600">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🛠️</span>
                        Solutions
                      </h4>
                      <ol className="space-y-2">
                        {issue.solutions.map((solution, idx) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="mr-2 font-bold text-green-600">{idx + 1}.</span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Cost Estimate */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <span className="font-semibold text-gray-900">Estimated Cost: </span>
                        <span className="text-blue-700 font-bold">{issue.cost}</span>
                      </div>
                      <Link href="/troubleshoot" className="btn-primary text-sm">
                        Get AI Diagnosis
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Call a Mechanic */}
      <section className="py-12 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">⚠️ When to Call a Mechanic IMMEDIATELY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Brake failure or soft pedal',
              'Engine overheating (steam/smoke)',
              'Strange grinding/knocking sounds',
              'Fluid leaking rapidly',
              'Steering problems',
              'Engine won\'t start repeatedly',
              'Check engine light flashing',
              'Complete electrical failure',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">🚨</span>
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/find-expert" className="btn-primary bg-white text-red-600 hover:bg-gray-100 inline-block">
              Find Expert Mechanic Now
            </Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/learn/driving-tips" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Driving Tips</h3>
              <p className="text-gray-600">Improve your driving skills and vehicle maintenance knowledge.</p>
            </Link>
            <Link href="/troubleshoot" className="card hover:scale-105 transform transition bg-primary-50 border-2 border-primary-600">
              <h3 className="text-xl font-bold text-primary-600 mb-2">AI Troubleshoot</h3>
              <p className="text-gray-600">Get instant AI-powered diagnosis for your specific issue.</p>
            </Link>
            <Link href="/learn/beginner-guide" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Beginner's Guide</h3>
              <p className="text-gray-600">Complete guide for new drivers and car owners.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}