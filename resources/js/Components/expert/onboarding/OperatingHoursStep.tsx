// resources/js/Components/expert/onboarding/OperatingHoursStep.tsx
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { ExpertData, DayOfWeek } from '@/types/expert-onboarding';

interface OperatingHoursStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  nextStep: () => void;
  previousStep: () => void;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function OperatingHoursStep({
  data,
  setData,
  errors,
  nextStep,
  previousStep,
}: OperatingHoursStepProps) {
  const applyToAllDays = (day: DayOfWeek) => {
    const openTime = data[`${day}_open`];
    const closeTime = data[`${day}_close`];

    const updates: Partial<ExpertData> = {};
    DAYS.forEach((d) => {
      updates[`${d.key}_open`] = openTime;
      updates[`${d.key}_close`] = closeTime;
    });

    setData(updates);
  };

  const hasAnyHours = DAYS.some(day => {
    const openKey = `${day.key}_open` as keyof ExpertData;
    const closeKey = `${day.key}_close` as keyof ExpertData;
    return !!(data[openKey] || data[closeKey]);
  });

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Operating Hours
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your business hours to let customers know when you're available (optional)
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
              You can skip this step and add your operating hours later in your profile settings.
              Providing your hours helps customers reach you at the right time.
            </p>
          </div>
        </div>
      </div>

      {/* Days of Week */}
      <div className="space-y-3">
        {DAYS.map((day, index) => (
          <div
            key={day.key}
            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                {day.label}
              </h3>
              {index === 0 && (
                <button
                  type="button"
                  onClick={() => applyToAllDays(day.key)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Apply to all days
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={`${day.key}_open`}
                  className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Opening Time
                </label>
                <input
                  id={`${day.key}_open`}
                  type="time"
                  value={data[`${day.key}_open` as keyof ExpertData] === true ? '' : data[`${day.key}_open`] || ''}
                  onChange={(e) =>
                    setData({
                      [`${day.key}_open`]: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor={`${day.key}_close`}
                  className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                >
                  Closing Time
                </label>
                <input
                  id={`${day.key}_close`}
                  type="time"
                  value={data[`${day.key}_close` as keyof ExpertData] === true ? '' : data[`${day.key}_close`] || ''}
                  onChange={(e) =>
                    setData({
                      [`${day.key}_close`]: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Services Toggle */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.accepts_emergency}
            onChange={(e) =>
              setData({ accepts_emergency: e.target.checked })
            }
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Accept Emergency Calls
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Allow customers to contact you outside of regular business hours for emergency services
            </p>
          </div>
        </label>
      </div>

      {/* Skip Button */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={nextStep}
            className="group relative px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <span className="relative flex items-center gap-2">
              {hasAnyHours ? (
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