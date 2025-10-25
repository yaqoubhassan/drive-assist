import { Link } from '@inertiajs/react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Fix Your Car Issues in <span className="text-yellow-300">Minutes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              AI-powered troubleshooting and instant access to verified mechanics near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/troubleshoot" className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition duration-200 text-center shadow-lg">
                Start Troubleshooting
              </Link>
              <Link href="/find-expert" className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition duration-200 text-center">
                Find Expert Now
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <div className="text-3xl font-bold text-yellow-300">10K+</div>
                <div className="text-sm text-primary-100">Issues Solved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-sm text-primary-100">Expert Mechanics</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">4.9★</div>
                <div className="text-sm text-primary-100">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=600&fit=crop"
                alt="Car Dashboard"
                className="rounded-2xl shadow-2xl"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Issue Diagnosed</div>
                    <div className="text-sm text-gray-600">In 2 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}