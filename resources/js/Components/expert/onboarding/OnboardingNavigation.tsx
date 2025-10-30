import {
  BookmarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon as CheckCircleSolid,
} from '@heroicons/react/24/solid';

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

  return (
    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
      {/* Save & Exit */}
      <button
        type="button"
        onClick={onSaveAndExit}
        disabled={processing}
        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BookmarkIcon className="w-5 h-5 mr-2" />
        Save & Exit
      </button>

      <div className="flex-1" />

      {/* Previous Button */}
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          disabled={processing}
          className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Previous
        </button>
      )}

      {/* Next / Submit Button */}
      {isFinalStep ? (
        <button
          type="submit"
          disabled={
            processing ||
            !isStepComplete(1) ||
            !isStepComplete(2) ||
            !isStepComplete(3)
          }
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center disabled:cursor-not-allowed"
        >
          {processing ? 'Submitting...' : 'Complete Profile'}
          <CheckCircleSolid className="w-5 h-5 ml-2" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || processing}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center disabled:cursor-not-allowed"
        >
          Next
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </button>
      )}
    </div>
  );
}