// resources/js/Pages/Resources/Maintenance/Guides/Show.tsx

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MaintenanceGuideCard from '@/Components/maintenance/MaintenanceGuideCard';
import DifficultyBadge from '@/Components/maintenance/DifficultyBadge';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Eye,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
} from 'lucide-react';
import { GuideShowProps } from '@/types/maintenance';

// ============================================================================
// DEFENSIVE HELPER FUNCTION - Ensures arrays are never null/undefined
// ============================================================================
const ensureArray = (value: any): any[] => {
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

export default function GuideShow({ guide, relatedGuides }: GuideShowProps) {
  // ============================================================================
  // DEFENSIVE DATA WRAPPING - Ensure all arrays are properly formatted
  // ============================================================================
  const safeGuide = {
    ...guide,
    tools_required: ensureArray(guide.tools_required),
    materials_needed: ensureArray(guide.materials_needed),
    steps: ensureArray(guide.steps),
  };

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleShare = async () => {
    const url = window.location.href;
    const title = safeGuide.title;
    const text = `Check out this maintenance guide: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setShareMessage('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }

    setTimeout(() => setShareMessage(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShareMessage('Link copied to clipboard!');
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${safeGuide.title} - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/resources/maintenance/guides"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Guides</span>
            </Link>

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                  {safeGuide.category_label || 'Guide'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {safeGuide.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <DifficultyBadge difficulty={safeGuide.difficulty} />

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{safeGuide.formatted_time}</span>
                </div>

                {safeGuide.formatted_cost_range && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{safeGuide.formatted_cost_range}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{safeGuide.view_count.toLocaleString()} views</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {safeGuide.description}
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
                  <span>Print Guide</span>
                </button>
              </div>

              {/* Share Message */}
              {shareMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg"
                >
                  {shareMessage}
                </motion.div>
              )}
            </motion.div>

            {/* Featured Image or Video */}
            {(safeGuide.featured_image || safeGuide.video_url) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 rounded-xl overflow-hidden"
              >
                {safeGuide.video_url ? (
                  <div className="relative aspect-video bg-gray-900">
                    <iframe
                      src={safeGuide.video_url}
                      title={safeGuide.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : safeGuide.featured_image ? (
                  <img
                    src={safeGuide.featured_image}
                    alt={safeGuide.title}
                    className="w-full h-auto rounded-xl"
                  />
                ) : null}
              </motion.div>
            )}

            {/* Cost Estimate */}
            {(safeGuide.estimated_cost_min || safeGuide.estimated_cost_max) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 mb-8"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      Estimated Cost
                    </h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {safeGuide.formatted_cost_range}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Parts and materials (labor not included)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Safety Warnings */}
            {safeGuide.safety_warnings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-l-4 border-red-500 dark:border-red-600 mb-8"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                      Safety Warnings
                    </h3>
                    <p className="text-red-800 dark:text-red-200 whitespace-pre-line">
                      {safeGuide.safety_warnings}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tools Required */}
            {safeGuide.tools_required.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Tools Required
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeGuide.tools_required.map((tool, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Materials Needed */}
            {safeGuide.materials_needed.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Materials Needed
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeGuide.materials_needed.map((material, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Step-by-Step Instructions */}
            {safeGuide.steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Step-by-Step Instructions
                </h2>

                <div className="space-y-6">
                  {safeGuide.steps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex gap-4">
                        {/* Step Number */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {step.step_number || index + 1}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State Message (if no steps) */}
            {safeGuide.steps.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800 mb-8 text-center"
              >
                <p className="text-yellow-800 dark:text-yellow-200">
                  Detailed step-by-step instructions are being prepared for this guide.
                </p>
              </motion.div>
            )}

            {/* Tips and Tricks */}
            {safeGuide.tips_and_tricks && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Tips & Tricks
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {safeGuide.tips_and_tricks}
                </p>
              </motion.div>
            )}

            {/* Helpful Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-12"
            >
              <HelpfulFeedback
                resourceType="guide"
                resourceId={safeGuide.id}
                helpfulCount={safeGuide.helpful_count}
              />
            </motion.div>

            {/* Related Guides */}
            {relatedGuides && relatedGuides.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Guides
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedGuides.map((relatedGuide, index) => (
                    <MaintenanceGuideCard
                      key={relatedGuide.id}
                      guide={relatedGuide}
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