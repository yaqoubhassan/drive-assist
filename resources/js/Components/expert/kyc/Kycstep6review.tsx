import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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
  completion_percentage: number;
}

interface Props {
  data: KycData;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
  kycData: KycData;
}

export default function KycStep6Review({ data, previousStep, kycData }: Props) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const completionChecklist = [
    {
      step: 1,
      title: 'Business Documents',
      icon: DocumentTextIcon,
      completed: !!(data.business_license_number && data.business_license_document_url),
      items: [
        { label: 'Business License Number', value: data.business_license_number, completed: !!data.business_license_number },
        { label: 'License Document', value: data.business_license_document_url ? 'Uploaded' : null, completed: !!data.business_license_document_url },
        { label: 'Expiry Date', value: data.business_license_expiry, completed: !!data.business_license_expiry },
      ],
    },
    {
      step: 2,
      title: 'Identity Verification',
      icon: IdentificationIcon,
      completed: !!(data.id_type && data.id_number && data.id_document_front_url),
      items: [
        { label: 'ID Type', value: data.id_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), completed: !!data.id_type },
        { label: 'ID Number', value: data.id_number, completed: !!data.id_number },
        { label: 'ID Document (Front)', value: data.id_document_front_url ? 'Uploaded' : null, completed: !!data.id_document_front_url },
        { label: 'ID Document (Back)', value: data.id_document_back_url ? 'Uploaded' : 'Optional', completed: true },
      ],
    },
    {
      step: 3,
      title: 'Insurance Information',
      icon: ShieldCheckIcon,
      completed: !!(data.insurance_policy_number && data.insurance_certificate_url),
      items: [
        { label: 'Policy Number', value: data.insurance_policy_number, completed: !!data.insurance_policy_number },
        { label: 'Provider', value: data.insurance_provider, completed: !!data.insurance_provider },
        { label: 'Expiry Date', value: data.insurance_expiry, completed: !!data.insurance_expiry },
        { label: 'Certificate', value: data.insurance_certificate_url ? 'Uploaded' : null, completed: !!data.insurance_certificate_url },
      ],
    },
    {
      step: 4,
      title: 'Banking Details',
      icon: BanknotesIcon,
      completed: !!(data.bank_name && data.account_holder_name && data.account_number_masked),
      items: [
        { label: 'Bank Name', value: data.bank_name, completed: !!data.bank_name },
        { label: 'Account Holder', value: data.account_holder_name, completed: !!data.account_holder_name },
        { label: 'Account Number', value: data.account_number_masked ? `****${data.account_number_masked}` : null, completed: !!data.account_number_masked },
        { label: 'Routing Number', value: data.routing_number, completed: !!data.routing_number },
      ],
    },
    {
      step: 5,
      title: 'Background Check',
      icon: ClipboardDocumentCheckIcon,
      completed: data.background_check_consent,
      items: [
        { label: 'Consent Given', value: data.background_check_consent ? 'Yes' : 'No', completed: data.background_check_consent },
        { label: 'Criminal Record', value: data.criminal_record_disclosure || 'None disclosed', completed: true },
      ],
    },
  ];

  const allStepsComplete = completionChecklist.every((section) => section.completed);

  const handleSubmit = async () => {
    if (!acceptTerms) {
      setSubmitError('You must accept the terms and conditions to submit');
      return;
    }

    if (!allStepsComplete) {
      setSubmitError('Please complete all required steps before submitting');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setErrors([]);

    try {
      const response = await fetch(route('expert.kyc.submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to dashboard with success message
        router.visit(route('expert.dashboard'), {
          method: 'get',
          data: {
            success: result.message,
          },
        });
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          setErrors(result.errors);
        }
        setSubmitError(result.error || 'Failed to submit KYC. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit KYC:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review all your information before submitting for verification
        </p>
      </div>

      {/* Completion Progress */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Verification Progress
          </h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.completion_percentage}%
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-3">
          <motion.div
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${data.completion_percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Completion Checklist
        </h3>

        {completionChecklist.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: section.step * 0.1 }}
              className={`border rounded-lg p-4 ${section.completed
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${section.completed
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                >
                  {section.completed ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Icon
                      className={`h-6 w-6 ${section.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                        }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Step {section.step}: {section.title}
                    </h4>
                    {section.completed && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        Complete
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
                        <span
                          className={`font-medium ${item.completed
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                          {item.value || (
                            <span className="flex items-center space-x-1">
                              <ExclamationTriangleIcon className="h-4 w-4" />
                              <span>Missing</span>
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Error Display */}
      {(submitError || errors.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              {submitError && (
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  {submitError}
                </p>
              )}
              {errors.length > 0 && (
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Warning for incomplete steps */}
      {!allStepsComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Incomplete Information
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please complete all required steps before submitting your KYC for review.
                Use the "Previous" button to go back and fill in missing information.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Terms and Conditions */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Terms & Conditions
        </h4>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 max-h-40 overflow-y-auto">
          <p>
            By submitting this KYC verification, I certify that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>All information provided is accurate and truthful</li>
            <li>All documents uploaded are authentic and unaltered</li>
            <li>I consent to background checks and verification of my credentials</li>
            <li>I understand that providing false information may result in account suspension</li>
            <li>I agree to maintain valid insurance and licensing throughout my time on the platform</li>
            <li>I will notify DriveAssist of any changes to my credentials or legal status</li>
          </ul>
        </div>

        <label className="flex items-start space-x-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            I have read and agree to the terms and conditions stated above. I certify that all information provided is accurate and complete.
          </span>
        </label>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📋 What happens next?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1.5">
          <li>• Our team will review your submission within 24-48 hours</li>
          <li>• You'll receive an email notification once the review is complete</li>
          <li>• If approved, you'll gain full access to all platform features</li>
          <li>• If additional information is needed, we'll contact you via email</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={previousStep}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !acceptTerms || !allStepsComplete}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              <span>Submit for Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}