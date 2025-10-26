import { Head, Link } from '@inertiajs/react';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';

interface ExpertShowProps {
  expert: {
    id: number;
    businessName: string;
    bio: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    isOpen: boolean;
    location: {
      address: string;
      latitude: number;
      longitude: number;
    };
    contact: {
      phone: string;
      email: string;
    };
    hours: Record<string, { open: string; close: string; isOpen: boolean }>;
    pricing: {
      hourlyMin: number;
      hourlyMax: number;
      diagnosticFee: number;
    };
    recentReviews: Array<{
      id: number;
      rating: number;
      text: string;
      author: string;
      createdAt: string;
    }>;
  };
}

export default function Show({ expert }: ExpertShowProps) {
  return (
    <>
      <Head title={expert.businessName} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {expert.businessName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {expert.businessName}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {expert.rating}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    ({expert.reviewCount} reviews)
                  </span>
                  {expert.isOpen && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                      Open Now
                    </span>
                  )}
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {expert.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <Link
                href={`/experts/${expert.id}/contact`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                Contact Expert
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {expert.bio || 'No bio available.'}
                </p>
              </div>

              {/* Reviews Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Reviews
                </h2>
                <div className="space-y-6">
                  {expert.recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {review.author}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.createdAt}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{expert.location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${expert.contact.phone}`} className="text-sm hover:text-blue-600">
                      {expert.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${expert.contact.email}`} className="text-sm hover:text-blue-600">
                      {expert.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(expert.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {day}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Pricing
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Hourly Rate</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${expert.pricing.hourlyMin} - ${expert.pricing.hourlyMax}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Diagnostic Fee</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${expert.pricing.diagnosticFee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}