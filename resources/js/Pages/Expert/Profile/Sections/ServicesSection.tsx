import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ServicesSectionProps {
  data: any;
  errors: Record<string, string>;
  specialtyOptions: Array<{ value: string; label: string }>;
  toggleSpecialty: (specialty: string) => void;
}

export default function ServicesSection({ data, errors, specialtyOptions, toggleSpecialty }: ServicesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Services & Specialties
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the services you offer to help customers find you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialtyOptions.map((specialty) => {
          const isSelected = data.specialties.includes(specialty.value);
          return (
            <motion.button
              key={specialty.value}
              type="button"
              onClick={() => toggleSpecialty(specialty.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${isSelected
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  {isSelected && (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${isSelected
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {specialty.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {data.specialties.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ Please select at least one specialty to help customers find your services
          </p>
        </div>
      )}

      {errors.specialties && (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.specialties}</p>
      )}
    </div>
  );
}