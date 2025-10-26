import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Wrench, Eye, ChevronRight } from 'lucide-react';
import { MaintenanceGuide } from '@/types/maintenance';
import DifficultyBadge from './DifficultyBadge';
import CostEstimate from './CostEstimate';

interface MaintenanceGuideCardProps {
  guide: MaintenanceGuide;
  index: number;
}

const categoryGradients: Record<string, string> = {
  fluid_check: 'from-blue-500 to-blue-600',
  filter_replacement: 'from-purple-500 to-purple-600',
  tire_maintenance: 'from-green-500 to-green-600',
  brake_maintenance: 'from-red-500 to-red-600',
  engine_maintenance: 'from-orange-500 to-orange-600',
  electrical: 'from-yellow-500 to-yellow-600',
  seasonal: 'from-pink-500 to-pink-600',
  general: 'from-gray-500 to-gray-600',
};

export default function MaintenanceGuideCard({ guide, index }: MaintenanceGuideCardProps) {
  const gradient = categoryGradients[guide.category] || categoryGradients.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/resources/maintenance/guides/${guide.slug}`}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
        >
          {/* Image or Gradient Header */}
          <div className={`h-40 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
            {guide.featured_image ? (
              <img
                src={guide.featured_image}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Wrench className="w-16 h-16 text-white/30" />
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="absolute top-4 right-4">
              <DifficultyBadge difficulty={guide.difficulty} />
            </div>

            {/* Popular Badge */}
            {guide.is_popular && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
                  ⭐ Popular
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {guide.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {guide.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{guide.formatted_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{guide.view_count.toLocaleString()} views</span>
              </div>
            </div>

            {/* Cost Estimate */}
            <CostEstimate costRange={guide.formatted_cost_range} className="mb-4" />

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