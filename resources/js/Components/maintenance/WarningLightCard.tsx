import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { WarningLight } from '@/types/maintenance';

interface WarningLightCardProps {
  light: WarningLight;
  index?: number; // Optional, used for animation delays
}

// Emoji map based on color and severity
const getEmoji = (color: string, severity: string): string => {
  if (severity === 'critical') return '🔴';
  if (severity === 'warning') return '⚠️';
  if (color === 'red') return '🔴';
  if (color === 'yellow' || color === 'orange') return '⚠️';
  if (color === 'blue') return '🔵';
  if (color === 'green') return '🟢';
  return '⚪';
};

export default function WarningLightCard({ light, index = 0 }: WarningLightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const emoji = getEmoji(light.color, light.severity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className={`${light.severity_badge.bg_class} p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Icon/Emoji */}
            <div className="flex-shrink-0">
              {light.icon_image ? (
                <img
                  src={light.icon_image}
                  alt={light.icon_description}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-4xl">{emoji}</span>
              )}
            </div>

            {/* Title and Badge */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {light.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${light.severity_badge.bg_class.replace('from', 'bg').replace('to-', '')}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${light.severity_badge.icon_class}`}></span>
                  {light.severity_badge.label}
                </span>
                <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                  {light.color.toUpperCase()} LIGHT
                </span>
              </div>
              <p className="text-sm text-white/90">
                {light.what_it_means}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Can Continue Driving Indicator */}
      <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg mx-6 mt-4 ${light.can_continue_driving
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
        {light.can_continue_driving ? (
          <>
            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                You can continue driving
              </span>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                Schedule service soon but no immediate danger
              </p>
            </div>
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <span className="text-sm font-medium text-red-800 dark:text-red-300">
                Do not drive or drive with extreme caution
              </span>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                Pull over safely and get immediate assistance
              </p>
            </div>
          </>
        )}
      </div>

      {/* Icon Description */}
      <div className="px-6 pb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {light.icon_description}
        </p>
      </div>

      {/* Expandable Section */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            What to do & common causes
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
                {/* What to Do */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">⚙️</span>
                    What to Do
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {light.what_to_do}
                  </p>
                </div>

                {/* Typical Causes */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-amber-600 dark:text-amber-400">🔍</span>
                    Typical Causes
                  </h4>
                  <ul className="space-y-1">
                    {light.typical_causes.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-gray-400 dark:text-gray-500 mt-0.5">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Cost */}
                {light.estimated_repair_cost_min && light.estimated_repair_cost_max && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <span className="font-semibold">Estimated Repair Cost:</span>
                      {' $'}{light.estimated_repair_cost_min} - ${light.estimated_repair_cost_max}
                    </p>
                  </div>
                )}

                {/* Prevention Tips */}
                {light.prevention_tips && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                      💡 Prevention Tips
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-300 whitespace-pre-line">
                      {light.prevention_tips}
                    </p>
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