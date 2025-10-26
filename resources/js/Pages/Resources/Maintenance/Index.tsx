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
    >
      <Link
        href={category.href}
        className="block bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
      >
        <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {category.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
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

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Popular Guides
                    </h2>
                  </div>
                  <Link
                    href="/resources/maintenance/guides"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularGuides.map((guide, index) => (
                    <motion.div
                      key={guide.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/resources/maintenance/guides/${guide.slug}`}
                        className="block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${guide.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : guide.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}>
                            {guide.difficulty}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{guide.view_count}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {guide.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{guide.formatted_time}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Critical Fluids Section */}
            {criticalFluids && criticalFluids.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Critical Fluids to Check
                    </h2>
                  </div>
                  <Link
                    href="/resources/maintenance/fluids"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                  >
                    View All Fluids
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {criticalFluids.map((fluid, index) => (
                    <motion.div
                      key={fluid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/resources/maintenance/fluids/${fluid.slug}`}
                        className="block bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all group"
                      >
                        <div className="text-4xl mb-3">{fluid.icon}</div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {fluid.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {fluid.description}
                        </p>
                        {fluid.is_critical && (
                          <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            Critical
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Common Warning Lights Section */}
            {commonWarningLights && commonWarningLights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Common Warning Lights
                    </h2>
                  </div>
                  <Link
                    href="/resources/maintenance/warning-lights"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                  >
                    View All Lights
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {commonWarningLights.map((light, index) => (
                    <motion.div
                      key={light.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/resources/maintenance/warning-lights/${light.slug}`}
                        className="block bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group text-center"
                      >
                        <div className="text-3xl mb-2">{light.icon}</div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                          {light.name}
                        </h3>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${light.severity === 'critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : light.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                          {light.severity}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Why Use Our Maintenance Resources?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Easy to Follow
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Step-by-step guides with clear instructions and helpful visuals
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Save Money
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Learn to perform basic maintenance yourself and avoid costly repairs
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Stay Safe
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Prevent breakdowns and keep your vehicle in optimal condition
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}