interface BusinessDetailsSectionProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  businessTypes: Array<{ value: string; label: string }>;
}

export default function BusinessDetailsSection({ data, setData, errors, businessTypes }: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Business Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell customers about your business and expertise
        </p>
      </div>

      {/* Business Name */}
      <div>
        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="business_name"
          value={data.business_name}
          onChange={e => setData('business_name', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
          placeholder="John's Auto Repair"
        />
        {errors.business_name && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.business_name}</p>
        )}
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="business_type"
          value={data.business_type}
          onChange={e => setData('business_type', e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
        >
          {businessTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.business_type && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.business_type}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio / Description
        </label>
        <textarea
          id="bio"
          value={data.bio}
          onChange={e => setData('bio', e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
          placeholder="Tell customers about your business, experience, and what makes you special..."
          maxLength={1000}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will be displayed on your public profile
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.bio.length}/1000
          </p>
        </div>
        {errors.bio && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
        )}
      </div>

      {/* Years of Experience & Employee Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            id="years_experience"
            value={data.years_experience}
            onChange={e => setData('years_experience', e.target.value)}
            min="0"
            max="99"
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="15"
          />
          {errors.years_experience && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.years_experience}</p>
          )}
        </div>

        <div>
          <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Employees
          </label>
          <input
            type="number"
            id="employee_count"
            value={data.employee_count}
            onChange={e => setData('employee_count', e.target.value)}
            min="1"
            max="999"
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="5"
          />
          {errors.employee_count && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.employee_count}</p>
          )}
        </div>
      </div>

      {/* Service Radius */}
      <div>
        <label htmlFor="service_radius_km" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Radius (km) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="service_radius_km"
          value={data.service_radius_km}
          onChange={e => setData('service_radius_km', e.target.value)}
          min="5"
          max="100"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          How far are you willing to travel for jobs? (5-100 km)
        </p>
        {errors.service_radius_km && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.service_radius_km}</p>
        )}
      </div>
    </div>
  );
}