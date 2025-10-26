import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { WarningLight } from '@/types/maintenance';
import SeverityBadge from './SeverityBadge';
import CostEstimate from './CostEstimate';

interface WarningLightCardProps {
  light: WarningLight;
  index: number;
}

export default function WarningLightCard({ light, index }: WarningLightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/resources/maintenance/warning-lights/${light.slug}`}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
        >
          {/* Icon Header */}
          <div className={`${light.severity_info.bg_class} p-6 relative`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">{light.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{light.name}</h3>
                  <p className="text-sm text-white/80">{light.color} light</p>
                </div>
              </div>

              {/* Common Badge */}
              {light.is_common && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  Common
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Severity Badge */}
            <div className="mb-4">
              <SeverityBadge severity={light.severity} />
            </div>

            {/* Meaning */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {light.meaning}
            </p>

            {/* Safe to Drive Indicator */}
            <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${light.safe_to_drive
              ? 'bg-green-50 dark:bg-green-900/20'
              : 'bg-red-50 dark:bg-red-900/20'
              }`}>
              {light.safe_to_drive ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Safe to Drive
                    </p>
                    {light.driving_restrictions && (
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {light.driving_restrictions}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                      Do Not Drive
                    </p>
                    {light.driving_restrictions && (
                      <p className="text-xs text-red-700 dark:text-red-300">
                        {light.driving_restrictions}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{light.view_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Cost Estimate */}
            {light.formatted_cost_range !== 'Varies' && (
              <CostEstimate costRange={light.formatted_cost_range} className="mb-4" />
            )}

            {/* Link */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              View Details
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}