import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FluidShowProps } from '@/types/maintenance';
import CostEstimate from '@/Components/maintenance/CostEstimate';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import FluidGuideCard from '@/Components/maintenance/FluidGuideCard';
import {
  ArrowLeft,
  Droplets,
  Eye,
  AlertTriangle,
  CheckCircle,
  Share2,
  Download,
  Calendar,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';

export default function FluidShow({ fluid, relatedFluids }: FluidShowProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: fluid.name,
        text: fluid.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  const [currentHelpfulCount, setCurrentHelpfulCount] = useState(fluid.helpful_count);

  const handleHelpfulCountUpdate = (newCount: number) => {
    setCurrentHelpfulCount(newCount);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${fluid.name} Guide - Fluid Guides - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link
                href="/resources/maintenance/fluids"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Fluid Guides
              </Link>
            </div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Title with Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">{fluid.icon}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {fluid.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 capitalize">
                    {fluid.fluid_type?.replace('_', ' ') || 'Unknown Type'}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {fluid.is_critical && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" />
                    Critical Fluid
                  </span>
                )}

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{fluid.view_count.toLocaleString()} views</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {fluid.description}
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

            {/* Quick Reference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Reference
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Check Every</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {fluid.check_interval_text}
                      </p>
                    </div>
                  </div>

                  {fluid.change_interval_text !== 'N/A' && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Wrench className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Change Every</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {fluid.change_interval_text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <CostEstimate costRange={fluid.formatted_cost_range} />
              </div>
            </motion.div>

            {/* Color Indicators */}
            {fluid.color_when_good && fluid.color_when_bad && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Visual Condition Check
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full border-2 border-green-300 dark:border-green-600" style={{ backgroundColor: fluid.color_when_good }} />
                      <div>
                        <h3 className="font-bold text-green-900 dark:text-green-100 text-lg">Good Condition</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">Fluid is healthy</p>
                      </div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full border-2 border-red-300 dark:border-red-600" style={{ backgroundColor: fluid.color_when_bad }} />
                      <div>
                        <h3 className="font-bold text-red-900 dark:text-red-100 text-lg">Needs Attention</h3>
                        <p className="text-sm text-red-700 dark:text-red-300">Fluid should be changed</p>
                      </div>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Function */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What It Does
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {fluid.function}
              </p>
            </motion.div>

            {/* Check Procedure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                How to Check
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {fluid.check_procedure}
              </p>
            </motion.div>

            {/* Change Procedure */}
            {fluid.change_procedure && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  How to Change
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {fluid.change_procedure}
                </p>
              </motion.div>
            )}

            {/* Warning Signs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-lg mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                    Warning Signs of Problems
                  </h3>
                  <p className="text-red-800 dark:text-red-200 whitespace-pre-line">
                    {fluid.warning_signs}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Capacity Info */}
            {fluid.typical_capacity_min && fluid.typical_capacity_max && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                      Typical Capacity
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200">
                      Most vehicles require between {fluid.typical_capacity_min} and {fluid.typical_capacity_max} quarts
                      of {fluid.name.toLowerCase()}. Always check your vehicle's owner manual for the exact capacity.
                    </p>
                  </div>
                </div>
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
                resourceType="fluid"
                resourceSlug={fluid.slug}
                helpfulCount={currentHelpfulCount}
                onCountUpdate={handleHelpfulCountUpdate}
              />
            </motion.div>

            {/* Related Fluids */}
            {relatedFluids.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Fluid Guides
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedFluids.map((relatedFluid, index) => (
                    <FluidGuideCard key={relatedFluid.id} fluid={relatedFluid} index={index} />
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