interface PricingSectionProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function PricingSection({ data, setData, errors }: PricingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your pricing information (optional but recommended)
        </p>
      </div>

      {/* Hourly Rate Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="hourly_rate_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hourly Rate (Min)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              id="hourly_rate_min"
              value={data.hourly_rate_min}
              onChange={e => setData('hourly_rate_min', e.target.value)}
              min="0"
              step="5"
              className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
              placeholder="50"
            />
          </div>
          {errors.hourly_rate_min && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.hourly_rate_min}</p>
          )}
        </div>

        <div>
          <label htmlFor="hourly_rate_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hourly Rate (Max)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              id="hourly_rate_max"
              value={data.hourly_rate_max}
              onChange={e => setData('hourly_rate_max', e.target.value)}
              min="0"
              step="5"
              className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
              placeholder="100"
            />
          </div>
          {errors.hourly_rate_max && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.hourly_rate_max}</p>
          )}
        </div>
      </div>

      {/* Diagnostic Fee */}
      <div>
        <label htmlFor="diagnostic_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Diagnostic Fee
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            $
          </span>
          <input
            type="number"
            id="diagnostic_fee"
            value={data.diagnostic_fee}
            onChange={e => setData('diagnostic_fee', e.target.value)}
            min="0"
            step="5"
            className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="75"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          How much do you charge for diagnostic services?
        </p>
        {errors.diagnostic_fee && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.diagnostic_fee}</p>
        )}
      </div>

      {/* Emergency Services */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Emergency Services Available
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Do you offer 24/7 emergency roadside assistance?
            </p>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={data.accepts_emergency}
              onChange={e => setData('accepts_emergency', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>Tip:</strong> Providing pricing information helps customers make informed decisions and can increase your booking rate.
        </p>
      </div>
    </div>
  );
}