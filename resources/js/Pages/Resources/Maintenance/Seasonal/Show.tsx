import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import { SeasonalChecklistShowProps, SeasonalChecklist } from '@/types/maintenance';
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Lightbulb,
  Share2,
  Download,
  ChevronLeft,
  Eye,
  ArrowRight,
  Circle,
  ThumbsUp,
} from 'lucide-react';
import { BackButton } from '@/Components/ui';

// ============================================================================
// DEFENSIVE HELPER FUNCTIONS
// ============================================================================

/**
 * Ensures a value is always an array, never null or undefined
 */
const ensureArray = <T,>(value: any): T[] => {
  // If it's already an array, return it
  if (Array.isArray(value)) return value;

  // If it's null or undefined, return empty array
  if (value === null || value === undefined) return [];

  // If it's a string (shouldn't happen with proper backend), try to parse
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  // Default: return empty array
  return [];
};

/**
 * Get priority background color classes
 */
const getPriorityBgColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
    case 'high':
      return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800';
    case 'medium':
      return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800';
    default:
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

/**
 * Get priority badge color classes
 */
const getPriorityBadgeColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    default:
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
  }
};

// ============================================================================
// CHECKLIST CARD COMPONENT (for Related Checklists)
// ============================================================================

interface ChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

function ChecklistCard({ checklist, index }: ChecklistCardProps) {
  // Ensure checklist_items is always an array
  const items = ensureArray(checklist.checklist_items);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/resources/maintenance/seasonal/${checklist.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${checklist.season_info?.bg_class || 'bg-gray-500'
                } text-white mb-2`}
            >
              <span className="text-xl mr-2">
                {checklist.season_info?.emoji || '📅'}
              </span>
              {checklist.season?.charAt(0).toUpperCase() + checklist.season?.slice(1) || 'Season'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {checklist.title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {checklist.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {items.length} items
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {checklist.formatted_time || 'N/A'}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SeasonalChecklistShow({
  checklist: rawChecklist,
  relatedChecklists: rawRelatedChecklists,
}: SeasonalChecklistShowProps) {
  // ============================================================================
  // DEFENSIVE DATA WRAPPING - Ensure all arrays are properly formatted
  // ============================================================================

  const checklist = {
    ...rawChecklist,
    checklist_items: ensureArray(rawChecklist.checklist_items),
    season_info: rawChecklist.season_info || {
      emoji: '📅',
      color: 'gray',
      bg_class: 'bg-gray-500',
    },
  };

  const relatedChecklists = ensureArray<SeasonalChecklist>(rawRelatedChecklists);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const totalItems = checklist.checklist_items.length;
  const progressPercentage = totalItems > 0 ? (completedItems.size / totalItems) * 100 : 0;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleItem = (index: number) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedItems(newCompleted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: checklist.title,
          text: checklist.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${checklist.title} | DriveAssist`} />
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          <div className="max-w-4xl mx-auto">
            <BackButton href="/resources/maintenance/seasonal" label="Back to Seasonal Checklists" className="mb-6 mt-10" />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-8 border border-gray-200 dark:border-gray-700 mb-8"
            >
              {/* Season Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium ${checklist.season_info.bg_class} text-white`}
                >
                  <span className="text-xl sm:text-2xl mr-2">{checklist.season_info.emoji}</span>
                  {checklist.season?.charAt(0).toUpperCase() + checklist.season?.slice(1) || 'Season'} Maintenance
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  <Eye className="w-3 h-3 mr-1" />
                  {checklist.view_count?.toLocaleString() || 0} views
                </span>
                <div className='inline-flex gap-1 items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium'>
                  <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0 text-green-500 dark:text-green-400" />
                  <span>{checklist.helpful_count?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {checklist.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6">
                {checklist.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Checklist</span>
                </button>
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                At a Glance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {totalItems} tasks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Required</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checklist.formatted_time || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Cost</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {checklist.formatted_cost_range || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            {completedItems.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Progress
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {completedItems.size} / {totalItems} completed ({Math.round(progressPercentage)}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                </div>
              </motion.div>
            )}

            {/* Why Important */}
            {checklist.why_important && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                      Why This Checklist Matters
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                      {checklist.why_important}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Checklist Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Maintenance Checklist
              </h2>

              {totalItems === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No checklist items available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {checklist.checklist_items.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={`border rounded-lg p-4 transition-all ${completedItems.has(index)
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800'
                        : getPriorityBgColor(item.priority || 'low')
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleItem(index)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${completedItems.has(index)
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                            }`}
                        >
                          {completedItems.has(index) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4
                              className={`font-semibold text-gray-900 dark:text-white ${completedItems.has(index) ? 'line-through opacity-60' : ''
                                }`}
                            >
                              {item.item || 'Checklist item'}
                            </h4>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityBadgeColor(
                                item.priority || 'low'
                              )}`}
                            >
                              {item.priority === 'critical' && (
                                <AlertTriangle className="w-3 h-3 mr-1" />
                              )}
                              {item.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {item.priority || 'low'}
                            </span>
                          </div>
                          <p
                            className={`text-sm text-gray-600 dark:text-gray-400 ${completedItems.has(index) ? 'line-through opacity-60' : ''
                              }`}
                          >
                            {item.description || ''}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Additional Tips */}
            {checklist.additional_tips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                      Additional Tips & Recommendations
                    </h3>
                    <div className="text-yellow-800 dark:text-yellow-200 leading-relaxed whitespace-pre-wrap">
                      {checklist.additional_tips}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Helpful Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-12"
            >
              <HelpfulFeedback
                resourceType="checklist"
                resourceSlug={checklist.slug}
                helpfulCount={checklist.helpful_count || 0}
              />
            </motion.div>

            {/* Related Checklists */}
            {relatedChecklists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Other Seasonal Checklists
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedChecklists.map((relatedChecklist, index) => (
                    <ChecklistCard
                      key={relatedChecklist.id}
                      checklist={relatedChecklist}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}