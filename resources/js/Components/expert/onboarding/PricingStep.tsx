// resources/js/Components/expert/onboarding/PricingStep.tsx
// ✅ FIXED: Removed redundant Continue button - users should use the main navigation

import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { ExpertData } from '@/types/expert-onboarding';

interface PricingStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  nextStep: () => void;
  previousStep: () => void;
  onStepChange?: (step: number) => void; // Kept for compatibility but not used
}

export default function PricingStep({
  data,
  setData,
  errors,
  nextStep,
  previousStep,
  onStepChange,
}: PricingStepProps) {
  const hasAnyPricing = !!(
    data.hourly_rate_min ||
    data.hourly_rate_max ||
    data.diagnostic_fee
  );

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your rates to help customers understand your pricing (optional)
        </p>
      </div>

      {/* Optional Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              This step is optional
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You can skip this step and add your pricing information later in your profile settings.
              However, providing pricing helps customers make informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Rate Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hourly Rate Range
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Minimum Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rate ($/hour)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-lg">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.hourly_rate_min || ''}
                onChange={(e) =>
                  setData({
                    hourly_rate_min: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="50.00"
              />
            </div>
            {errors.hourly_rate_min && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.hourly_rate_min}
              </p>
            )}
          </div>

          {/* Maximum Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Rate ($/hour)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-lg">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={data.hourly_rate_max || ''}
                onChange={(e) =>
                  setData({
                    hourly_rate_max: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="100.00"
              />
            </div>
            {errors.hourly_rate_max && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.hourly_rate_max}
              </p>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Tip: Provide a range to give customers flexibility while ensuring fair compensation.
        </p>
      </div>

      {/* Diagnostic Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Diagnostic Fee (optional)
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          One-time fee for initial inspection and diagnosis
        </p>
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 text-lg">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={data.diagnostic_fee || ''}
            onChange={(e) =>
              setData({
                diagnostic_fee: e.target.value
                  ? parseFloat(e.target.value)
                  : null,
              })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="75.00"
          />
        </div>
        {errors.diagnostic_fee && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.diagnostic_fee}
          </p>
        )}
      </div>

      {/* Accept Emergency Calls Section */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Emergency Service
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white mb-1">
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${data.accepts_emergency
              ? 'bg-blue-600 dark:bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600'
              }`}
            role="switch"
            aria-checked={data.accepts_emergency}
            aria-label="Accept emergency calls"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${data.accepts_emergency ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </div>

      {/* ✅ REMOVED: Redundant Continue/Skip button */}
      {/* Users should use the main Continue button at the bottom of the form */}
      {/* This step is now marked as always complete in isStepComplete() */}
    </motion.div>
  );
}