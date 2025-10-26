import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import type { FluidGuide } from '@/types/maintenance';

interface FluidGuideCardProps {
  fluid: FluidGuide;
  index?: number; // Optional, used for animation delays
}

// Gradient colors for different fluid types
const getGradientClass = (fluidType: string | null): string => {
  if (!fluidType) return 'from-gray-500 to-gray-700';

  const gradients: Record<string, string> = {
    'engine_oil': 'from-amber-500 to-orange-600',
    'coolant': 'from-green-500 to-emerald-600',
    'brake_fluid': 'from-red-500 to-rose-600',
    'transmission_fluid': 'from-pink-500 to-red-600',
    'power_steering': 'from-purple-500 to-indigo-600',
    'windshield_washer': 'from-blue-500 to-cyan-600',
  };

  return gradients[fluidType] || 'from-blue-500 to-indigo-600';
};

// Get emoji for fluid type
const getFluidEmoji = (fluidType: string | null, icon: string | null): string => {
  if (icon) return icon;
  if (!fluidType) return '💧';

  const emojis: Record<string, string> = {
    'engine_oil': '🛢️',
    'coolant': '🌡️',
    'brake_fluid': '🛑',
    'transmission_fluid': '⚙️',
    'power_steering': '🔄',
    'windshield_washer': '💦',
  };

  return emojis[fluidType] || '💧';
};

export default function FluidGuideCard({ fluid, index = 0 }: FluidGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const gradientClass = getGradientClass(fluid.fluid_type);
  const emoji = getFluidEmoji(fluid.fluid_type, fluid.icon);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-br ${gradientClass} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <span className="text-4xl">{emoji}</span>
            </div>

            {/* Title and Info */}
            <div>
              <h3 className="text-xl font-bold mb-2">
                {fluid.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {fluid.is_critical && (
                  <span className="text-xs bg-red-500/30 border border-red-300/50 px-2 py-1 rounded-full flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    Critical
                  </span>
                )}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Check: {fluid.check_interval_text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Check Interval
          </p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {fluid.check_interval_text}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Change Interval
          </p>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {fluid.change_interval_text}
          </p>
        </div>
        {fluid.formatted_capacity && (
          <div className="col-span-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Typical Capacity</p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {fluid.formatted_capacity}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {fluid.description}
        </p>
      </div>

      {/* Function */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Function</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {fluid.function}
        </p>
      </div>

      {/* Estimated Cost */}
      {fluid.formatted_cost_range && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <CurrencyDollarIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-gray-600 dark:text-gray-400">Estimated Cost:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {fluid.formatted_cost_range}
            </span>
          </div>
        </div>
      )}

      {/* Expandable Details */}
      <div className="px-6 pb-4 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            How to check, change & warning signs
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* How to Check */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    How to Check
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {fluid.check_procedure}
                  </p>
                </div>

                {/* How to Change */}
                {fluid.change_procedure && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      How to Change
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {fluid.change_procedure}
                    </p>
                  </div>
                )}

                {/* Warning Signs */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                    <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                    Warning Signs
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-line">
                    {fluid.warning_signs}
                  </p>
                </div>

                {/* Color Reference */}
                {(fluid.color_when_good || fluid.color_when_bad) && (
                  <div className="grid grid-cols-2 gap-3">
                    {fluid.color_when_good && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-1">
                          Good Condition
                        </p>
                        <p className="text-sm text-green-800 dark:text-green-300">
                          {fluid.color_when_good}
                        </p>
                      </div>
                    )}
                    {fluid.color_when_bad && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-1">
                          Needs Replacement
                        </p>
                        <p className="text-sm text-red-800 dark:text-red-300">
                          {fluid.color_when_bad}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}