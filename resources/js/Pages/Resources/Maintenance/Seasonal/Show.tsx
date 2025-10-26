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
} from 'lucide-react';

// Checklist Card for Related Checklists
interface ChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

function ChecklistCard({ checklist, index }: ChecklistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/resources/maintenance/seasonal/${checklist.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${checklist.season_info.bg_class} mb-2`}>
              <span className="text-xl mr-2">{checklist.season_info.emoji}</span>
              {checklist.season.charAt(0).toUpperCase() + checklist.season.slice(1)}
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
              {checklist.checklist_items.length} items
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {checklist.formatted_time}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function SeasonalChecklistShow({ checklist, relatedChecklists }: SeasonalChecklistShowProps) {
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedItems(newCompleted);
  };

  const progressPercentage = (completedItems.size / checklist.checklist_items.length) * 100;

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
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${checklist.title} - Seasonal Maintenance - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8"
            >
              <Link href="/resources" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Resources
              </Link>
              <span>/</span>
              <Link href="/resources/maintenance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Maintenance
              </Link>
              <span>/</span>
              <Link href="/resources/maintenance/seasonal" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Seasonal
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{checklist.title}</span>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                href="/resources/maintenance/seasonal"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Seasonal Checklists
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8"
            >
              {/* Season Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${checklist.season_info.bg_class}`}>
                  <span className="text-2xl mr-2">{checklist.season_info.emoji}</span>
                  {checklist.season.charAt(0).toUpperCase() + checklist.season.slice(1)} Maintenance
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  <Eye className="w-3 h-3 mr-1" />
                  {checklist.view_count.toLocaleString()} views
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {checklist.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {checklist.description}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                      {checklist.checklist_items.length} tasks
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
                      {checklist.formatted_time}
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
                      {checklist.formatted_cost_range}
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
                    {completedItems.size} / {checklist.checklist_items.length} completed ({Math.round(progressPercentage)}%)
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

              <div className="space-y-4">
                {checklist.checklist_items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`border rounded-lg p-4 transition-all ${completedItems.has(index)
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800'
                      : getPriorityBgColor(item.priority)
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
                          <h4 className={`font-semibold text-gray-900 dark:text-white ${completedItems.has(index) ? 'line-through opacity-60' : ''
                            }`}>
                            {item.item}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${item.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            item.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                              item.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            }`}>
                            {item.priority === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {item.priority === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {item.priority}
                          </span>
                        </div>
                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${completedItems.has(index) ? 'line-through opacity-60' : ''
                          }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                resourceId={checklist.id}
                helpfulCount={checklist.helpful_count}
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
                    <ChecklistCard key={relatedChecklist.id} checklist={relatedChecklist} index={index} />
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