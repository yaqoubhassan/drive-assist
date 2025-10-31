import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import ExpertLayout from '@/Layouts/Expertdashboardlayout';
import { motion, AnimatePresence } from 'framer-motion';
import KycStep1BusinessDocuments from '@/Components/expert/kyc/KycStep1BusinessDocuments';
import KycStep2Identity from '@/Components/expert/kyc/KycStep2Identity';
import KycStep3Insurance from '@/Components/expert/kyc/Kycstep3Insurance';
import KycStep4BackgroundCheck from '@/Components/expert/kyc/KycStep4BackgroundCheck';
import KycStep5Review from '@/Components/expert/kyc/KycStep5Review';
import KycStatusBanner from '@/Components/expert/kyc/KycStatusBanner';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface KycData {
  id: number;
  business_license_number: string | null;
  business_license_document_url: string | null;
  business_license_expiry: string | null;
  insurance_policy_number: string | null;
  insurance_certificate_url: string | null;
  insurance_expiry: string | null;
  insurance_provider: string | null;
  id_type: string | null;
  id_number: string | null;
  id_document_front_url: string | null;
  id_document_back_url: string | null;
  background_check_consent: boolean;
  criminal_record_disclosure: string | null;
  criminal_record_details: string | null;
  utility_bill_url: string | null;
  certifications: any[];
  professional_references: any[];
  kyc_status: string;
  kyc_status_label: string;
  status_badge_color: string;
  completion_percentage: number;
  current_step: number;
  is_approved: boolean;
  is_pending_review: boolean;
  is_rejected: boolean;
  needs_resubmission: boolean;
  rejection_reason: string | null;
}

interface Props {
  kyc: KycData;
  expertProfile: {
    id: number;
    business_name: string;
    verification_status: string;
  };
}

const steps = [
  { number: 1, name: 'Business Documents', shortName: 'Business', icon: DocumentTextIcon },
  { number: 2, name: 'Identity Verification', shortName: 'Identity', icon: IdentificationIcon },
  { number: 3, name: 'Insurance', shortName: 'Insurance', icon: ShieldCheckIcon },
  { number: 4, name: 'Background Check', shortName: 'Background', icon: ClipboardDocumentCheckIcon },
  { number: 5, name: 'Review & Submit', shortName: 'Review', icon: CheckCircleIcon },
];

export default function Index({ kyc, expertProfile }: Props) {
  const [currentStep, setCurrentStep] = useState(kyc.current_step || 1);
  const [kycData, setKycData] = useState(kyc);
  const [isSaving, setIsSaving] = useState(false);

  // Update kycData when kyc prop changes
  useEffect(() => {
    setKycData(kyc);
  }, [kyc]);

  const updateKycData = (newData: Partial<KycData>) => {
    setKycData((prev) => ({ ...prev, ...newData }));
  };

  /**
   * Navigate to a specific step in the KYC process
   * 
   * Rules:
   * - Allows backward navigation to any previous step (for editing)
   * - Prevents forward jumps (users must complete steps in order)
   * - Automatically saves progress when navigating
   * 
   * @param step - The step number to navigate to (1-5)
   */
  const goToStep = (step: number) => {
    // Prevent jumping ahead more than one step
    // This allows backward navigation while enforcing sequential forward progression
    if (step > currentStep + 1) {
      console.log('Cannot jump ahead more than one step. Please complete steps in order.');
      return;
    }

    // Update the current step
    setCurrentStep(step);

    // Automatically save progress when navigating
    // This ensures the backend knows which step the user is on
    saveProgress(step);

    // Smooth scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      saveProgress(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveProgress = async (step?: number) => {
    setIsSaving(true);

    try {
      const response = await fetch(route('expert.kyc.save-progress'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          ...kycData,
          current_step: step || currentStep,
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateKycData(data.kyc);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      data: kycData,
      updateData: updateKycData,
      nextStep,
      previousStep,
      saveProgress,
      goToStep, // Pass goToStep to child components (especially Step 5 Review)
    };

    switch (currentStep) {
      case 1:
        return <KycStep1BusinessDocuments {...stepProps} />;
      case 2:
        return <KycStep2Identity {...stepProps} />;
      case 3:
        return <KycStep3Insurance {...stepProps} />;
      case 4:
        return <KycStep4BackgroundCheck {...stepProps} />;
      case 5:
        return <KycStep5Review {...stepProps} />;
      default:
        return <KycStep1BusinessDocuments {...stepProps} />;
    }
  };

  return (
    <ExpertLayout>
      <Head title="KYC Verification" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Status Banner */}
          <KycStatusBanner kyc={kycData} />

          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  KYC Verification
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Complete your verification to start accepting jobs
                </p>
              </div>

              {/* Progress Badge - Desktop */}
              <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12">
                    <svg className="transform -rotate-90 w-12 h-12">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - kycData.completion_percentage / 100)}`}
                        className="text-blue-600 dark:text-blue-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {kycData.completion_percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Step {currentStep} of 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="sm:hidden mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step {currentStep} of 5
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {kycData.completion_percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${kycData.completion_percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 px-2">
                  Verification Steps
                </h3>
                <nav className="space-y-1">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isAccessible = step.number <= currentStep;

                    return (
                      <button
                        key={step.number}
                        onClick={() => isAccessible && goToStep(step.number)}
                        disabled={!isAccessible}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${isCurrent
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : isCompleted
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            : 'opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : isCurrent
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                        >
                          {isCompleted ? (
                            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 font-bold" strokeWidth={3} />
                          ) : (
                            <Icon
                              className={`w-5 h-5 ${isCurrent
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${isCurrent
                              ? 'text-blue-900 dark:text-blue-100'
                              : isCompleted
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            {step.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {isCompleted ? 'Completed' : isCurrent ? 'In progress' : 'Pending'}
                          </p>
                        </div>
                        {isCurrent && (
                          <div className="flex-shrink-0 w-1.5 h-8 bg-blue-600 dark:bg-blue-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="lg:hidden mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isAccessible = step.number <= currentStep;

                    return (
                      <React.Fragment key={step.number}>
                        <button
                          onClick={() => isAccessible && goToStep(step.number)}
                          disabled={!isAccessible}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                              ? 'bg-green-500 dark:bg-green-600'
                              : isCurrent
                                ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50'
                                : 'bg-gray-200 dark:bg-gray-700'
                              } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                          >
                            {isCompleted ? (
                              <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
                            ) : (
                              <span
                                className={`text-sm sm:text-base font-bold ${isCurrent ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                                  }`}
                              >
                                {step.number}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] leading-tight ${isCurrent
                              ? 'text-blue-600 dark:text-blue-400'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            {step.shortName}
                          </span>
                        </button>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                              initial={{ width: '0%' }}
                              animate={{
                                width: currentStep > step.number ? '100%' : '0%',
                              }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-6 sm:p-8"
                  >
                    {renderStep()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Auto-save Indicator */}
          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed bottom-6 right-6 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
              >
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="font-medium">Saving progress...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ExpertLayout>
  );
}