import Layout from '@/Components/Layout/Layout';
import { Link } from '@inertiajs/react';

export default function RoadSigns() {
  const signCategories = [
    {
      category: 'Warning Signs',
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      signs: [
        {
          name: 'Sharp Curve Ahead',
          description: 'Warns of a sharp turn or curve in the road ahead. Reduce speed and prepare to turn.',
          image: '🔄',
          tip: 'Slow down before entering the curve, not during it.',
        },
        {
          name: 'Pedestrian Crossing',
          description: 'Indicates a designated pedestrian crossing area. Be prepared to stop for pedestrians.',
          image: '🚶',
          tip: 'Always give right of way to pedestrians at crossings.',
        },
        {
          name: 'Road Narrows',
          description: 'The road ahead becomes narrower. Be prepared to merge or reduce width.',
          image: '⚠️',
          tip: 'Check mirrors and be aware of vehicles beside you.',
        },
        {
          name: 'Slippery Road',
          description: 'Road surface may be slippery when wet. Exercise caution and reduce speed.',
          image: '💧',
          tip: 'Increase following distance in wet conditions.',
        },
      ],
    },
    {
      category: 'Regulatory Signs',
      color: 'border-red-500',
      bgColor: 'bg-red-50',
      signs: [
        {
          name: 'Stop Sign',
          description: 'Come to a complete stop. Check all directions before proceeding.',
          image: '🛑',
          tip: 'Your vehicle must come to a COMPLETE stop, not just slow down.',
        },
        {
          name: 'Speed Limit',
          description: 'Maximum speed allowed on this road. Adjust to road conditions.',
          image: '⚡',
          tip: 'Speed limits are maximums - drive slower in poor conditions.',
        },
        {
          name: 'No Entry',
          description: 'Vehicles are not permitted to enter. Usually for one-way streets.',
          image: '🚫',
          tip: 'Severe penalties for ignoring this sign. Always obey.',
        },
        {
          name: 'No Parking',
          description: 'Parking is prohibited in this area. May result in towing or fines.',
          image: '🅿️',
          tip: 'Look for time restrictions - some are only during certain hours.',
        },
      ],
    },
    {
      category: 'Informational Signs',
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      signs: [
        {
          name: 'Hospital Ahead',
          description: 'Indicates a hospital is nearby. Useful in emergencies.',
          image: '🏥',
          tip: 'Note these locations for emergencies during your regular routes.',
        },
        {
          name: 'Gas Station',
          description: 'Fuel station ahead. Plan refueling stops accordingly.',
          image: '⛽',
          tip: 'Don\'t let your tank go below 1/4 full for engine health.',
        },
        {
          name: 'Rest Area',
          description: 'Rest stop or parking area ahead for taking breaks.',
          image: '🅿️',
          tip: 'Take a break every 2 hours on long trips to stay alert.',
        },
        {
          name: 'Detour',
          description: 'Alternative route due to road closure or construction.',
          image: '↪️',
          tip: 'Follow detour signs carefully - they\'ll lead you back to your route.',
        },
      ],
    },
  ];

  return (
    <Layout
      title="Complete Road Signs Guide"
      description="Learn the meaning of all road signs in Ghana. Warning signs, regulatory signs, and informational signs explained with tips."
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Road Signs</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Road Signs Guide</h1>
          <p className="text-xl text-red-100 max-w-3xl">
            Understanding road signs is crucial for safe driving. Learn the meaning and proper response to every sign you'll encounter on Ghanaian roads.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Road Signs Matter</h2>
            <p className="text-gray-700 mb-4">
              Road signs are the universal language of the road. They communicate important information about road conditions, regulations, and hazards. Ignoring or misunderstanding road signs can lead to accidents, traffic violations, and fines.
            </p>
            <p className="text-gray-700 mb-6">
              This comprehensive guide covers all major categories of road signs you'll encounter in Ghana, complete with practical tips for responding to each sign appropriately.
            </p>
          </div>
        </div>
      </section>

      {/* Sign Categories */}
      {signCategories.map((category, catIndex) => (
        <section key={catIndex} className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`border-l-4 ${category.color} pl-4 mb-8`}>
              <h2 className="text-3xl font-bold text-gray-900">{category.category}</h2>
              <p className="text-gray-600 mt-2">Essential signs for road safety and compliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.signs.map((sign, signIndex) => (
                <div key={signIndex} className={`${category.bgColor} border-2 ${category.color} rounded-xl p-6 hover:shadow-lg transition duration-300`}>
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl flex-shrink-0">{sign.image}</div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{sign.name}</h3>
                      <p className="text-gray-700 mb-3">{sign.description}</p>
                      <div className="bg-white bg-opacity-70 rounded-lg p-3 border-l-4 border-green-500">
                        <p className="text-sm text-gray-800">
                          <strong className="text-green-700">💡 Pro Tip:</strong> {sign.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Quick Tips */}
      <section className="py-12 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Tips for Road Signs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-2">Shape Matters</h3>
              <p>Different shapes indicate different types of signs - octagon for stop, triangle for yield, circle for regulatory.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-2">Color Coding</h3>
              <p>Red = mandatory/prohibition, Yellow = warning, Blue = information, Green = direction.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-2">Distance Awareness</h3>
              <p>Warning signs typically appear 50-200 meters before the hazard or change.</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="font-bold text-xl mb-2">Night Visibility</h3>
              <p>All official road signs are reflective. If a sign isn't visible at night, report it to authorities.</p>
            </div>
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
              <p className="text-gray-600">Learn advanced driving techniques and best practices.</p>
            </Link>
            <Link href="/learn/beginner-guide" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Beginner's Guide</h3>
              <p className="text-gray-600">Complete guide for new drivers starting their journey.</p>
            </Link>
            <Link href="/learn/common-issues" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Common Issues</h3>
              <p className="text-gray-600">Quick solutions to common car problems.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}