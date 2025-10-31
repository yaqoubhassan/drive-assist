import { motion } from 'framer-motion';
import { SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="relative mb-10 sm:mb-12">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 -top-32 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative text-center"
      >
        {/* Logo/Icon with Badge */}
        <div className="inline-flex items-center justify-center mb-5 relative">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-blue-500/40 rounded-2xl blur-2xl" />

            {/* Main icon container */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            {/* Verified Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-3 sm:ring-4 ring-white dark:ring-gray-900"
            >
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 px-4"
        >
          <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
            Welcome to DriveAssist
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
        >
          Complete your expert profile to start connecting with customers
        </motion.p>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="max-w-lg mx-auto px-4"
        >
          {/* Step Counter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-full shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <div className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            {/* Background track */}
            <div className="relative h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full overflow-hidden shadow-inner">
              {/* Progress fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-full shadow-md"
              >
                {/* Subtle shine effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 0.5,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ width: '50%' }}
                />
              </motion.div>
            </div>

            {/* Step Milestone Dots */}
            <div className="absolute inset-0 flex items-center justify-between px-0">
              {[...Array(totalSteps)].map((_, index) => {
                const stepNumber = index + 1;
                const isPassed = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;

                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    className="relative flex items-center justify-center"
                    style={{
                      marginLeft: index === 0 ? '0' : 'auto',
                      marginRight: index === totalSteps - 1 ? '0' : 'auto'
                    }}
                  >
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isPassed
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-md scale-100'
                        : isCurrent
                          ? 'bg-white dark:bg-gray-900 border-blue-600 dark:border-blue-500 shadow-lg scale-110 ring-4 ring-blue-100 dark:ring-blue-900/50'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm scale-90'
                        }`}
                    >
                      {isPassed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isCurrent && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Takes 5-10 minutes</span>
            <span className="hidden sm:inline">•</span>
            <span>Auto-saved progress</span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}