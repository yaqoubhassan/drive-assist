import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Droplets, Eye, ChevronRight, AlertCircle } from 'lucide-react';
import { FluidGuide } from '@/types/maintenance';
import CostEstimate from './CostEstimate';

interface FluidGuideCardProps {
  fluid: FluidGuide;
  index: number;
}

export default function FluidGuideCard({ fluid, index }: FluidGuideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/resources/maintenance/fluids/${fluid.slug}`}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
        >
          {/* Icon Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{fluid.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{fluid.name}</h3>
                  <p className="text-sm text-white/80">{fluid.fluid_type.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Critical Badge */}
              {fluid.is_critical && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  <AlertCircle className="w-3 h-3" />
                  Critical
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {fluid.description}
            </p>

            {/* Intervals */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check Every</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fluid.check_interval_text}
                </p>
              </div>
              {fluid.change_interval_text !== 'N/A' && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Change Every</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {fluid.change_interval_text}
                  </p>
                </div>
              )}
            </div>

            {/* Color Indicators */}
            {fluid.color_when_good && fluid.color_when_bad && (
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600">
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: fluid.color_when_good }} />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600">
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: fluid.color_when_bad }} />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Bad</span>
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{fluid.view_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Cost Estimate */}
            <CostEstimate costRange={fluid.formatted_cost_range} className="mb-4" />

            {/* Link */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              View Guide
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