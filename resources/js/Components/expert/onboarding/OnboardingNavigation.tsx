import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BookmarkIcon,
} from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  processing: boolean;
  isStepComplete: (step: number) => boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveAndExit: () => void;
}

export default function OnboardingNavigation({
  currentStep,
  totalSteps,
  processing,
  isStepComplete,
  onPrevious,
  onNext,
  onSaveAndExit,
}: OnboardingNavigationProps) {
  const isFinalStep = currentStep === totalSteps;
  const canProceed = isStepComplete(currentStep);
  const allRequiredStepsComplete =
    isStepComplete(1) && isStepComplete(2) && isStepComplete(3);

  return (
    <div className="mt-8 pt-8 border-t-2 border-gray-100 dark:border-gray-800">
      {/* Navigation Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Save & Exit - Left Side (Desktop) / Top (Mobile) */}
        <motion.button
          type="button"
          onClick={onSaveAndExit}
          disabled={processing}
          whileHover={{ scale: processing ? 1 : 1.02 }}
          whileTap={{ scale: processing ? 1 : 0.98 }}
          className="group relative px-5 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
        >
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center justify-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
            <span>Save Progress</span>
          </div>
        </motion.button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Navigation Buttons Container */}
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={onPrevious}
              disabled={processing}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: processing ? 1 : 1.02 }}
              whileTap={{ scale: processing ? 1 : 0.98 }}
              className="group relative px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex items-center gap-2">
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Back</span>
              </div>
            </motion.button>
          )}

          {/* Next / Complete Button */}
          {isFinalStep ? (
            <motion.button
              type="submit"
              disabled={processing || !allRequiredStepsComplete}
              whileHover={{ scale: processing || !allRequiredStepsComplete ? 1 : 1.02 }}
              whileTap={{ scale: processing || !allRequiredStepsComplete ? 1 : 0.98 }}
              className="group relative px-8 py-3 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 transition-all overflow-hidden"
            >
              {/* Shine effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />

              <div className="relative flex items-center justify-center gap-2">
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <SparklesIcon className="w-5 h-5" />
                    </motion.div>
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Complete Profile</span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xl"
                    >
                      🎉
                    </motion.span>
                  </>
                )}
              </div>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={onNext}
              disabled={!canProceed || processing}
              whileHover={{ scale: !canProceed || processing ? 1 : 1.02 }}
              whileTap={{ scale: !canProceed || processing ? 1 : 0.98 }}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 transition-all overflow-hidden"
            >
              {/* Shine effect */}
              {canProceed && !processing && (
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              )}

              <div className="relative flex items-center justify-center gap-2">
                <span>Continue</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-1"
      >
        {/* Required Fields Notice */}
        {!canProceed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <svg
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Please complete all required fields to continue
            </p>
          </motion.div>
        )}

        {/* Support Link */}
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Need help?{' '}
          <a
            href="mailto:support@driveassist.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
}