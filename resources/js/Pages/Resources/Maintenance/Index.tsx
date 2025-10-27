import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Wrench,
  Calendar,
  Droplets,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
} from 'lucide-react';

// Enhanced Props Interface
interface MaintenanceIndexProps {
  stats: {
    total_guides: number;
    total_schedules: number;
    total_fluids: number;
    total_warning_lights: number;
    total_seasonal_checklists: number;
  };
  popularGuides: Array<{
    id: number;
    title: string;
    slug: string;
    difficulty: string;
    estimated_time_minutes: number;
    formatted_time: string;
    view_count: number;
  }>;
  criticalFluids: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
    is_critical: boolean;
    icon: string;
  }>;
  commonWarningLights: Array<{
    id: number;
    name: string;
    slug: string;
    severity: string;
    color: string;
    icon: string;
  }>;
}

const categories = [
  {
    title: 'Maintenance Guides',
    description: 'Step-by-step guides for common maintenance tasks',
    icon: Wrench,
    href: '/resources/maintenance/guides',
    gradient: 'from-blue-500 to-blue-600',
    statsKey: 'total_guides',
  },
  {
    title: 'Maintenance Schedules',
    description: 'Keep your vehicle running smoothly with regular maintenance',
    icon: Calendar,
    href: '/resources/maintenance/schedules',
    gradient: 'from-purple-500 to-purple-600',
    statsKey: 'total_schedules',
  },
  {
    title: 'Fluid Guides',
    description: 'Everything you need to know about vehicle fluids',
    icon: Droplets,
    href: '/resources/maintenance/fluids',
    gradient: 'from-cyan-500 to-cyan-600',
    statsKey: 'total_fluids',
  },
  {
    title: 'Dashboard Warning Lights',
    description: 'Understand what those dashboard lights mean',
    icon: AlertCircle,
    href: '/resources/maintenance/warning-lights',
    gradient: 'from-orange-500 to-orange-600',
    statsKey: 'total_warning_lights',
  },
  {
    title: 'Seasonal Checklists',
    description: 'Prepare your vehicle for every season',
    icon: CheckCircle,
    href: '/resources/maintenance/seasonal',
    gradient: 'from-green-500 to-green-600',
    statsKey: 'total_seasonal_checklists',
  },
];

function CategoryCard({ category, count, index }: any) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full" // Ensures the motion.div takes full height of grid cell
    >
      <Link
        href={category.href}
        className="flex flex-col h-[280px] bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
      >
        {/* Icon Container - Fixed height */}
        <div className="flex-shrink-0 mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content Container - Flexible */}
        <div className="flex-1 flex flex-col">
          {/* Title - Fixed height with line clamping */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
            {category.title}
          </h3>

          {/* Description - Fixed height with line clamping */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[3rem] flex-1">
            {category.description}
          </p>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between flex-shrink-0 mt-auto">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {count} Resources
          </span>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-2 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function MaintenanceIndex({
  stats,
  popularGuides,
  criticalFluids,
  commonWarningLights
}: MaintenanceIndexProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Maintenance Resources - DriveAssist" />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Maintenance Resources
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                Keep your vehicle running smoothly with our comprehensive maintenance guides,
                schedules, and tips.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Object.values(stats).reduce((a, b) => a + b, 0)}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Resources</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    100%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free Access</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
                </div>
              </div>
            </motion.div>

            {/* Categories Grid - FIXED HEIGHT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.title}
                  category={category}
                  count={stats[category.statsKey as keyof typeof stats]}
                  index={index}
                />
              ))}
            </div>

            {/* Popular Guides Section */}
            {popularGuides && popularGuides.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 mb-8">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Popular Guides
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {popularGuides.map((guide, index) => (
                    <Link
                      key={guide.id}
                      href={`/resources/maintenance/guides/${guide.slug}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                          {guide.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{guide.formatted_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{guide.view_count.toLocaleString()} views</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {guide.difficulty}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/resources/maintenance/guides"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View All Guides
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Critical Fluids Section */}
            {criticalFluids && criticalFluids.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 mb-8">
                  <Droplets className="w-6 h-6 text-cyan-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Critical Fluids to Monitor
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {criticalFluids.map((fluid, index) => (
                    <Link
                      key={fluid.id}
                      href={`/resources/maintenance/fluids/${fluid.slug}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl">{fluid.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                              {fluid.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {fluid.description}
                            </p>
                          </div>
                        </div>

                        {fluid.is_critical && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                            ⚠️ Critical
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/resources/maintenance/fluids"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
                  >
                    View All Fluid Guides
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Common Warning Lights Section */}
            {commonWarningLights && commonWarningLights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 mb-8">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Common Warning Lights
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commonWarningLights.map((light, index) => (
                    <Link
                      key={light.id}
                      href={`/resources/maintenance/warning-lights/${light.slug}`}
                      className="group"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all text-center"
                      >
                        <div className="text-5xl mb-4">{light.icon}</div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2">
                          {light.name}
                        </h3>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                          ${light.severity === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                            light.severity === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          }`}
                        >
                          {light.severity}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/resources/maintenance/warning-lights"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    View All Warning Lights
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Need Help with Your Vehicle?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Use our AI-powered diagnostic tool to identify issues instantly, or connect with
                verified local experts for professional help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/diagnose"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Wrench className="w-5 h-5" />
                  Diagnose Issue
                </Link>
                <Link
                  href="/experts"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold inline-flex items-center justify-center gap-2"
                >
                  Find Expert
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}