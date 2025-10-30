import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
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
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.number
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : isStepComplete(step.number)
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
              >
                {isStepComplete(step.number) ? (
                  <CheckCircleSolid className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${currentStep === step.number || isStepComplete(step.number)
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400'
                    }`}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-8 ${isStepComplete(step.number) ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}