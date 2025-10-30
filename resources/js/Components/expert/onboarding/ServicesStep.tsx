import { motion } from 'framer-motion';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import type { ExpertData } from '@/types/expert-onboarding';

interface ServicesStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  availableSpecialties: Record<string, string>;
}

export default function ServicesStep({
  data,
  setData,
  errors,
  availableSpecialties,
}: ServicesStepProps) {
  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = data.specialties.includes(specialty)
      ? data.specialties.filter((s) => s !== specialty)
      : [...data.specialties, specialty];

    setData({ specialties: newSpecialties });
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Services & Specialties
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the services you offer (select at least one)
        </p>
      </div>

      {/* Specialties Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(availableSpecialties).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => toggleSpecialty(value)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${data.specialties.includes(value)
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mr-3 ${data.specialties.includes(value)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
              >
                {data.specialties.includes(value) && (
                  <CheckCircleSolid className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {errors.specialties && (
        <p className="mt-2 text-sm text-red-600">{errors.specialties}</p>
      )}

      {data.specialties.length === 0 && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Please select at least one specialty
        </p>
      )}
    </motion.div>
  );
}