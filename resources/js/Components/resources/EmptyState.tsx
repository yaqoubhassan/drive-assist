import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  currentCategory?: string;
  onClearFilters: () => void;
}

export default function EmptyState({
  searchQuery,
  currentCategory,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 md:py-20"
    >
      <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        No issues found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-base md:text-lg px-4">
        We couldn't find any issues matching your search. Try different keywords or clear your
        filters.
      </p>
      <button
        onClick={onClearFilters}
        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <X className="w-5 h-5 mr-2" />
        Clear All Filters
      </button>
    </motion.div>
  );
}