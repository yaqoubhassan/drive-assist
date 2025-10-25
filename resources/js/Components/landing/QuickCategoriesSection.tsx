import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Wrench, AlertCircle, Zap, Cog, Disc, Search } from 'lucide-react';
import CategoryCard from './Categorycard';

export default function QuickCategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const categories = [
    {
      icon: Wrench,
      title: 'Engine Problems',
      description: 'Strange noises, check engine light, poor performance',
      href: '/diagnose?category=engine',
    },
    {
      icon: AlertCircle,
      title: 'Brake Issues',
      description: 'Squeaking, grinding, soft pedal, vibration',
      href: '/diagnose?category=brakes',
    },
    {
      icon: Zap,
      title: 'Electrical Faults',
      description: 'Battery issues, lights not working, dead battery',
      href: '/diagnose?category=electrical',
    },
    {
      icon: Cog,
      title: 'Transmission Issues',
      description: 'Hard shifting, slipping, unusual sounds',
      href: '/diagnose?category=transmission',
    },
    {
      icon: Disc,
      title: 'Tire & Wheel Problems',
      description: 'Punctures, alignment, uneven wear, vibration',
      href: '/diagnose?category=tires',
    },
    {
      icon: Search,
      title: 'Not Sure / Other',
      description: 'Describe your issue and let AI help identify it',
      href: '/diagnose?category=other',
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
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What's Wrong with Your Car?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select a category to quickly diagnose your vehicle issue
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}