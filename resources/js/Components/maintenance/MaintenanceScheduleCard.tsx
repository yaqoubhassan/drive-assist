import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Eye, ChevronRight, CheckCircle } from 'lucide-react';
import { MaintenanceSchedule } from '@/types/maintenance';
import CostEstimate from './CostEstimate';

interface MaintenanceScheduleCardProps {
  schedule: MaintenanceSchedule;
  index: number;
}

const priorityConfig = {
  low: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
  },
  medium: {
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  high: {
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
  },
  critical: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
  },
};

export default function MaintenanceScheduleCard({ schedule, index }: MaintenanceScheduleCardProps) {
  const config = priorityConfig[schedule.priority];

  // Defensive: Ensure tasks is always an array
  const tasks = Array.isArray(schedule.tasks) ? schedule.tasks : [];
  const hasValidTasks = tasks.length > 0;

  // Helper to safely extract task text
  const getTaskText = (task: any): string => {
    if (typeof task === 'string') return task;
    if (task && typeof task === 'object' && task.task) return task.task;
    return 'Task';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/resources/maintenance/schedules/${schedule.slug}`}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {schedule.title}
              </h3>
            </div>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}
            >
              {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {schedule.description}
          </p>

          {/* Interval Info */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {schedule.formatted_interval}
            </span>
          </div>

          {/* Tasks Preview */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Key Tasks:
            </p>
            {hasValidTasks ? (
              <ul className="space-y-1">
                {tasks.slice(0, 3).map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getTaskText(task)}</span>
                  </li>
                ))}
                {tasks.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                    +{tasks.length - 3} more tasks
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click to view schedule details
              </p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{schedule.view_count.toLocaleString()} views</span>
            </div>
            {schedule.diy_possible && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ DIY Possible
              </span>
            )}
          </div>

          {/* Cost Estimate */}
          <CostEstimate costRange={schedule.formatted_cost_range} className="mb-4" />

          {/* Link */}
          <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
            View Schedule
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}