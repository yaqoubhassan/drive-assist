import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

interface Step4OperatingHoursProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function Step4OperatingHours({ data, setData, errors }: Step4OperatingHoursProps) {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };

  const applyToAll = (day: string) => {
    const openKey = `${day}_open`;
    const closeKey = `${day}_close`;
    const openValue = data[openKey];
    const closeValue = data[closeKey];

    DAYS.forEach(({ key }) => {
      setData(`${key}_open`, openValue);
      setData(`${key}_close`, closeValue);
    });
  };

  return (
    <motion.div {...slideIn} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Operating Hours
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Set your business hours (all optional - you can update this later)
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 Tip: Leave days blank if you're closed. Customers will see when you're available.
        </p>
      </div>

      <div className="space-y-4">
        {DAYS.map(({ key, label }, index) => (
          <div
            key={key}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Day Label */}
              <div className="flex-shrink-0 w-full md:w-32">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  {label}
                </h3>
              </div>

              {/* Time Inputs */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {/* Open Time */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Opens
                  </label>
                  <input
                    type="time"
                    value={data[`${key}_open`] || ''}
                    onChange={(e) => setData(`${key}_open`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Close Time */}
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Closes
                  </label>
                  <input
                    type="time"
                    value={data[`${key}_close`] || ''}
                    onChange={(e) => setData(`${key}_close`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Apply to All Button */}
              {index === 0 && data[`${key}_open`] && data[`${key}_close`] && (
                <button
                  type="button"
                  onClick={() => applyToAll(key)}
                  className="md:flex-shrink-0 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                >
                  Apply to All
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}