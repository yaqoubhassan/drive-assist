import { motion } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  /**
   * The route to navigate back to
   * If not provided, will use browser history back
   */
  href?: string;

  /**
   * Label text for the button
   * @default "Back"
   */
  label?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show icon before text
   * @default true
   */
  showIcon?: boolean;

  /**
   * Variant style
   * @default "default"
   */
  variant?: 'default' | 'minimal' | 'pill';
}

export function BackButton({
  href,
  label = 'Back',
  className = '',
  showIcon = true,
  variant = 'default'
}: BackButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';

  const variantClasses = {
    default: 'px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md',
    minimal: 'px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
    pill: 'px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full shadow-md hover:shadow-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.visit(window.history.state?.url || '/', {
        method: 'get',
        preserveScroll: false,
      });
    }
  };

  const content = (
    <>
      {showIcon && (
        <motion.div
          whileHover={{ x: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </motion.div>
      )}
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={combinedClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
}