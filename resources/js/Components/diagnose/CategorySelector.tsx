import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  AlertCircle,
  Zap,
  Cog,
  Disc,
  Search,
  Check,
} from 'lucide-react';

export type Category = 'engine' | 'brakes' | 'electrical' | 'transmission' | 'tires' | 'other';

interface CategoryOption {
  value: Category;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const categories: CategoryOption[] = [
  {
    value: 'engine',
    label: 'Engine Problems',
    description: 'Strange noises, check engine light, poor performance',
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    value: 'brakes',
    label: 'Brake Issues',
    description: 'Squeaking, grinding, soft pedal, vibrations',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    value: 'electrical',
    label: 'Electrical Faults',
    description: 'Battery, lights, starter, alternator problems',
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    value: 'transmission',
    label: 'Transmission Issues',
    description: 'Shifting problems, slipping, grinding gears',
    icon: Cog,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    value: 'tires',
    label: 'Tire & Wheel',
    description: 'Flat tire, alignment, balancing, wear issues',
    icon: Disc,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    value: 'other',
    label: "Not Sure / Other",
    description: 'Something else or multiple issues',
    icon: Search,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
  },
];

interface CategorySelectorProps {
  value?: Category;
  onChange: (category: Category) => void;
  error?: string;
}

export default function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = value === category.value;

          return (
            <motion.button
              key={category.value}
              type="button"
              onClick={() => onChange(category.value)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg mb-3 ${category.bgColor}`}>
                <Icon className={`w-6 h-6 ${category.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {category.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.description}
              </p>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}

      {/* Keyboard Navigation Hint */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        💡 Tip: Use Tab and Enter keys to navigate
      </p>
    </div>
  );
}