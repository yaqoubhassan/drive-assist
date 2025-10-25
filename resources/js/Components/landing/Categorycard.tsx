import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export default function CategoryCard({
  icon: Icon,
  title,
  description,
  href,
}: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors"
        >
          <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>

        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {description}
        </p>

        <Link
          href={href}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center group-hover:gap-2 transition-all"
        >
          Diagnose Now
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}