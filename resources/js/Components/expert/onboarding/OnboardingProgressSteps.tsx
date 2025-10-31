import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import type { Step } from '../../../types/expert-onboarding';

interface OnboardingProgressStepsProps {
  steps: Step[];
  currentStep: number;
  isStepComplete: (step: number) => boolean;
}

export default function OnboardingProgressSteps({
  steps,
  currentStep,
  isStepComplete,
}: OnboardingProgressStepsProps) {
  return (
    <div className="mb-10">
      {/* Desktop View - Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => {
            const isComplete = isStepComplete(step.number);
            const isCurrent = currentStep === step.number;
            const isPast = currentStep > step.number;
            const isFuture = currentStep < step.number;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 -z-10">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{
                          width: isPast || isComplete ? '100%' : '0%',
                        }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Step Circle Container */}
                <motion.div
                  whileHover={{ scale: isCurrent ? 1.05 : 1 }}
                  className="relative mb-4 group"
                >
                  {/* Glow effect for current step */}
                  {isCurrent && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCurrent
                        ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/50'
                        : isComplete
                          ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-xl'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md'
                      }
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {isComplete ? (
                        <motion.div
                          key="complete"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <CheckIcon className="w-5 h-5 text-green-600" />
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                        >
                          <step.icon
                            className={`w-7 h-7 transition-colors ${isCurrent
                              ? 'text-white'
                              : isFuture
                                ? 'text-gray-400 dark:text-gray-500'
                                : 'text-gray-600 dark:text-gray-300'
                              }`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step Number Badge (for future steps) */}
                  {isFuture && !isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                    >
                      {step.number}
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="text-center px-2">
                  <motion.p
                    animate={{
                      fontWeight: isCurrent ? 700 : 500,
                      scale: isCurrent ? 1.05 : 1,
                    }}
                    className={`text-sm md:text-base mb-1 transition-colors ${isCurrent
                      ? 'text-blue-700 dark:text-blue-400'
                      : isComplete
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    {step.title}
                  </motion.p>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-1">
                    {isComplete && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1"
                      >
                        <CheckIcon className="w-3 h-3" />
                        Complete
                      </motion.span>
                    )}
                    {isCurrent && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs text-blue-600 dark:text-blue-400 font-medium"
                      >
                        In Progress
                      </motion.span>
                    )}
                    {isFuture && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile View - Vertical Compact */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isComplete = isStepComplete(step.number);
          const isCurrent = currentStep === step.number;
          const isPast = currentStep > step.number;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                ${isCurrent
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-lg'
                  : isComplete
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {/* Step Icon */}
              <div
                className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${isCurrent
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'
                    : isComplete
                      ? 'bg-gradient-to-br from-green-500 to-green-600'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                  }
                `}
              >
                {isComplete ? (
                  <CheckIcon className="w-6 h-6 text-white" />
                ) : (
                  <step.icon
                    className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}
                  />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-base font-semibold ${isCurrent
                      ? 'text-blue-700 dark:text-blue-300'
                      : isComplete
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {step.title}
                  </p>

                  {/* Status Badge */}
                  {isComplete && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full animate-pulse">
                      Current
                    </span>
                  )}
                </div>

                {/* Step Number */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Step {step.number} of {steps.length}
                </p>
              </div>

              {/* Connector Line (mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute left-10 top-full w-0.5 h-4 bg-gray-300 dark:bg-gray-600 -mb-4" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}