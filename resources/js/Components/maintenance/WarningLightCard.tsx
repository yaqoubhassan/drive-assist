import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import type { WarningLight } from '@/types/maintenance';

interface WarningLightCardProps {
  light: WarningLight;
  index?: number;
}

// Get severity-based gradient that's more pleasing
const getSeverityGradient = (severity: string): string => {
  const gradients: Record<string, string> = {
    'critical': 'from-rose-500 to-red-600',
    'warning': 'from-amber-500 to-orange-500',
    'informational': 'from-blue-500 to-indigo-600',
    'maintenance': 'from-emerald-500 to-teal-600',
  };
  return gradients[severity] || 'from-gray-500 to-gray-700';
};

// Get color-based icon background
const getColorIconBg = (color: string): string => {
  const backgrounds: Record<string, string> = {
    'red': 'bg-red-100 dark:bg-red-900/30',
    'yellow': 'bg-yellow-100 dark:bg-yellow-900/30',
    'orange': 'bg-orange-100 dark:bg-orange-900/30',
    'blue': 'bg-blue-100 dark:bg-blue-900/30',
    'green': 'bg-green-100 dark:bg-green-900/30',
    'white': 'bg-gray-100 dark:bg-gray-700',
  };
  return backgrounds[color] || 'bg-gray-100 dark:bg-gray-700';
};

// Emoji map based on severity
const getSeverityEmoji = (severity: string): string => {
  const emojis: Record<string, string> = {
    'critical': '⚠️',
    'warning': '⚡',
    'informational': 'ℹ️',
    'maintenance': '🔧',
  };
  return emojis[severity] || '💡';
};

export default function WarningLightCard({ light, index = 0 }: WarningLightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const gradientClass = getSeverityGradient(light.severity);
  const iconBgClass = getColorIconBg(light.color);
  const emoji = getSeverityEmoji(light.severity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 flex flex-col h-full group"
    >
      {/* Header with gradient background - MIN HEIGHT for flexibility */}
      <div className={`bg-gradient-to-br ${gradientClass} p-6 min-h-[140px] flex flex-col`}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {light.icon_image ? (
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center">
                <img
                  src={light.icon_image}
                  alt={light.icon_description}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-3xl">{emoji}</span>
              </div>
            )}
          </div>

          {/* Title and Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {light.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/25 backdrop-blur-sm text-white">
                {light.color.toUpperCase()} LIGHT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/25 backdrop-blur-sm text-white">
                {light.severity_badge.label}
              </span>
            </div>

            <p className="text-sm text-white/95 leading-relaxed">
              {light.what_it_means}
            </p>
          </div>
        </div>
      </div>

      {/* Can Continue Driving Indicator */}
      <div className="p-4">
        <div className={`flex items-center gap-3 p-3 rounded-lg ${light.can_continue_driving
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50'
            : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50'
          }`}>
          {light.can_continue_driving ? (
            <>
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Safe to continue driving
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Schedule service soon
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircleIcon className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                  Stop or use extreme caution
                </p>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                  Seek immediate assistance
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Icon Description - MIN HEIGHT */}
      <div className="px-6 pb-4 min-h-[80px]">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {light.icon_description}
        </p>
      </div>

      {/* Cost Range */}
      {(light.estimated_repair_cost_min && light.estimated_repair_cost_max) && (
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estimated Cost:
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              ${light.estimated_repair_cost_min} - ${light.estimated_repair_cost_max}
            </span>
          </div>
        </div>
      )}

      {/* Expandable Details Button */}
      <div className="px-6 pb-6 mt-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group/btn"
        >
          <span className="font-semibold text-gray-900 dark:text-white text-sm">
            {isExpanded ? 'Hide' : 'View'} detailed information
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover/btn:text-gray-700 dark:group-hover/btn:text-gray-200" />
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
            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-6 space-y-5">
              {/* What to Do */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2 text-base">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  What You Should Do
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line leading-relaxed">
                  {light.what_to_do}
                </p>
              </div>

              {/* Typical Causes */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-5 border border-amber-200 dark:border-amber-800/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2 text-base">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Common Causes
                </h4>
                <ul className="space-y-2">
                  {light.typical_causes.map((cause, index) => (
                    <li key={index} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="flex-1">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              {light.prevention_tips && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800/50">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-3 flex items-center gap-2 text-base">
                    <LightBulbIcon className="w-5 h-5" />
                    Prevention Tips
                  </h4>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 whitespace-pre-line leading-relaxed">
                    {light.prevention_tips}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}