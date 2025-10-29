import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Step6ReviewProps {
  data: any;
  specialties: Record<string, string>;
  businessTypes: Record<string, string>;
}

export default function Step6Review({ data, specialties, businessTypes }: Step6ReviewProps) {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };

  const formatTime = (time: string) => {
    if (!time) return 'Closed';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <motion.div {...slideIn} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please review all details before submitting
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          Basic Information
        </h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Name:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Email:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Phone:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Business Name:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.business_name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Address:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-xs">{data.business_address}</dd>
          </div>
        </dl>
      </div>

      {/* Business Details */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          Business Details
        </h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Type:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{businessTypes[data.business_type]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Experience:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.years_experience} years</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Service Radius:</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{data.service_radius_km} km</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600 dark:text-gray-400 mb-2">Specialties:</dt>
            <dd className="flex flex-wrap gap-2">
              {data.specialties.map((specialty: string) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {specialties[specialty]}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      {/* Pricing */}
      {(data.hourly_rate_min || data.hourly_rate_max || data.diagnostic_fee) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Pricing
          </h3>
          <dl className="space-y-3">
            {data.hourly_rate_min && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Hourly Rate:</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  ${data.hourly_rate_min} - ${data.hourly_rate_max}/hour
                </dd>
              </div>
            )}
            {data.diagnostic_fee && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600 dark:text-gray-400">Diagnostic Fee:</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">${data.diagnostic_fee}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600 dark:text-gray-400">Emergency Services:</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">
                {data.accepts_emergency ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* Operating Hours Summary */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          Operating Hours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {days.map((day) => {
            const open = data[`${day}_open`];
            const close = data[`${day}_close`];

            if (!open && !close) return null;

            return (
              <div key={day} className="flex justify-between text-sm">
                <dt className="text-gray-600 dark:text-gray-400 capitalize">{day}:</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {open && close ? `${formatTime(open)} - ${formatTime(close)}` : 'Closed'}
                </dd>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documents */}
      {(data.business_license || data.insurance_certificate) && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Documents Uploaded
          </h3>
          <ul className="space-y-2">
            {data.business_license && (
              <li className="text-sm text-gray-700 dark:text-gray-300">
                ✓ Business License
              </li>
            )}
            {data.insurance_certificate && (
              <li className="text-sm text-gray-700 dark:text-gray-300">
                ✓ Insurance Certificate
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Final Confirmation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Ready to Submit?
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          By submitting, you agree to DriveAssist's Terms of Service and Privacy Policy.
          We'll review your application within 24-48 hours and send you an email once approved.
        </p>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
            I agree to the Terms of Service and confirm that all information provided is accurate
          </label>
        </div>
      </div>
    </motion.div>
  );
}