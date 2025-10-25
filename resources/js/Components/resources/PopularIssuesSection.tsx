import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import IssueCard from './IssueCard';

interface PopularIssuesSectionProps {
  issues: Array<{
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
    is_popular: boolean;
    cost_range: string;
  }>;
}

export default function PopularIssuesSection({ issues }: PopularIssuesSectionProps) {
  if (issues.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-16"
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Most Common Issues
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            The top issues drivers search for most
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {issues.slice(0, 6).map((issue, index) => (
          <IssueCard key={issue.id} issue={issue} index={index} showPopularBadge />
        ))}
      </div>
    </motion.div>
  );
}