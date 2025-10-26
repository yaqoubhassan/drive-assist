import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GuideShowProps } from '@/types/maintenance';
import DifficultyBadge from '@/Components/maintenance/DifficultyBadge';
import CostEstimate from '@/Components/maintenance/CostEstimate';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import MaintenanceGuideCard from '@/Components/maintenance/MaintenanceGuideCard';
import {
  ArrowLeft,
  Clock,
  Eye,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Play,
  Download,
  Share2,
} from 'lucide-react';

export default function GuideShow({ guide, relatedGuides }: GuideShowProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${guide.title} - Maintenance Guides - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link
                href="/resources/maintenance/guides"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Guides
              </Link>
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {guide.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <DifficultyBadge difficulty={guide.difficulty} />

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{guide.formatted_time}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{guide.view_count.toLocaleString()} views</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {guide.description}
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
            </motion.div>

            {/* Featured Image or Video */}
            {(guide.featured_image || guide.video_url) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 rounded-xl overflow-hidden"
              >
                {guide.video_url ? (
                  <div className="relative aspect-video bg-gray-900">
                    <iframe
                      src={guide.video_url}
                      title={guide.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : guide.featured_image ? (
                  <img
                    src={guide.featured_image}
                    alt={guide.title}
                    className="w-full h-auto"
                  />
                ) : null}
              </motion.div>
            )}

            {/* Cost Estimate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                At a Glance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CostEstimate costRange={guide.formatted_cost_range} />
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Required</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {guide.formatted_time}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Safety Warnings */}
            {guide.safety_warnings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-lg mb-8"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                      Safety Warnings
                    </h3>
                    <p className="text-red-800 dark:text-red-200 whitespace-pre-line">
                      {guide.safety_warnings}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tools Required */}
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
                {guide.tools_required.map((tool, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Materials Needed */}
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
                {guide.materials_needed.map((material, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Step-by-Step Instructions */}
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
                {guide.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex gap-4">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {step.step_number}
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

            {/* Tips and Tricks */}
            {guide.tips_and_tricks && (
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
                  {guide.tips_and_tricks}
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
                resourceId={guide.id}
                helpfulCount={guide.helpful_count}
              />
            </motion.div>

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
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
                    <MaintenanceGuideCard key={relatedGuide.id} guide={relatedGuide} index={index} />
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