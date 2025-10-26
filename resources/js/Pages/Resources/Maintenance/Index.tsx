import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MaintenanceIndexProps } from '@/types/maintenance';
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
} from 'lucide-react';

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

export default function MaintenanceIndex({ stats }: MaintenanceIndexProps) {
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

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Why Use Our Maintenance Resources?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={BookOpen}
                  title="Easy to Follow"
                  description="Step-by-step instructions with clear explanations and helpful tips"
                />
                <FeatureCard
                  icon={Clock}
                  title="Save Time"
                  description="Quick reference guides to help you understand and maintain your vehicle"
                />
                <FeatureCard
                  icon={DollarSign}
                  title="Save Money"
                  description="Learn which tasks you can do yourself and when to call an expert"
                />
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

interface CategoryCardProps {
  category: typeof categories[0];
  count: number;
  index: number;
}

function CategoryCard({ category, count, index }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={category.href}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="group h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all"
        >
          {/* Gradient Header */}
          <div className={`bg-gradient-to-br ${category.gradient} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-white/90">
                {count} {count === 1 ? 'resource' : 'resources'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{category.title}</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {category.description}
            </p>

            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              Explore
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4 ml-1" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}