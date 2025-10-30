import React, { useState } from 'react';
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep5BackgroundCheck({ data, updateData, nextStep, previousStep, saveProgress }: Props) {
  const [formData, setFormData] = useState({
    background_check_consent: data.background_check_consent || false,
    criminal_record_disclosure: data.criminal_record_disclosure || 'none',
    criminal_record_details: data.criminal_record_details || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleConsentChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, background_check_consent: value }));
    setErrors((prev) => ({ ...prev, consent: '' }));
    updateData({ background_check_consent: value });
  };

  const handleDisclosureChange = (value: string) => {
    setFormData((prev) => ({ ...prev, criminal_record_disclosure: value }));
    updateData({ criminal_record_disclosure: value });
  };

  const handleDetailsChange = (value: string) => {
    setFormData((prev) => ({ ...prev, criminal_record_details: value }));
    updateData({ criminal_record_details: value });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.background_check_consent) {
      newErrors.consent = 'You must consent to a background check to continue';
    }

    if (formData.criminal_record_disclosure === 'disclosed' && !formData.criminal_record_details) {
      newErrors.details = 'Please provide details about your disclosure';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      saveProgress();
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Background Check
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          A background check is required to ensure the safety and security of our platform users.
        </p>
      </div>

      {/* What We Check */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              What we check:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Criminal record history (past 7 years)</li>
              <li>• Sex offender registry</li>
              <li>• Motor vehicle records (if applicable)</li>
              <li>• Business license validity</li>
              <li>• Fraud and identity verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Consent */}
      <div>
        <div className={`border-2 rounded-lg p-4 ${errors.consent ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.background_check_consent}
              onChange={(e) => handleConsentChange(e.target.checked)}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                I authorize DriveAssist to conduct a background check *
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                I understand that this background check is required to protect users and maintain
                platform integrity. I authorize DriveAssist and its designated agents to verify
                my identity and obtain criminal history records, motor vehicle records, and other
                information as necessary.
              </p>
            </div>
          </label>
        </div>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.consent}</p>
        )}
      </div>

      {/* Criminal Record Disclosure */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Criminal Record Disclosure *
        </label>
        <div className="space-y-3">
          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        formData.criminal_record_disclosure === 'none'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                    }">
            <input
              type="radio"
              name="disclosure"
              value="none"
              checked={formData.criminal_record_disclosure === 'none'}
              onChange={(e) => handleDisclosureChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                I have no criminal record to disclose
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                I have not been convicted of any crimes
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        formData.criminal_record_disclosure === 'disclosed'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                    }">
            <input
              type="radio"
              name="disclosure"
              value="disclosed"
              checked={formData.criminal_record_disclosure === 'disclosed'}
              onChange={(e) => handleDisclosureChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                I have something to disclose
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                I will provide details below
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Details (if disclosed) */}
      {formData.criminal_record_disclosure === 'disclosed' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Please provide details *
          </label>
          <textarea
            value={formData.criminal_record_details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical ${errors.details ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Please provide details about the nature of the offense, date, and any relevant information..."
          />
          {errors.details && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.details}</p>
          )}
          <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Having a criminal record doesn't automatically disqualify you. We review each case
                individually and consider factors such as the nature of the offense, how long ago
                it occurred, and evidence of rehabilitation.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Important Information */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Important Information:
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Background checks typically take 2-5 business days to complete</li>
          <li>• You'll be notified via email once the check is complete</li>
          <li>• Providing false information may result in immediate disqualification</li>
          <li>• All information is kept confidential and secure</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={previousStep}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>Continue</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
