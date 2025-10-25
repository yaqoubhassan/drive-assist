import Layout from '@/Components/Layout/Layout';
import { Link } from '@inertiajs/react';

export default function BeginnerGuide() {
  const sections = [
    {
      title: 'Before You Start Driving',
      icon: '📋',
      color: 'bg-blue-600',
      content: [
        {
          heading: 'Get Your Driver\'s License',
          points: [
            'Complete required driver education course',
            'Pass written knowledge test on traffic laws',
            'Practice driving with licensed adult (learner\'s permit)',
            'Pass practical driving test',
            'Understand license restrictions and requirements',
          ],
        },
        {
          heading: 'Understand Your Vehicle',
          points: [
            'Read your car\'s owner manual thoroughly',
            'Learn location of all controls (lights, wipers, hazards)',
            'Know how to check oil, coolant, and tire pressure',
            'Understand dashboard warning lights',
            'Practice adjusting mirrors and seat properly',
          ],
        },
        {
          heading: 'Essential Documents',
          points: [
            'Driver\'s license (always carry while driving)',
            'Vehicle registration',
            'Insurance documents',
            'Roadworthiness certificate',
            'Keep copies in glove box, not at home',
          ],
        },
      ],
    },
    {
      title: 'Basic Driving Skills',
      icon: '🚗',
      color: 'bg-green-600',
      content: [
        {
          heading: 'Starting and Stopping',
          points: [
            'Adjust seat, mirrors, and seatbelt before starting',
            'Check around car before entering (especially behind)',
            'Start engine: Foot on brake, turn key/push button',
            'Shift to Drive/Reverse only when fully stopped',
            'Release parking brake before driving',
            'Come to complete stops - no rolling through stop signs',
          ],
        },
        {
          heading: 'Steering Techniques',
          points: [
            'Hand position: 9 and 3 o\'clock (or 10 and 2)',
            'Look where you want to go, not at the hood',
            'Make smooth, gradual steering movements',
            'Hand-over-hand technique for sharp turns',
            'Keep both hands on wheel except when shifting/signaling',
          ],
        },
        {
          heading: 'Acceleration and Braking',
          points: [
            'Accelerate smoothly and gradually',
            'Brake gently unless emergency stopping',
            'Look ahead to anticipate when to slow down',
            'In traffic, leave space to stop comfortably',
            'Never brake and accelerate simultaneously',
          ],
        },
      ],
    },
    {
      title: 'Road Rules & Etiquette',
      icon: '🚦',
      color: 'bg-orange-600',
      content: [
        {
          heading: 'Right of Way',
          points: [
            'At intersections: First to arrive has right of way',
            'If simultaneous arrival, yield to vehicle on right',
            'Always yield to pedestrians in crosswalks',
            'Emergency vehicles: Pull over and stop immediately',
            'Roundabouts: Yield to traffic already in circle',
          ],
        },
        {
          heading: 'Lane Usage',
          points: [
            'Stay in your lane - don\'t drift or weave',
            'Use right lane unless passing (on highways)',
            'Check blind spots before changing lanes',
            'Signal at least 30 meters before turning/changing lanes',
            'Never change lanes in intersections',
          ],
        },
        {
          heading: 'Parking Basics',
          points: [
            'Practice parallel parking in empty lots first',
            'Always use parking brake on hills',
            'Turn wheels away from curb when facing uphill',
            'Turn wheels toward curb when facing downhill',
            'Never park in no-parking zones or blocking driveways',
            'In parking lot: center your car in the space',
          ],
        },
      ],
    },
    {
      title: 'Safety First',
      icon: '🛡️',
      color: 'bg-red-600',
      content: [
        {
          heading: 'Pre-Drive Checks (Every Time)',
          points: [
            'Walk around car - check for obstacles or damage',
            'Check tire condition visually',
            'Ensure all lights work (have someone help)',
            'Adjust mirrors for optimal view',
            'Seatbelt on before starting engine',
          ],
        },
        {
          heading: 'Defensive Driving',
          points: [
            'Assume other drivers might make mistakes',
            'Keep "escape routes" in mind',
            'Scan ahead 10-15 seconds down the road',
            'Check mirrors every 5-8 seconds',
            'Don\'t rely solely on mirrors - check blind spots physically',
            'Avoid driving in other vehicles\' blind spots',
          ],
        },
        {
          heading: 'Common Beginner Mistakes to Avoid',
          points: [
            'Holding steering wheel too tightly (relax grip)',
            'Looking at hood instead of road ahead',
            'Forgetting to signal turns and lane changes',
            'Following too closely',
            'Overconfidence after initial practice',
            'Driving when tired, emotional, or distracted',
          ],
        },
      ],
    },
    {
      title: 'Building Confidence',
      icon: '💪',
      color: 'bg-purple-600',
      content: [
        {
          heading: 'Practice Strategy',
          points: [
            'Start in empty parking lots to get comfortable',
            'Graduate to quiet residential streets',
            'Then practice on busier roads during off-peak hours',
            'Finally, practice highway driving',
            'Drive different times of day (daylight first, then dusk/night)',
            'Practice in various weather conditions with experienced driver',
          ],
        },
        {
          heading: 'Managing Anxiety',
          points: [
            'It\'s normal to feel nervous - everyone does at first',
            'Take deep breaths if feeling overwhelmed',
            'Focus on one task at a time',
            'Don\'t let other drivers rush you',
            'Pull over safely if you need a moment',
            'Consider professional driving lessons for extra confidence',
          ],
        },
        {
          heading: 'Setting Goals',
          points: [
            'Week 1: Master starting, stopping, steering in parking lot',
            'Week 2-3: Comfortable on residential streets',
            'Week 4-6: Confident in normal traffic',
            'Month 2: Highway driving and all weather conditions',
            'Month 3-6: Independent driving in all situations',
            'Remember: Everyone learns at their own pace',
          ],
        },
      ],
    },
  ];

  return (
    <Layout
      title="Complete Beginner's Guide to Driving"
      description="Everything new drivers need to know. From getting your license to building confidence on the road. Step-by-step guide for beginners."
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Beginner's Guide</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Beginner's Guide to Driving</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Your comprehensive roadmap to becoming a confident, safe driver. Everything you need to know before, during, and after getting your license.
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">👋 Welcome, Future Driver!</h2>
            <p className="text-gray-700 mb-2">
              Learning to drive is one of life's most valuable skills. It opens up new opportunities for independence, employment, and adventure. But it also comes with serious responsibility.
            </p>
            <p className="text-gray-700">
              This guide will walk you through everything you need to know, from the basics of getting your license to becoming a confident driver. Take your time, practice regularly, and remember: every expert driver was once a beginner just like you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      {sections.map((section, sectionIdx) => (
        <section key={sectionIdx} className={sectionIdx % 2 === 0 ? 'py-12 bg-gray-50' : 'py-12 bg-white'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <div className={`${section.color} text-white text-4xl w-16 h-16 rounded-xl flex items-center justify-center mr-4`}>
                {section.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.content.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className={`w-8 h-8 ${section.color} text-white rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                      {itemIdx + 1}
                    </span>
                    {item.heading}
                  </h3>
                  <ul className="space-y-2">
                    {item.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Emergency Kit Checklist */}
      <section className="py-12 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-4xl mr-3">🧰</span>
            Essential Emergency Kit for Your Car
          </h2>
          <p className="text-gray-700 mb-6">Every driver should keep these items in their car at all times:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Spare tire, jack, and lug wrench',
              'Jumper cables or portable jump starter',
              'First aid kit',
              'Flashlight with extra batteries',
              'Reflective warning triangles',
              'Fire extinguisher (small)',
              'Basic tool kit (screwdrivers, pliers, wrench)',
              'Bottled water',
              'Phone charger (car adapter)',
              'Emergency contact numbers',
              'Tire pressure gauge',
              'Duct tape and zip ties',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                <input type="checkbox" className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Remember: Every expert driver started exactly where you are now. With practice, patience, and these guidelines, you'll be a confident driver in no time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn/driving-tips" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Learn More Driving Tips
            </Link>
            <Link href="/troubleshoot" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Get Help with Car Issues
            </Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Your Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/learn/road-signs" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Road Signs Guide</h3>
              <p className="text-gray-600">Learn all the road signs you'll encounter.</p>
            </Link>
            <Link href="/learn/driving-tips" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Driving Tips</h3>
              <p className="text-gray-600">Advanced techniques to improve your skills.</p>
            </Link>
            <Link href="/learn/common-issues" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Common Car Issues</h3>
              <p className="text-gray-600">Know how to handle basic car problems.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}