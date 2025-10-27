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
  index?: number;
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
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      {/* Header with gradient background - FIXED HEIGHT */}
      <div className={`bg-gradient-to-br ${gradientClass} p-5 text-white h-32 flex-shrink-0`}>
        <div className="flex items-start gap-3 h-full">
          {/* Icon - FIXED SIZE */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <span className="text-3xl leading-none">{emoji}</span>
          </div>

          {/* Title and Badge - FIXED HEIGHT with overflow handling */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">
              {fluid.name}
            </h3>
            <div className="flex items-center gap-2 mt-auto flex-wrap">
              {fluid.is_critical && (
                <span className="text-xs bg-red-500/30 border border-red-300/50 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  Critical
                </span>
              )}
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0 truncate">
                Check: {fluid.check_interval_text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Grid - FIXED HEIGHT */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 h-28">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              Check Every
            </p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
              {fluid.check_interval_text}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              Change Every
            </p>
            <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
              {fluid.change_interval_text}
            </p>
          </div>
        </div>
      </div>

      {/* Description - FIXED HEIGHT with line clamp */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 h-24">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">What is it?</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {fluid.description}
        </p>
      </div>

      {/* Function - FIXED HEIGHT with line clamp */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 h-24">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">What does it do?</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {fluid.function}
        </p>
      </div>

      {/* Info Row - Capacity & Cost - FIXED HEIGHT */}
      <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 h-16">
        <div className="flex items-center justify-between gap-4">
          {/* Capacity */}
          <div className="flex-1 min-w-0">
            {fluid.formatted_capacity ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400">Typical Capacity</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {fluid.formatted_capacity}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">No capacity data</p>
            )}
          </div>

          {/* Cost */}
          <div className="flex-1 min-w-0">
            {fluid.formatted_cost_range ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400">Est. Cost</p>
                <p className="font-semibold text-green-600 dark:text-green-400 text-sm truncate">
                  {fluid.formatted_cost_range}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">Varies</p>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details Button - FIXED HEIGHT */}
      <div className="px-5 py-4 flex-shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
        >
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {isExpanded ? 'Hide' : 'Show'} detailed guide
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
          </motion.div>
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* How to Check */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  How to Check
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line leading-relaxed">
                  {fluid.check_procedure}
                </p>
              </div>

              {/* How to Change */}
              {fluid.change_procedure && (
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                    How to Change
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-300 whitespace-pre-line leading-relaxed">
                    {fluid.change_procedure}
                  </p>
                </div>
              )}

              {/* Warning Signs */}
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Warning Signs
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-line leading-relaxed">
                  {fluid.warning_signs}
                </p>
              </div>

              {/* Color Reference */}
              {(fluid.color_when_good || fluid.color_when_bad) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fluid.color_when_good && (
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-1">
                        <span className="text-lg">✓</span>
                        Good Condition
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        {fluid.color_when_good}
                      </p>
                    </div>
                  )}
                  {fluid.color_when_bad && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-2 flex items-center gap-1">
                        <span className="text-lg">✕</span>
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
    </motion.div>
  );
}