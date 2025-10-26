import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ScheduleShowProps } from '@/types/maintenance';
import CostEstimate from '@/Components/maintenance/CostEstimate';
import HelpfulFeedback from '@/Components/maintenance/HelpfulFeedback';
import MaintenanceScheduleCard from '@/Components/maintenance/MaintenanceScheduleCard';
import {
  ArrowLeft,
  Calendar,
  Eye,
  AlertTriangle,
  CheckCircle,
  Share2,
  Download,
  Clock,
  Wrench,
  User,
} from 'lucide-react';

const priorityConfig = {
  low: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    icon: CheckCircle,
  },
  medium: {
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: AlertTriangle,
  },
  high: {
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    icon: AlertTriangle,
  },
  critical: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    icon: AlertTriangle,
  },
};

export default function ScheduleShow({ schedule, relatedSchedules }: ScheduleShowProps) {
  const config = priorityConfig[schedule.priority];
  const PriorityIcon = config.icon;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: schedule.title,
        text: schedule.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title={`${schedule.title} - Maintenance Schedules - DriveAssist`} />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link
                href="/resources/maintenance/schedules"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Schedules
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
                {schedule.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${config.bg} ${config.color} ${config.border}`}
                >
                  <PriorityIcon className="w-4 h-4" />
                  {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)} Priority
                </span>

                {/* Interval */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">{schedule.formatted_interval}</span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{schedule.view_count.toLocaleString()} views</span>
                </div>

                {/* DIY Possible */}
                {schedule.diy_possible && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <Wrench className="w-4 h-4" />
                    DIY Possible
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {schedule.description}
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
                  <span>Print Schedule</span>
                </button>
              </div>
            </motion.div>

            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Interval</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {schedule.formatted_interval}
                    </p>
                  </div>
                </div>

                <CostEstimate costRange={schedule.formatted_cost_range} />

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    {schedule.diy_possible ? (
                      <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Service Type</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {schedule.diy_possible ? 'DIY or Professional' : 'Professional Required'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Maintenance Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Maintenance Tasks
              </h2>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {schedule.tasks.map((task, index) => (
                    <div key={index} className="p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Season Info */}
            {schedule.season && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 mb-8"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Seasonal Maintenance
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      This maintenance schedule is particularly important during{' '}
                      <span className="font-semibold capitalize">{schedule.season}</span> season.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DIY vs Professional Guidance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${schedule.diy_possible
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                } rounded-xl p-6 border mb-8`}
            >
              <div className="flex items-start gap-3">
                {schedule.diy_possible ? (
                  <>
                    <Wrench className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        DIY-Friendly Maintenance
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        These tasks can typically be performed by car owners with basic tools and mechanical knowledge.
                        However, if you're not confident, it's always best to consult a professional mechanic.
                      </p>
                      <Link
                        href="/resources/maintenance/guides"
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                      >
                        View DIY Guides
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <User className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Professional Service Required
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        These tasks require specialized equipment, technical expertise, or diagnostic tools.
                        We recommend having a certified mechanic perform these services.
                      </p>
                      <Link
                        href="/experts"
                        className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold"
                      >
                        Find Local Experts
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Helpful Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-12"
            >
              <HelpfulFeedback
                resourceType="schedule"
                resourceId={schedule.id}
                helpfulCount={schedule.helpful_count}
              />
            </motion.div>

            {/* Related Schedules */}
            {relatedSchedules.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Schedules
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedSchedules.map((relatedSchedule, index) => (
                    <MaintenanceScheduleCard
                      key={relatedSchedule.id}
                      schedule={relatedSchedule}
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