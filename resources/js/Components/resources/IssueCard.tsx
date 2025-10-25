import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  Eye,
  ThumbsUp,
  ArrowRight,
  DollarSign,
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface IssueCardProps {
  issue: {
    id: number;
    title: string;
    slug: string;
    category: string;
    severity: string;
    symptoms: string;
    estimated_cost_min: number | null;
    estimated_cost_max: number | null;
    view_count: number;
    helpful_count: number;
    is_popular?: boolean;
    cost_range: string;
  };
  index?: number;
  showPopularBadge?: boolean;
}

const categoryIcons: Record<string, any> = {
  engine: Wrench,
  brakes: AlertCircle,
  electrical: Zap,
  transmission: Cog,
  tires: Disc,
  suspension: Move,
  cooling: Droplets,
  fuel: Fuel,
  exhaust: Wind,
  steering: Cog,
};

const getSeverityConfig = (severity: string) => {
  const configs = {
    low: {
      label: 'Minor Issue',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
    },
    medium: {
      label: 'Moderate',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: Clock,
    },
    high: {
      label: 'Serious',
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: AlertTriangle,
    },
    critical: {
      label: 'Critical',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: AlertCircle,
    },
  };
  return configs[severity as keyof typeof configs] || configs.medium;
};

export default function IssueCard({ issue, index = 0, showPopularBadge = false }: IssueCardProps) {
  const Icon = categoryIcons[issue.category] || Wrench;
  const severityConfig = getSeverityConfig(issue.severity);
  const SeverityIcon = severityConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.03 * index, 0.4), duration: 0.3 }}
    >
      <Link href={route('car-issues.show', issue.slug)} className="block group h-full">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
          {/* Popular Badge */}
          {showPopularBadge && issue.is_popular && (
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="p-6 pb-4">
            <div className="flex items-start space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${severityConfig.bg} ${severityConfig.color}`}
                >
                  <SeverityIcon className="w-3 h-3 mr-1" />
                  {severityConfig.label}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {issue.title}
                </h3>
              </div>
            </div>

            {/* Symptoms Preview */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
              {issue.symptoms}
            </p>

            {/* Cost Range */}
            {issue.estimated_cost_min && issue.estimated_cost_max && (
              <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                <DollarSign className="w-4 h-4 mr-1" />
                {issue.cost_range}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4 mr-1.5" />
                {issue.view_count.toLocaleString()}
              </span>
              <span className="flex items-center text-gray-600 dark:text-gray-400">
                <ThumbsUp className="w-4 h-4 mr-1.5" />
                {issue.helpful_count.toLocaleString()}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}