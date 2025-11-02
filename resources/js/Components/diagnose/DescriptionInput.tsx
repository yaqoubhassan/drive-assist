import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minLength?: number;
  maxLength?: number;
}

export default function DescriptionInput({
  value = '',
  onChange,
  error,
  minLength = 20,
  maxLength = 700,
}: DescriptionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = value.length;
  const isValid = charCount >= minLength && charCount <= maxLength;
  const isTooShort = charCount > 0 && charCount < minLength;
  const isTooLong = charCount > maxLength;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Calculate progress percentage
  const progressPercentage = Math.min((charCount / minLength) * 100, 100);

  // Determine color based on status
  const getProgressColor = () => {
    if (isTooLong) return 'bg-red-600';
    if (isValid) return 'bg-green-600';
    if (isTooShort) return 'bg-yellow-600';
    return 'bg-gray-300 dark:bg-gray-600';
  };

  const getTextColor = () => {
    if (isTooLong) return 'text-red-600 dark:text-red-400';
    if (isValid) return 'text-green-600 dark:text-green-400';
    if (isTooShort) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe what's happening with your vehicle in detail. For example: 'My car makes a squeaking noise when I brake, especially when slowing down from high speeds...'"
          rows={4}
          className={`
            w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-2
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            ${error || isTooLong
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
              : isValid
                ? 'border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />

        {/* Icon */}
        <div className="absolute left-4 top-4">
          <MessageSquare className={`w-5 h-5 ${getTextColor()}`} />
        </div>

        {/* Status Indicator */}
        <AnimatePresence>
          {charCount >= minLength && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute right-4 top-4"
            >
              {isTooLong ? (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Character Counter & Progress */}
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getProgressColor()} transition-colors duration-200`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((charCount / maxLength) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Counter Text */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {isTooShort && charCount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-yellow-600 dark:text-yellow-400 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {minLength - charCount} more characters needed
              </motion.span>
            )}
            {isValid && !isTooLong && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-600 dark:text-green-400 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Looks good!
              </motion.span>
            )}
            {isTooLong && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-600 dark:text-red-400 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {charCount - maxLength} characters over limit
              </motion.span>
            )}
          </div>

          <span className={getTextColor()}>
            {charCount} / {maxLength}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}

      {/* Helpful Tips */}
      {charCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for better diagnosis:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• When does the problem occur? (e.g., when starting, while driving, when braking)</li>
            <li>• What sounds do you hear? (e.g., squeaking, grinding, clicking)</li>
            <li>• Any warning lights on the dashboard?</li>
            <li>• How long has this been happening?</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}