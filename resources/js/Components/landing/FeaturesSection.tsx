import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Brain,
  Shield,
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
} from 'lucide-react';

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Diagnostics',
      description:
        'Upload photos of your issue and get instant AI analysis. Understand the problem clearly and know if it\'s safe to drive.',
      benefits: [
        'Upload photos',
        'Instant analysis',
        'Cost estimates',
        'Safety check',
      ],
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Verified Expert Network',
      description:
        'All our experts are background-checked, licensed, and insured. Read real customer reviews and compare quotes.',
      benefits: [
        'Background checked',
        'Licensed & insured',
        'Real reviews',
        'Compare quotes',
      ],
      color: 'green',
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description:
        'Learn basic car maintenance, understand warning lights, and access our comprehensive road sign database.',
      benefits: [
        'Maintenance guides',
        'Warning lights',
        'Road signs',
        'Driving tips',
      ],
      color: 'purple',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description:
        'Diagnose issues anytime, save your history, track repairs, and get maintenance reminders.',
      benefits: [
        'Anytime access',
        'Save history',
        'Track repairs',
        'Reminders',
      ],
      color: 'amber',
    },
    {
      icon: DollarSign,
      title: 'No Hidden Fees',
      description:
        'Free diagnostics with transparent pricing. Only pay if you choose to hire an expert. No subscriptions required.',
      benefits: [
        'Free diagnostics',
        'Transparent pricing',
        'No subscription',
        'Pay per service',
      ],
      color: 'emerald',
    },
    {
      icon: CheckCircle,
      title: 'Quality Guaranteed',
      description:
        'All work is backed by our satisfaction guarantee. Rate your experience and help others find great mechanics.',
      benefits: [
        'Satisfaction guarantee',
        'Quality work',
        'Rate & review',
        'Support team',
      ],
      color: 'pink',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      id="features"
      className="py-20 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Stay Safe on the Road
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive tools and resources to keep your vehicle running smoothly
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-14 h-14 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-6`}
              >
                <feature.icon
                  className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`}
                />
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}