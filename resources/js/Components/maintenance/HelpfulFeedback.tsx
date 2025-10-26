import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from 'axios';

interface HelpfulFeedbackProps {
  resourceType: 'guide' | 'schedule' | 'fluid' | 'warning-light' | 'checklist';
  resourceId: number;
  helpfulCount: number;
  className?: string;
}

export default function HelpfulFeedback({
  resourceType,
  resourceId,
  helpfulCount,
  className = '',
}: HelpfulFeedbackProps) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [currentCount, setCurrentCount] = useState(helpfulCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (helpful: boolean) => {
    if (isSubmitting || isHelpful !== null) return;

    setIsSubmitting(true);
    try {
      const endpoint = `/api/maintenance/${resourceType}s/${resourceId}/helpful`;
      await axios.post(endpoint, { helpful });

      setIsHelpful(helpful);
      if (helpful) {
        setCurrentCount(currentCount + 1);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          {isHelpful === true && (
            <span className="text-xs">({currentCount})</span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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

      {isHelpful === true && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-green-600 dark:text-green-400 font-medium"
        >
          Thank you for your feedback!
        </motion.span>
      )}

      {isHelpful === false && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Thanks for letting us know.
        </motion.span>
      )}
    </div>
  );
}