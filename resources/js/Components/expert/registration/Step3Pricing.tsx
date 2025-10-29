import { motion } from 'framer-motion';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Step3PricingProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step3Pricing({ data, setData, errors }: Step3PricingProps) {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };

  return (
    <motion.div {...slideIn} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help customers understand your pricing (all fields optional)
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Tip: Providing pricing information helps customers find experts within their budget. You can always negotiate specific prices with customers.
        </p>
      </div>

      {/* Hourly Rate Range */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hourly Rate Range
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Minimum Rate */}
          <div>
            <label htmlFor="hourly_rate_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rate ($/hour)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="hourly_rate_min"
                type="number"
                min="0"
                step="0.01"
                value={data.hourly_rate_min || ''}
                onChange={(e) => setData('hourly_rate_min', e.target.value ? parseFloat(e.target.value) : null)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50.00"
              />
            </div>
          </div>

          {/* Maximum Rate */}
          <div>
            <label htmlFor="hourly_rate_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Rate ($/hour)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="hourly_rate_max"
                type="number"
                min="0"
                step="0.01"
                value={data.hourly_rate_max || ''}
                onChange={(e) => setData('hourly_rate_max', e.target.value ? parseFloat(e.target.value) : null)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Fee */}
      <div>
        <label htmlFor="diagnostic_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Diagnostic Fee ($)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="diagnostic_fee"
            type="number"
            min="0"
            step="0.01"
            value={data.diagnostic_fee || ''}
            onChange={(e) => setData('diagnostic_fee', e.target.value ? parseFloat(e.target.value) : null)}
            className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="75.00"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Typical fee for diagnosing an issue
        </p>
      </div>

      {/* Emergency Services */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <input
          id="accepts_emergency"
          type="checkbox"
          checked={data.accepts_emergency}
          onChange={(e) => setData('accepts_emergency', e.target.checked)}
          className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="accepts_emergency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          I accept emergency/after-hours calls (may command premium rates)
        </label>
      </div>
    </motion.div>
  );
}