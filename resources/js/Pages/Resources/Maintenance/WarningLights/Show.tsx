import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import { WarningLightShowProps, WarningLight } from '@/types/maintenance';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  X,
  DollarSign,
  Lightbulb,
  Share2,
  Download,
  ChevronLeft,
  Eye,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

// Warning Light Card for Related Lights
interface WarningLightCardProps {
  light: WarningLight;
  index: number;
}

function WarningLightCard({ light, index }: WarningLightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/resources/maintenance/warning-lights/${light.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${light.color_badge.bg_class} ${light.color_badge.color} mb-2`}>
              {light.color_badge.label}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {light.name}
            </h3>
          </div>
          {light.icon_image && (
            <img
              src={light.icon_image}
              alt={light.icon_description}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {light.icon_description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {light.view_count.toLocaleString()}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function WarningLightShow({ warningLight, relatedLights }: WarningLightShowProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: warningLight.name,
          text: warningLight.what_it_means,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${warningLight.name} - Dashboard Warning Lights - DriveAssist`} />

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
              <Link href="/resources/maintenance/warning-lights" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Warning Lights
              </Link>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{warningLight.name}</span>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Link
                href="/resources/maintenance/warning-lights"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Warning Lights
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${warningLight.color_badge.bg_class} ${warningLight.color_badge.color}`}>
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: warningLight.color }}></span>
                      {warningLight.color_badge.label}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${warningLight.severity_badge.bg_class} ${warningLight.severity_badge.color}`}>
                      {warningLight.severity === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {warningLight.severity === 'warning' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {warningLight.severity_badge.label}
                    </span>
                    {warningLight.is_common && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Common
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {warningLight.name}
                  </h1>

                  {/* Icon Description */}
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {warningLight.icon_description}
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
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Icon Image */}
                {warningLight.icon_image && (
                  <div className="flex-shrink-0">
                    <img
                      src={warningLight.icon_image}
                      alt={warningLight.icon_description}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Can Continue Driving Alert */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${warningLight.can_continue_driving
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600'
                } border-l-4 p-6 rounded-lg mb-8`}
            >
              <div className="flex items-start gap-3">
                {warningLight.can_continue_driving ? (
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${warningLight.can_continue_driving
                    ? 'text-yellow-900 dark:text-yellow-100'
                    : 'text-red-900 dark:text-red-100'
                    }`}>
                    {warningLight.can_continue_driving
                      ? 'Can Continue Driving (With Caution)'
                      : 'Stop Driving Immediately'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${warningLight.can_continue_driving
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-red-800 dark:text-red-200'
                    }`}>
                    {warningLight.can_continue_driving
                      ? 'While you may continue driving, this issue should be addressed soon. Monitor the situation closely and avoid long trips until resolved.'
                      : 'This is a critical warning. Pull over safely as soon as possible and turn off the engine. Do not continue driving as it may cause serious damage or be dangerous.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* What It Means */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What This Light Means
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {warningLight.what_it_means}
              </p>
            </motion.div>

            {/* What To Do */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What You Should Do
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {warningLight.what_to_do}
                </p>
              </div>
            </motion.div>

            {/* Typical Causes */}
            {warningLight.typical_causes && warningLight.typical_causes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Common Causes
                </h2>
                <ul className="space-y-3">
                  {warningLight.typical_causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{cause}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Cost Estimate */}
            {(warningLight.estimated_repair_cost_min || warningLight.estimated_repair_cost_max) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Typical Repair Cost
                </h2>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {warningLight.formatted_cost_range}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Actual costs may vary based on vehicle and location
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Prevention Tips */}
            {warningLight.prevention_tips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                      Prevention Tips
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
                      {warningLight.prevention_tips}
                    </p>
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
                resourceType="warning-light"
                resourceId={warningLight.id}
                helpfulCount={warningLight.helpful_count}
              />
            </motion.div>

            {/* Related Warning Lights */}
            {relatedLights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Warning Lights
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedLights.map((relatedLight, index) => (
                    <WarningLightCard key={relatedLight.id} light={relatedLight} index={index} />
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