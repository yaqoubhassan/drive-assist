import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Eye, ChevronRight, CheckCircle } from 'lucide-react';
import { SeasonalChecklist } from '@/types/maintenance';
import CostEstimate from './CostEstimate';

interface SeasonalChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

export default function SeasonalChecklistCard({ checklist, index }: SeasonalChecklistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/resources/maintenance/seasonal/${checklist.slug}`}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
        >
          {/* Season Header */}
          <div className={`${checklist.season_info.bg_class} p-6 relative`}>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">{checklist.season_info.emoji}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{checklist.title}</h3>
                <p className="text-sm text-white/80 capitalize">{checklist.season} Preparation</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {checklist.description}
            </p>

            {/* Time & Cost Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Time</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {checklist.formatted_time}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Items</p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {checklist.checklist_items.length} tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Preview */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Key Items:
              </p>
              <ul className="space-y-1">
                {checklist.checklist_items.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item.item}</span>
                  </li>
                ))}
                {checklist.checklist_items.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                    +{checklist.checklist_items.length - 3} more items
                  </li>
                )}
              </ul>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{checklist.view_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Cost Estimate */}
            <CostEstimate costRange={checklist.formatted_cost_range} className="mb-4" />

            {/* Link */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              View Checklist
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