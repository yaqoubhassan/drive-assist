import { Head, Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  BookOpen,
  Wrench,
  Calendar,
  GraduationCap,
  Zap,
  Bike,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface ResourceCategory {
  icon: any;
  title: string;
  description: string;
  href: string;
  color: string;
  stats?: string;
  features: string[];
}

export default function ResourcesIndex() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const categories: ResourceCategory[] = [
    {
      icon: Shield,
      title: 'Road Signs Guide',
      description:
        'Master road signs with our interactive database. Search, learn, and test your knowledge with quizzes.',
      href: '/resources/road-signs',
      color: 'blue',
      stats: '150+ Signs',
      features: ['Interactive Database', 'Category Filters', 'Knowledge Quiz', 'Detailed Meanings'],
    },
    {
      icon: Wrench,
      title: 'Common Car Issues',
      description:
        'Comprehensive library of the most common vehicle problems, their causes, and solutions.',
      href: '/resources/car-issues',
      color: 'red',
      stats: '100+ Issues',
      features: ['Problem Symptoms', 'DIY Solutions', 'Cost Estimates', 'Expert Tips'],
    },
    {
      icon: Calendar,
      title: 'Maintenance Guides',
      description:
        'Seasonal checklists and maintenance schedules to keep your vehicle running smoothly.',
      href: '/resources/maintenance',
      color: 'green',
      stats: '50+ Guides',
      features: ['Seasonal Checklists', 'Maintenance Schedule', 'Fluid Guides', 'Warning Lights'],
    },
    {
      icon: GraduationCap,
      title: 'Driving Tips',
      description:
        "Learn essential driving skills, from beginner basics to advanced defensive techniques.",
      href: '/resources/driving-tips',
      color: 'purple',
      stats: '75+ Tips',
      features: ['Beginner Guides', 'Defensive Driving', 'Fuel Efficiency', 'Weather Tips'],
    },
    {
      icon: Zap,
      title: 'Electric Vehicles',
      description:
        'Everything you need to know about EVs - from buying guides to charging infrastructure.',
      href: '/resources/electric-vehicles',
      color: 'amber',
      stats: '40+ Articles',
      features: ['Buying Guide', 'Charging Info', 'Cost Calculator', 'Model Comparison'],
    },
    {
      icon: Bike,
      title: 'E-Bikes & Scooters',
      description:
        'Comprehensive guides on electric bikes and alternative transportation options.',
      href: '/resources/e-bikes',
      color: 'emerald',
      stats: '30+ Guides',
      features: ['Types Explained', 'Safety Tips', 'Maintenance', 'Legal Requirements'],
    },
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'Always Free',
      description: 'All educational content is completely free, forever.',
    },
    {
      icon: TrendingUp,
      title: 'Expert Verified',
      description: 'Content reviewed and approved by certified mechanics.',
    },
    {
      icon: BookOpen,
      title: 'Regularly Updated',
      description: 'New content added weekly based on user feedback.',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <ThemeProvider>
      <Head title="Resources - Learn About Cars & Driving" />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
                className="absolute inset-0"
              />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Your Complete{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Automotive Resource Hub
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                  Master car maintenance, learn road signs, understand common issues, and become a
                  confident driver with our comprehensive guides.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      400+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Free Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      50K+
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Readers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                      100%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expert Verified</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Explore Our Resources
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Choose a category to start learning. All content is free and regularly updated.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate={isInView ? 'animate' : 'initial'}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {categories.map((category, index) => (
                  <CategoryCard key={index} category={category} index={index} />
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                    radial-gradient(circle at 80% 50%, white 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  backgroundPosition: '0 0, 20px 20px',
                }}
              />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Need Help With a Car Issue?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Get instant AI-powered diagnosis or connect with verified local experts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/diagnose"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Diagnose Issue
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    href="/experts"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                  >
                    Find Expert
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

function CategoryCard({ category, index }: { category: ResourceCategory; index: number }) {
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  };

  return (
    <motion.div variants={itemVariants}>
      <Link href={category.href}>
        <motion.div
          whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all h-full group cursor-pointer"
        >
          {/* Icon & Stats */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClasses[category.color]
                }`}
            >
              <category.icon className="w-7 h-7" />
            </motion.div>
            {category.stats && (
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {category.stats}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
            {category.description}
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-4">
            {category.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Link */}
          <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
            Explore
            <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}