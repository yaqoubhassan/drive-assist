import Layout from '@/Components/Layout/Layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function DrivingTips() {
  const [selectedTopic, setSelectedTopic] = useState('safety');

  const topics = {
    safety: {
      title: 'Safety First',
      icon: '🛡️',
      color: 'bg-green-600',
      tips: [
        {
          title: 'Always Wear Your Seatbelt',
          description: 'Seatbelts reduce the risk of death by 45% and serious injury by 50%. Make it a habit before starting the engine.',
          details: [
            'Adjust the belt so it sits low across your hips',
            'The shoulder belt should cross the middle of your chest',
            'Never put the shoulder belt under your arm or behind your back',
            'Ensure all passengers buckle up before driving',
          ],
          priority: 'Critical',
        },
        {
          title: 'Maintain Safe Following Distance',
          description: 'Use the "3-second rule" - pick a fixed point and count 3 seconds after the car ahead passes it.',
          details: [
            'In rain, increase to 4-5 seconds',
            'In heavy traffic, don\'t tailgate even if others do',
            'Larger vehicles need more stopping distance',
            'At highway speeds, consider the 3-second rule minimum',
          ],
          priority: 'High',
        },
        {
          title: 'Avoid Distracted Driving',
          description: 'Texting while driving makes you 23 times more likely to crash. Nothing is worth that risk.',
          details: [
            'Put phone on silent or "Do Not Disturb" mode',
            'Use hands-free for essential calls only',
            'Pull over safely if you need to text or use navigation',
            'Eating, grooming, and changing music are also distractions',
          ],
          priority: 'Critical',
        },
        {
          title: 'Check Blind Spots',
          description: 'Mirrors don\'t show everything. Always physically turn your head to check blind spots before changing lanes.',
          details: [
            'Adjust mirrors properly to minimize blind spots',
            'Quick shoulder check before lane changes',
            'Be extra cautious around motorcycles and bicycles',
            'Use turn signals well before changing lanes',
          ],
          priority: 'High',
        },
      ],
    },
    fuel: {
      title: 'Fuel Efficiency',
      icon: '⛽',
      color: 'bg-blue-600',
      tips: [
        {
          title: 'Drive Smoothly and Steadily',
          description: 'Aggressive driving (speeding, rapid acceleration, hard braking) can lower fuel economy by 15-30%.',
          details: [
            'Accelerate gradually and smoothly',
            'Anticipate traffic flow to avoid unnecessary braking',
            'Use cruise control on highways when appropriate',
            'Coast to decelerate when safe',
          ],
          priority: 'Medium',
        },
        {
          title: 'Maintain Proper Tire Pressure',
          description: 'Under-inflated tires can lower fuel economy by 0.2% for every 1 PSI drop in pressure.',
          details: [
            'Check tire pressure monthly when tires are cold',
            'Find recommended PSI on driver\'s door jamb',
            'Don\'t overinflate - follow manufacturer specs',
            'Properly inflated tires also last longer and are safer',
          ],
          priority: 'High',
        },
        {
          title: 'Reduce Excess Weight',
          description: 'Every extra 50kg can reduce fuel economy by 1-2%. Remove unnecessary items from your car.',
          details: [
            'Clean out trunk and back seat regularly',
            'Remove roof racks when not in use (they create drag)',
            'Don\'t use your car as a storage unit',
            'Keep only essentials: spare tire, jack, emergency kit',
          ],
          priority: 'Low',
        },
        {
          title: 'Avoid Excessive Idling',
          description: 'Idling can use a quarter to a half gallon of fuel per hour. Turn off engine if stopped for more than 60 seconds.',
          details: [
            'Modern engines don\'t need long warm-up periods',
            '30 seconds of idling is enough in most conditions',
            'Restart uses less fuel than idling for extended periods',
            'Exception: don\'t turn off in traffic jams for safety',
          ],
          priority: 'Medium',
        },
      ],
    },
    maintenance: {
      title: 'Maintenance Tips',
      icon: '🔧',
      color: 'bg-orange-600',
      tips: [
        {
          title: 'Regular Oil Changes',
          description: 'Change engine oil every 5,000-7,500 km or every 6 months, whichever comes first.',
          details: [
            'Use the oil grade specified in your owner\'s manual',
            'Check oil level monthly between changes',
            'Dark, dirty oil needs changing',
            'Regular changes extend engine life significantly',
          ],
          priority: 'Critical',
        },
        {
          title: 'Check Fluids Regularly',
          description: 'Beyond oil, your car has several critical fluids that need attention.',
          details: [
            'Coolant: Check level when engine is cold',
            'Brake fluid: Should be clear, not dark or cloudy',
            'Power steering fluid: Check if steering feels hard',
            'Windshield washer fluid: Refill as needed',
          ],
          priority: 'High',
        },
        {
          title: 'Replace Air Filter',
          description: 'A clogged air filter reduces fuel efficiency and engine performance. Replace every 15,000-30,000 km.',
          details: [
            'Easy DIY job - saves money on mechanic visits',
            'Check filter visually - if very dirty, replace it',
            'More frequent changes needed in dusty conditions',
            'Clean air filter can improve acceleration',
          ],
          priority: 'Medium',
        },
        {
          title: 'Rotate Tires',
          description: 'Rotate tires every 8,000-10,000 km to ensure even wear and extend tire life.',
          details: [
            'Proper rotation pattern depends on drive type (FWD/RWD/AWD)',
            'Check tread depth regularly (minimum 2mm)',
            'Uneven wear indicates alignment or suspension issues',
            'Properly maintained tires improve fuel economy',
          ],
          priority: 'Medium',
        },
      ],
    },
    weather: {
      title: 'Weather Conditions',
      icon: '🌧️',
      color: 'bg-purple-600',
      tips: [
        {
          title: 'Driving in Rain',
          description: 'Wet roads reduce traction significantly. Adjust your driving to compensate.',
          details: [
            'Reduce speed by 5-10 km/h below normal',
            'Increase following distance to 4-5 seconds',
            'Avoid sudden steering, braking, or acceleration',
            'Turn on headlights for visibility',
            'If hydroplaning, ease off gas and steer straight',
          ],
          priority: 'High',
        },
        {
          title: 'Night Driving',
          description: 'Vision is compromised at night. Take extra precautions to stay safe.',
          details: [
            'Ensure headlights are properly aimed and clean',
            'Use high beams on empty roads, low beams in traffic',
            'Reduce speed - you can\'t see hazards as early',
            'Look away from oncoming headlights to avoid glare',
            'Get eyes checked regularly - night vision declines with age',
          ],
          priority: 'High',
        },
        {
          title: 'Fog Driving',
          description: 'Fog can appear suddenly and reduce visibility to near zero.',
          details: [
            'Use low beam headlights (high beams reflect back)',
            'Use fog lights if your car has them',
            'Slow down significantly',
            'Use road edge markings as a guide',
            'If visibility is too poor, pull over safely and wait',
          ],
          priority: 'High',
        },
        {
          title: 'Hot Weather Driving',
          description: 'High temperatures put extra stress on your vehicle and can be dangerous.',
          details: [
            'Check tire pressure - heat causes expansion',
            'Monitor temperature gauge for overheating',
            'Keep coolant topped up',
            'Park in shade when possible',
            'Never leave children or pets in parked cars',
          ],
          priority: 'Medium',
        },
      ],
    },
  };

  const topicKeys = Object.keys(topics);

  return (
    <Layout
      title="Expert Driving Tips & Techniques"
      description="Improve your driving skills, fuel efficiency, and vehicle maintenance with expert tips. Stay safe on the road with proven techniques."
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Driving Tips</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert Driving Tips & Techniques</h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Master the art of safe, efficient, and confident driving with these proven tips from experienced drivers and automotive experts.
          </p>
        </div>
      </div>

      {/* Topic Selection */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4">
            {topicKeys.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedTopic(key)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${selectedTopic === key
                  ? topics[key as keyof typeof topics].color + ' text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span className="mr-2">{topics[key as keyof typeof topics].icon}</span>
                {topics[key as keyof typeof topics].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="text-4xl mr-3">{topics[selectedTopic as keyof typeof topics].icon}</span>
              {topics[selectedTopic as keyof typeof topics].title}
            </h2>
          </div>

          <div className="space-y-6">
            {topics[selectedTopic as keyof typeof topics].tips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{tip.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${tip.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      tip.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {tip.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg mb-4">{tip.description}</p>

                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-600">
                    <h4 className="font-bold text-gray-900 mb-3">💡 Key Points:</h4>
                    <ul className="space-y-2">
                      {tip.details.map((detail, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">🎯 Quick Reference: Essential Driving Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { rule: 'Speed Limit', tip: 'Adjust for conditions - posted limits are maximums' },
              { rule: '3-Second Rule', tip: 'Minimum following distance in good conditions' },
              { rule: 'Seatbelt Always', tip: 'Before starting engine, every single trip' },
              { rule: 'Phone Away', tip: 'Notifications can wait - your life can\'t' },
              { rule: 'Check Mirrors', tip: 'Every 5-8 seconds while driving' },
              { rule: 'Use Turn Signals', tip: 'Signal 30 meters before turning' },
              { rule: 'Both Hands', tip: '9 and 3 o\'clock position on steering wheel' },
              { rule: 'Stay Alert', tip: 'Break every 2 hours on long trips' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-bold text-lg mb-1">{item.rule}</h3>
                <p className="text-sm text-primary-100">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/learn/beginner-guide" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Beginner's Guide</h3>
              <p className="text-gray-600">Complete guide for new drivers starting their journey.</p>
            </Link>
            <Link href="/learn/common-issues" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Common Issues</h3>
              <p className="text-gray-600">Quick solutions to common car problems.</p>
            </Link>
            <Link href="/learn/road-signs" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Road Signs</h3>
              <p className="text-gray-600">Learn the meaning of all road signs.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}