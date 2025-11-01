import { useState } from 'react';

interface OperatingHoursSectionProps {
  data: any;
  setData: (updates: any) => void;
  errors: Record<string, string>;
  daysOfWeek: Array<{ key: string; label: string }>;
  copyHours: (fromDay: string) => void;
}

export default function OperatingHoursSection({ data, setData, errors, daysOfWeek, copyHours }: OperatingHoursSectionProps) {
  const [copyFrom, setCopyFrom] = useState('');

  const handleCopyHours = () => {
    if (copyFrom) {
      copyHours(copyFrom);
      setCopyFrom('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Operating Hours
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your business hours for each day of the week
        </p>
      </div>

      {/* Copy Hours Helper */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
          Quick Setup: Copy hours to all days
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={copyFrom}
            onChange={e => setCopyFrom(e.target.value)}
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm"
          >
            <option value="">Select a day to copy from</option>
            {daysOfWeek.map((day) => (
              <option key={day.key} value={day.key}>
                {day.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!copyFrom}
            onClick={handleCopyHours}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm whitespace-nowrap"
          >
            Copy Hours
          </button>
        </div>
      </div>

      {/* Hours for each day */}
      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {day.label}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={data[`${day.key}_open`]}
                  onChange={e => setData({ ...data, [`${day.key}_open`]: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={data[`${day.key}_close`]}
                  onChange={e => setData({ ...data, [`${day.key}_close`]: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {data[`${day.key}_open`] && data[`${day.key}_close`] && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Open from {data[`${day.key}_open`]} to {data[`${day.key}_close`]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 <strong>Tip:</strong> Leave times empty for days you're closed. Customers will see "Closed" for those days.
        </p>
      </div>
    </div>
  );
}