import Layout from '@/Components/Layout/Layout';
import { Link } from '@inertiajs/react';

export default function ElectricVehicles() {
  const evTypes = [
    {
      type: 'Battery Electric Vehicles (BEV)',
      icon: '🔋',
      description: 'Fully electric, powered entirely by batteries. No gasoline engine.',
      examples: 'Tesla Model 3, Nissan Leaf, Chevrolet Bolt',
      pros: ['Zero emissions', 'Lowest running costs', 'Quietest operation', 'Best acceleration'],
      cons: ['Limited range (200-400 km)', 'Longer charging time', 'Higher upfront cost'],
      color: 'bg-green-500',
    },
    {
      type: 'Plug-in Hybrid (PHEV)',
      icon: '🔌',
      description: 'Electric motor + gasoline engine. Can run on battery alone for short distances.',
      examples: 'Toyota Prius Prime, BMW X5 xDrive45e',
      pros: ['Flexibility of both power sources', 'No range anxiety', 'Reduced emissions', 'Good for long trips'],
      cons: ['More complex system', 'Heavier than regular cars', 'More expensive to maintain'],
      color: 'bg-blue-500',
    },
    {
      type: 'Hybrid Electric (HEV)',
      icon: '⚡',
      description: 'Electric motor assists gasoline engine. Battery charges from driving, not plugged in.',
      examples: 'Toyota Camry Hybrid, Honda Accord Hybrid',
      pros: ['Better fuel economy', 'No charging needed', 'Lower cost than PHEV/BEV', 'Widely available'],
      cons: ['Still uses gasoline', 'Less efficient than PHEV/BEV', 'Can\'t drive on electric only'],
      color: 'bg-yellow-500',
    },
  ];

  const chargingInfo = [
    {
      level: 'Level 1 - Home Charging',
      voltage: '120V (Standard Outlet)',
      speed: '5-8 km of range per hour',
      time: '20-40 hours for full charge',
      cost: 'Lowest cost (home electricity)',
      best: 'Overnight charging at home',
      icon: '🏠',
    },
    {
      level: 'Level 2 - Fast Charging',
      voltage: '240V (Dedicated Circuit)',
      speed: '15-40 km of range per hour',
      time: '4-8 hours for full charge',
      cost: 'Moderate (public stations GH₵ 5-15)',
      best: 'Home installation or public stations',
      icon: '⚡',
    },
    {
      level: 'Level 3 - DC Fast Charging',
      voltage: '400-800V (Specialized)',
      speed: '150-300 km in 30 minutes',
      time: '30-60 minutes for 80% charge',
      cost: 'Highest (GH₵ 20-50 per session)',
      best: 'Long trips, highway rest stops',
      icon: '⚡⚡',
    },
  ];

  const commonQuestions = [
    {
      question: 'How much does it cost to charge an EV?',
      answer: 'In Ghana, home charging costs approximately GH₵ 2-4 to fully charge (giving 300-400 km range), compared to GH₵ 80-120 to fill a gas tank for similar range. Public charging stations may cost GH₵ 10-50 depending on speed.',
    },
    {
      question: 'What is the real-world range of EVs?',
      answer: 'Most modern EVs offer 250-400 km on a single charge. Factors like speed, weather, and AC usage affect range. In Ghana\'s hot climate, expect 10-15% less than advertised range.',
    },
    {
      question: 'How long do EV batteries last?',
      answer: 'Most EV batteries are warrantied for 8-10 years or 160,000 km. They typically retain 70-80% capacity after this period. Battery replacement costs are decreasing but still expensive (GH₵ 15,000-40,000).',
    },
    {
      question: 'Can I charge an EV in Ghana?',
      answer: 'Charging infrastructure is growing in Accra, Kumasi, and major cities. Most EV owners charge at home overnight. Public charging stations are available at malls, hotels, and select fuel stations.',
    },
    {
      question: 'Are EVs more expensive to maintain?',
      answer: 'No! EVs have fewer moving parts (no engine oil, transmission, spark plugs). Maintenance costs are typically 30-50% lower than gasoline cars. Main costs are tires and brake pads (which last longer due to regenerative braking).',
    },
    {
      question: 'What about air conditioning in hot weather?',
      answer: 'EVs handle AC efficiently. Running AC reduces range by about 10-20% in Ghana\'s climate. Pre-cooling while plugged in helps. Most EVs can pre-condition the cabin before you drive.',
    },
  ];

  const costComparison = {
    gasoline: {
      vehicle: 'Toyota Corolla (Gasoline)',
      purchase: 'GH₵ 150,000',
      fuel: 'GH₵ 1,200/month (avg.)',
      maintenance: 'GH₵ 400/month',
      yearly: 'GH₵ 19,200',
      fiveYear: 'GH₵ 246,000',
    },
    electric: {
      vehicle: 'Comparable EV',
      purchase: 'GH₵ 180,000 (+GH₵ 30,000)',
      fuel: 'GH₵ 300/month (charging)',
      maintenance: 'GH₵ 200/month',
      yearly: 'GH₵ 6,000',
      fiveYear: 'GH₵ 210,000',
    },
  };

  return (
    <Layout
      title="Complete Guide to Electric Vehicles (EVs)"
      description="Everything you need to know about electric cars in Ghana. Types of EVs, charging infrastructure, costs, and benefits."
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span>Electric Vehicles</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Guide to Electric Vehicles</h1>
          <p className="text-xl text-green-100 max-w-3xl">
            Everything you need to know about electric cars, bikes, and the future of transportation in Ghana. Make an informed decision about going electric.
          </p>
        </div>
      </div>

      {/* Why Go Electric */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Consider Electric Vehicles?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lower Running Costs</h3>
              <p className="text-gray-600">Save up to 70% on fuel costs. Electricity is much cheaper than gasoline, and EVs require less maintenance.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Environmental Benefits</h3>
              <p className="text-gray-600">Zero tailpipe emissions. Reduce air pollution in cities and contribute to fighting climate change.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Superior Performance</h3>
              <p className="text-gray-600">Instant torque for smooth acceleration. Quieter ride. Advanced technology features. Lower center of gravity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of EVs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Types of Electric Vehicles</h2>
          <div className="space-y-6">
            {evTypes.map((ev, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className={`${ev.color} text-white p-4 flex items-center`}>
                  <span className="text-4xl mr-4">{ev.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{ev.type}</h3>
                    <p className="text-sm opacity-90">{ev.examples}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4 text-lg">{ev.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-green-700 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {ev.pros.map((pro, i) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start">
                            <span className="mr-2 text-green-500">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Considerations
                      </h4>
                      <ul className="space-y-1">
                        {ev.cons.map((con, i) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start">
                            <span className="mr-2 text-red-500">−</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charging Information */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Understanding EV Charging</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chargingInfo.map((level, idx) => (
              <div key={idx} className="card hover:scale-105 transform transition">
                <div className="text-4xl mb-3">{level.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{level.level}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Voltage:</span>
                    <p className="text-gray-600">{level.voltage}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Speed:</span>
                    <p className="text-gray-600">{level.speed}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Full Charge:</span>
                    <p className="text-gray-600">{level.time}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Cost:</span>
                    <p className="text-gray-600">{level.cost}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="font-semibold text-primary-600">Best For:</span>
                    <p className="text-gray-700">{level.best}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">5-Year Cost Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gasoline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⛽</span>
                {costComparison.gasoline.vehicle}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Purchase Price:</span>
                  <span className="font-bold">{costComparison.gasoline.purchase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Cost/Month:</span>
                  <span className="font-semibold">{costComparison.gasoline.fuel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance/Month:</span>
                  <span className="font-semibold">{costComparison.gasoline.maintenance}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Yearly Operating:</span>
                  <span className="font-bold text-red-600">{costComparison.gasoline.yearly}</span>
                </div>
                <div className="flex justify-between bg-red-50 p-3 rounded-lg">
                  <span className="font-bold text-gray-900">5-Year Total:</span>
                  <span className="font-bold text-red-600 text-xl">{costComparison.gasoline.fiveYear}</span>
                </div>
              </div>
            </div>

            {/* Electric */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2">
                SAVES GH₵ 36,000!
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                {costComparison.electric.vehicle}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Purchase Price:</span>
                  <span className="font-bold">{costComparison.electric.purchase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Charging Cost/Month:</span>
                  <span className="font-semibold text-green-600">{costComparison.electric.fuel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance/Month:</span>
                  <span className="font-semibold text-green-600">{costComparison.electric.maintenance}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Yearly Operating:</span>
                  <span className="font-bold text-green-600">{costComparison.electric.yearly}</span>
                </div>
                <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                  <span className="font-bold text-gray-900">5-Year Total:</span>
                  <span className="font-bold text-green-600 text-xl">{costComparison.electric.fiveYear}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            *Based on average driving of 15,000 km/year. Actual costs vary by model and usage.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {commonQuestions.map((qa, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-start">
                  <span className="text-primary-600 mr-2">Q:</span>
                  {qa.question}
                </h3>
                <p className="text-gray-700 pl-7">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Electric?</h2>
          <p className="text-xl mb-8 text-green-100">
            The future of transportation is here. Start your electric journey today with lower costs, better performance, and a cleaner environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-expert" className="btn-primary bg-white text-green-600 hover:bg-gray-100">
              Find EV Specialist
            </Link>
            <Link href="/learn/driving-tips" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600">
              Learn More Tips
            </Link>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/learn/common-issues" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Common Car Issues</h3>
              <p className="text-gray-600">Learn to troubleshoot common vehicle problems.</p>
            </Link>
            <Link href="/learn/driving-tips" className="card hover:scale-105 transform transition">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Driving Tips</h3>
              <p className="text-gray-600">Improve your driving efficiency and safety.</p>
            </Link>
            <Link href="/troubleshoot" className="card hover:scale-105 transform transition bg-primary-50 border-2 border-primary-600">
              <h3 className="text-xl font-bold text-primary-600 mb-2">Get Help Now</h3>
              <p className="text-gray-600">AI-powered diagnosis for any vehicle issue.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}