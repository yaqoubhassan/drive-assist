import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

interface ExpertContactProps {
  expert: {
    id: number;
    businessName: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
  };
}

export default function Contact({ expert }: ExpertContactProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferred_contact_method: 'email',
    best_time_to_contact: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(`/experts/${expert.id}/contact`);
  };

  return (
    <>
      <Head title={`Contact ${expert.businessName}`} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/experts/${expert.id}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Contact {expert.businessName}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                  {expert.rating}
                </span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  ({expert.reviewCount} reviews)
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                Typical response: {expert.responseTime}
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <form onSubmit={submit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your car issue or question..."
                  required
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Contact Method *
                </label>
                <div className="flex gap-4">
                  {['email', 'phone', 'sms'].map((method) => (
                    <label key={method} className="flex items-center">
                      <input
                        type="radio"
                        value={method}
                        checked={data.preferred_contact_method === method}
                        onChange={(e) => setData('preferred_contact_method', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {method}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Best Time */}
              <div>
                <label htmlFor="best_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Best Time to Reach You
                </label>
                <input
                  id="best_time"
                  type="text"
                  value={data.best_time_to_contact}
                  onChange={(e) => setData('best_time_to_contact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Weekday afternoons"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                {processing ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}