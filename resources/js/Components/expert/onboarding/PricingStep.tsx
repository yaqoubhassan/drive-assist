// resources/js/Components/expert/onboarding/PricingStep.tsx
// ✅ FIXED: Skip button now only updates local state without backend save
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { ExpertData } from '@/types/expert-onboarding';

interface PricingStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  // ✅ NEW: Add onStepChange to update step without backend save
  onStepChange?: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export default function PricingStep({
  data,
  setData,
  errors,
  onStepChange,
  nextStep,
  previousStep,
}: PricingStepProps) {
  const hasAnyPricing = !!(
    data.hourly_rate_min ||
    data.hourly_rate_max ||
    data.diagnostic_fee
  );

  // ✅ Handle skip - only update local state, no backend save
  const handleSkip = () => {
    if (onStepChange) {
      // Use the new prop to update step without backend save
      onStepChange(5);
    } else {
      // Fallback to nextStep if onStepChange not provided
      nextStep();
    }
  };

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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Hourly Rate Range
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="hourly_rate_min"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Minimum Rate (GH₵/hour)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                GH₵
              </span>
              <input
                id="hourly_rate_min"
                type="number"
                min="0"
                step="0.01"
                value={data.hourly_rate_min || ''}
                onChange={(e) =>
                  setData({
                    hourly_rate_min: e.target.value ? parseFloat(e.target.value) : null,
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

          <div>
            <label
              htmlFor="hourly_rate_max"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Maximum Rate (GH₵/hour)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                GH₵
              </span>
              <input
                id="hourly_rate_max"
                type="number"
                min="0"
                step="0.01"
                value={data.hourly_rate_max || ''}
                onChange={(e) =>
                  setData({
                    hourly_rate_max: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="150.00"
              />
            </div>
            {errors.hourly_rate_max && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.hourly_rate_max}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Fee */}
      <div>
        <label
          htmlFor="diagnostic_fee"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Diagnostic Fee (GH₵)
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          One-time fee for diagnosing vehicle issues
        </p>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            GH₵
          </span>
          <input
            id="diagnostic_fee"
            type="number"
            min="0"
            step="0.01"
            value={data.diagnostic_fee || ''}
            onChange={(e) =>
              setData({
                diagnostic_fee: e.target.value ? parseFloat(e.target.value) : null,
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

      {/* ✅ FIXED: Skip Button - Now uses handleSkip which only updates local state */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleSkip}
            className="group relative px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <span className="relative flex items-center gap-2">
              {hasAnyPricing ? (
                <>
                  <span>Continue without completing</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Skip this step for now</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>

          <span className="text-sm text-gray-400 dark:text-gray-500">
            You can update this later
          </span>
        </div>
      </div>
    </motion.div>
  );
}