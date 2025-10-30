import { motion } from 'framer-motion';
import type { ExpertData } from '../../../types/expert-onboarding';

interface BasicInfoStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  businessTypes: Record<string, string>;
}

export default function BasicInfoStep({
  data,
  setData,
  errors,
  businessTypes,
}: BasicInfoStepProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start with your contact details and business information
        </p>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ phone: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+233 XX XXX XXXX"
          required
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* Business Name */}
        <div>
          <label
            htmlFor="business_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Business Name *
          </label>
          <input
            id="business_name"
            type="text"
            value={data.business_name}
            onChange={(e) => setData({ business_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John's Auto Repair"
            required
          />
          {errors.business_name && (
            <p className="mt-2 text-sm text-red-600">{errors.business_name}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label
            htmlFor="business_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Business Type *
          </label>
          <select
            id="business_type"
            value={data.business_type}
            onChange={(e) => setData({ business_type: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a business type</option>
            {Object.entries(businessTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.business_type && (
            <p className="mt-2 text-sm text-red-600">{errors.business_type}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* Years of Experience */}
        <div>
          <label
            htmlFor="years_experience"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Years of Experience (Optional)
          </label>
          <input
            id="years_experience"
            type="number"
            min="0"
            max="99"
            value={data.years_experience || ''}
            onChange={(e) =>
              setData({
                years_experience: parseInt(e.target.value) || null,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
          />
        </div>

        {/* Employee Count */}
        <div>
          <label
            htmlFor="employee_count"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Number of Employees (Optional)
          </label>
          <input
            id="employee_count"
            type="number"
            min="1"
            max="999"
            value={data.employee_count || ''}
            onChange={(e) =>
              setData({
                employee_count: parseInt(e.target.value) || null,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="5"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          About Your Business (Optional)
        </label>
        <textarea
          id="bio"
          rows={4}
          value={data.bio || ''}
          onChange={(e) => setData({ bio: e.target.value })}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Tell customers about your business..."
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {(data.bio || '').length} / 500 characters
        </p>
      </div>
    </motion.div>
  );
}