import { motion } from 'framer-motion';
import type { ExpertData, DayOfWeek } from '@/types/expert-onboarding';

interface OperatingHoursStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
}

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function OperatingHoursStep({
  data,
  setData,
  errors,
}: OperatingHoursStepProps) {
  const applyToAllDays = (day: DayOfWeek) => {
    const openTime = data[`${day}_open`];
    const closeTime = data[`${day}_close`];

    const updates: Partial<ExpertData> = {};
    DAYS.forEach((d) => {
      updates[`${d}_open`] = openTime;
      updates[`${d}_close`] = closeTime;
    });

    setData(updates);
  };

  return (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Operating Hours
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your business hours (all optional)
        </p>
      </div>

      {/* Days of Week */}
      {DAYS.map((day) => (
        <div
          key={day}
          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {day}
            </h3>
            {day !== 'sunday' && (
              <button
                type="button"
                onClick={() => applyToAllDays(day)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Apply to all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Open
              </label>
              <input
                type="time"
                value={data[`${day}_open`] || ''}
                onChange={(e) =>
                  setData({ [`${day}_open`]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                Close
              </label>
              <input
                type="time"
                value={data[`${day}_close`] || ''}
                onChange={(e) =>
                  setData({ [`${day}_close`]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}