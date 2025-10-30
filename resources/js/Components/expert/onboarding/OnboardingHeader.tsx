import { motion } from 'framer-motion';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
        <WrenchScrewdriverIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Complete Your Expert Profile
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Step {currentStep} of {totalSteps} • You can save and continue later
      </p>
    </motion.div>
  );
}