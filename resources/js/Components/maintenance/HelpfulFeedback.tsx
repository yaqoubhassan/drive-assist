import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

interface HelpfulFeedbackProps {
  resourceType: 'guide' | 'schedule' | 'fluid' | 'warning-light' | 'checklist';
  resourceSlug: string;
  helpfulCount: number;
  className?: string;
}

export default function HelpfulFeedback({
  resourceType,
  resourceSlug,
  helpfulCount,
  className = '',
}: HelpfulFeedbackProps) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [currentCount, setCurrentCount] = useState(helpfulCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map resource types to their proper route paths
  const getEndpoint = (type: string, slug: string): string => {
    const routes: Record<string, string> = {
      guide: `/resources/maintenance/guides/${slug}/feedback`,
      schedule: `/resources/maintenance/schedules/${slug}/feedback`,
      fluid: `/resources/maintenance/fluids/${slug}/feedback`,
      'warning-light': `/resources/maintenance/warning-lights/${slug}/feedback`,
      checklist: `/resources/maintenance/seasonal/${slug}/feedback`,
    };
    return routes[type];
  };

  // Get CSRF token from meta tag
  const getCsrfToken = (): string => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token || '';
  };

  const handleFeedback = async (helpful: boolean) => {
    if (isSubmitting || isHelpful !== null) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const endpoint = getEndpoint(resourceType, resourceSlug);
      const csrfToken = getCsrfToken();

      console.log('🔄 Submitting feedback to:', endpoint);
      console.log('📝 Data:', { is_helpful: helpful, comment: null });

      // Use the correct parameter name expected by backend
      const response = await axios.post(endpoint, {
        is_helpful: helpful,
        comment: null, // Optional comment field
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('✅ Success response:', response.data);

      setIsHelpful(helpful);
      if (helpful) {
        setCurrentCount(response.data.helpful_count || currentCount + 1);
      }
    } catch (error: any) {
      console.error('❌ Error submitting feedback:', error);
      console.error('📋 Error response:', error.response?.data);

      // Handle already voted error gracefully
      if (error.response?.status === 422) {
        const errorData = error.response.data;

        // Check if it's an "already voted" error
        if (errorData.already_voted) {
          setErrorMessage('You have already provided feedback for this resource');
          setIsHelpful(true); // Assume they voted yes before
        } else if (errorData.errors) {
          // Validation errors
          const firstError = Object.values(errorData.errors)[0];
          setErrorMessage(Array.isArray(firstError) ? firstError[0] : 'Validation error occurred');
        } else if (errorData.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage('Unable to submit feedback. Please try again.');
        }
      } else if (error.response?.status === 419) {
        // CSRF token mismatch
        setErrorMessage('Session expired. Please refresh the page and try again.');
      } else {
        setErrorMessage('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: isHelpful === null ? 1.05 : 1 }}
            whileTap={{ scale: isHelpful === null ? 0.95 : 1 }}
            onClick={() => handleFeedback(true)}
            disabled={isHelpful !== null || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all ${isHelpful === true
              ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-700 dark:text-green-300'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${isHelpful !== null ? 'cursor-not-allowed opacity-75' : ''}`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful === true ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {isHelpful === true ? 'Helpful' : 'Yes'}
            </span>
            {currentCount > 0 && (
              <span className="text-xs ml-1">({currentCount})</span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: isHelpful === null ? 1.05 : 1 }}
            whileTap={{ scale: isHelpful === null ? 0.95 : 1 }}
            onClick={() => handleFeedback(false)}
            disabled={isHelpful !== null || isSubmitting}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all ${isHelpful === false
              ? 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${isHelpful !== null ? 'cursor-not-allowed opacity-75' : ''}`}
          >
            <ThumbsDown className={`w-4 h-4 ${isHelpful === false ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {isHelpful === false ? 'Not Helpful' : 'No'}
            </span>
          </motion.button>
        </div>

        {isHelpful === true && !errorMessage && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-green-600 dark:text-green-400 font-medium"
          >
            Thank you for your feedback!
          </motion.span>
        )}

        {isHelpful === false && !errorMessage && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Thanks for letting us know.
          </motion.span>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800"
        >
          <span className="text-lg">ℹ️</span>
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Submitting State */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Submitting your feedback...</span>
        </motion.div>
      )}
    </div>
  );
}