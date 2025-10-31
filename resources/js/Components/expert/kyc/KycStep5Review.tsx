import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep5Review({ data, updateData, previousStep }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = [
    {
      step: 1,
      title: 'Business Documents',
      icon: DocumentTextIcon,
      completed: !!(data.business_license_number && data.business_license_document_url && data.business_license_expiry),
      items: [
        { label: 'License Number', value: data.business_license_number, completed: !!data.business_license_number },
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
        { label: 'ID Type', value: data.id_type?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), completed: !!data.id_type },
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
      title: 'Background Check',
      icon: ClipboardDocumentCheckIcon,
      completed: data.background_check_consent,
      items: [
        { label: 'Consent Given', value: data.background_check_consent ? 'Yes' : 'No', completed: data.background_check_consent },
        { label: 'Criminal Record', value: data.criminal_record_disclosure === 'none' ? 'None to disclose' : 'Disclosed', completed: true },
      ],
    },
  ];

  const allCompleted = sections.every(section => section.completed);
  const incompleteSection = sections.find(section => !section.completed);

  const handleSubmit = async () => {
    if (!allCompleted) {
      setError('Please complete all required sections before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

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
        // Refresh the page to show updated status
        router.reload({ only: ['kyc'] });
      } else {
        setError(result.errors?.join(', ') || 'Failed to submit KYC. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting. Please try again.');
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
          Review your information before submitting for verification
        </p>
      </div>

      {/* Completion Status */}
      {!allCompleted && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Incomplete Information
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Please complete the <strong>{incompleteSection?.title}</strong> section before submitting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: section.step * 0.1 }}
              className={`bg-white dark:bg-gray-700 border rounded-lg p-6 ${section.completed
                ? 'border-green-200 dark:border-green-800'
                : 'border-red-200 dark:border-red-800'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${section.completed
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${section.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                    <p
                      className={`text-sm ${section.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                      {section.completed ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.visit(route('expert.kyc.index'), {
                    data: { step: section.step },
                    preserveState: true,
                  })}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-3 ml-13">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-600 last:border-0">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      {item.value ? (
                        <>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.value}
                          </span>
                          {item.completed && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          )}
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-red-600 dark:text-red-400">
                            Missing
                          </span>
                          <XCircleIcon className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          By submitting, you confirm that:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• All information provided is accurate and truthful</li>
          <li>• You have the right to work as an automotive expert</li>
          <li>• You consent to background verification checks</li>
          <li>• You agree to DriveAssist's Terms of Service</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={previousStep}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!allCompleted || isSubmitting}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <>
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
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-5 h-5" />
              <span>Submit for Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}