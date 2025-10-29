import { motion } from 'framer-motion';

interface Step2BusinessDetailsProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  specialties: Record<string, string>;
  businessTypes: Record<string, string>;
}

export default function Step2BusinessDetails({
  data,
  setData,
  errors,
  specialties,
  businessTypes
}: Step2BusinessDetailsProps) {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };

  const toggleSpecialty = (specialty: string) => {
    const current = [...data.specialties];
    const index = current.indexOf(specialty);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(specialty);
    }

    setData('specialties', current);
  };

  return (
    <motion.div {...slideIn} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Business Details
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your services and expertise
        </p>
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Type *
        </label>
        <select
          value={data.business_type}
          onChange={(e) => setData('business_type', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          {Object.entries(businessTypes).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.business_type && <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>}
      </div>

      {/* Years of Experience */}
      <div>
        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Years of Experience *
        </label>
        <input
          id="years_experience"
          type="number"
          min="0"
          max="100"
          value={data.years_experience}
          onChange={(e) => setData('years_experience', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {errors.years_experience && <p className="mt-1 text-sm text-red-600">{errors.years_experience}</p>}
      </div>

      {/* Employee Count */}
      <div>
        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Employees (Optional)
        </label>
        <input
          id="employee_count"
          type="number"
          min="1"
          value={data.employee_count || ''}
          onChange={(e) => setData('employee_count', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Service Radius */}
      <div>
        <label htmlFor="service_radius_km" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Service Radius (km) *
        </label>
        <input
          id="service_radius_km"
          type="number"
          min="1"
          max="200"
          value={data.service_radius_km}
          onChange={(e) => setData('service_radius_km', parseInt(e.target.value) || 25)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          How far are you willing to travel for jobs?
        </p>
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Specialties * (Select at least one)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(specialties).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleSpecialty(value)}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${data.specialties.includes(value)
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.specialties && <p className="mt-2 text-sm text-red-600">{errors.specialties}</p>}
        {data.specialties.length === 0 && (
          <p className="mt-2 text-sm text-yellow-600">Please select at least one specialty</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Description (Optional)
        </label>
        <textarea
          id="bio"
          rows={4}
          value={data.bio}
          onChange={(e) => setData('bio', e.target.value)}
          maxLength={1000}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Tell customers about your business, experience, and what makes you stand out..."
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {data.bio.length} / 1000 characters
        </p>
      </div>
    </motion.div>
  );
}