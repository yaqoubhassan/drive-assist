import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import ExpertLayout from '@/Layouts/ExpertLayout';
import { motion, AnimatePresence } from 'framer-motion';
import KycStep1BusinessDocuments from '@/Components/expert/kyc/KycStep1BusinessDocuments';
import KycStep2Identity from '@/Components/expert/kyc/KycStep2Identity';
import KycStep3Insurance from '@/Components/expert/kyc/KycStep3Insurance';
import KycStep4Banking from '@/Components/expert/kyc/KycStep4Banking';
import KycStep5BackgroundCheck from '@/Components/expert/kyc/KycStep5BackgroundCheck';
import KycStep6Review from '@/Components/expert/kyc/KycStep6Review';
import KycStatusBanner from '@/Components/expert/kyc/KycStatusBanner';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
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
  bank_name: string | null;
  account_holder_name: string | null;
  account_number_masked: string | null;
  routing_number: string | null;
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
  { number: 1, name: 'Business Documents', icon: DocumentTextIcon },
  { number: 2, name: 'Identity Verification', icon: IdentificationIcon },
  { number: 3, name: 'Insurance', icon: ShieldCheckIcon },
  { number: 4, name: 'Banking', icon: BanknotesIcon },
  { number: 5, name: 'Background Check', icon: ClipboardDocumentCheckIcon },
  { number: 6, name: 'Review & Submit', icon: CheckCircleIcon },
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

  const goToStep = (step: number) => {
    // Don't allow jumping ahead
    if (step > currentStep + 1) return;
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 6) {
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
    };

    switch (currentStep) {
      case 1:
        return <KycStep1BusinessDocuments {...stepProps} />;
      case 2:
        return <KycStep2Identity {...stepProps} />;
      case 3:
        return <KycStep3Insurance {...stepProps} />;
      case 4:
        return <KycStep4Banking {...stepProps} />;
      case 5:
        return <KycStep5BackgroundCheck {...stepProps} />;
      case 6:
        return <KycStep6Review {...stepProps} kycData={kycData} />;
      default:
        return null;
    }
  };

  return (
    <ExpertLayout>
      <Head title="KYC Verification" />

      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status Banner */}
          <KycStatusBanner kyc={kycData} />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              KYC Verification
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete your verification to unlock all features and start receiving leads
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {kycData.completion_percentage}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${kycData.completion_percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Indicator */}
          <nav className="mb-8">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                const Icon = step.icon;

                return (
                  <li key={step.number} className="relative flex-1">
                    {/* Connector Line */}
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${isCompleted
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      />
                    )}

                    {/* Step Button */}
                    <button
                      onClick={() => goToStep(step.number)}
                      disabled={step.number > currentStep + 1}
                      className="relative flex flex-col items-center group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : isCurrent
                            ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900'
                            : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium text-center hidden sm:block ${isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                          }`}
                      >
                        {step.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Auto-save Indicator */}
          {isSaving && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
}