import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {step.number < currentStep ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${step.number <= currentStep
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative" style={{ top: '-35px' }}>
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded" />
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: step.number < currentStep ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-green-500 rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-6">
          {/* Current Step Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {currentStep}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {steps[currentStep - 1].title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Step Counter */}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {currentStep} / {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="bg-blue-600 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}