import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface FormContainerProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  stepNumber?: number;
  progress?: number;
}

/**
 * FormContainer Component
 * 
 * Wrapper for form sections with:
 * - Step indicators
 * - Progress visualization
 * - Consistent spacing
 * - Card-based design
 * - Smooth animations
 */
export default function FormContainer({
  title,
  subtitle,
  stepNumber,
  progress,
  children
}: FormContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        {stepNumber && (
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 flex-shrink-0">
              {stepNumber}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        {!stepNumber && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * FormSection Component
 * 
 * Individual section within a form with proper spacing
 */
export function FormSection({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * FormActions Component
 * 
 * Footer section for form buttons
 */
export function FormActions({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}