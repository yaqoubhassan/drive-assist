import { motion } from 'framer-motion';
import type { ExpertData } from '@/types/expert-onboarding';

interface PricingStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
}

export default function PricingStep({
  data,
  setData,
  errors,
}: PricingStepProps) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your rates (all fields are optional)
        </p>
      </div>

      {/* Hourly Rate Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="hourly_rate_min"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Hourly Rate (Min)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
            <input
              id="hourly_rate_min"
              type="number"
              min="0"
              step="0.01"
              value={data.hourly_rate_min || ''}
              onChange={(e) =>
                setData({
                  hourly_rate_min: parseFloat(e.target.value) || null,
                })
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50.00"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="hourly_rate_max"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Hourly Rate (Max)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
            <input
              id="hourly_rate_max"
              type="number"
              min="0"
              step="0.01"
              value={data.hourly_rate_max || ''}
              onChange={(e) =>
                setData({
                  hourly_rate_max: parseFloat(e.target.value) || null,
                })
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="150.00"
            />
          </div>
        </div>
      </div>

      {/* Diagnostic Fee */}
      <div>
        <label
          htmlFor="diagnostic_fee"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Diagnostic Fee
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
          <input
            id="diagnostic_fee"
            type="number"
            min="0"
            step="0.01"
            value={data.diagnostic_fee || ''}
            onChange={(e) =>
              setData({
                diagnostic_fee: parseFloat(e.target.value) || null,
              })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="75.00"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Fee for initial vehicle inspection and diagnosis
        </p>
      </div>

      {/* Emergency Service */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            Accept Emergency Calls
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available for urgent after-hours service
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setData({ accepts_emergency: !data.accepts_emergency })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.accepts_emergency
            ? 'bg-blue-600'
            : 'bg-gray-300 dark:bg-gray-600'
            }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.accepts_emergency ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>
    </motion.div>
  );
}