import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, CheckCircleIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep3Insurance({ data, updateData, nextStep, previousStep, saveProgress }: Props) {
  const [formData, setFormData] = useState({
    insurance_policy_number: data.insurance_policy_number || '',
    insurance_provider: data.insurance_provider || '',
    insurance_expiry: data.insurance_expiry || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    updateData({ [field]: value });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('document_type', 'insurance_certificate');
    formData.append('file', file);

    try {
      const response = await fetch(route('expert.kyc.upload-document'), {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        updateData({
          insurance_certificate_path: result.path,
          insurance_certificate_url: result.url,
        });
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.insurance_policy_number) {
      newErrors.insurance_policy_number = 'Policy number is required';
    }

    if (!formData.insurance_provider) {
      newErrors.insurance_provider = 'Insurance provider is required';
    }

    if (!formData.insurance_expiry) {
      newErrors.insurance_expiry = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.insurance_expiry);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.insurance_expiry = 'Insurance must not be expired';
      }
    }

    if (!data.insurance_certificate_url) {
      newErrors.certificate = 'Please upload your insurance certificate';
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

  // Check if expiry is within 30 days
  const isExpiringSoon = () => {
    if (!formData.insurance_expiry) return false;
    const expiryDate = new Date(formData.insurance_expiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Insurance Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your business insurance details and upload a copy of your certificate.
        </p>
      </div>

      {/* Insurance Policy Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Policy Number *
        </label>
        <input
          type="text"
          value={formData.insurance_policy_number}
          onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.insurance_policy_number ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., INS-123456789"
        />
        {errors.insurance_policy_number && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.insurance_policy_number}
          </p>
        )}
      </div>

      {/* Insurance Provider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Provider *
        </label>
        <input
          type="text"
          value={formData.insurance_provider}
          onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.insurance_provider ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., State Farm, Allstate, Progressive"
        />
        {errors.insurance_provider && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.insurance_provider}
          </p>
        )}
      </div>

      {/* Insurance Expiry Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Expiry Date *
        </label>
        <input
          type="date"
          value={formData.insurance_expiry}
          onChange={(e) => handleInputChange('insurance_expiry', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.insurance_expiry ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.insurance_expiry && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.insurance_expiry}
          </p>
        )}

        {/* Expiring Soon Warning */}
        {isExpiringsoon() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-start space-x-2"
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your insurance is expiring soon. Make sure to renew it before it expires.
            </p>
          </motion.div>
        )}
      </div>

      {/* Certificate Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Certificate *
        </label>

        {!data.insurance_certificate_url ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.certificate
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading...
                </p>
              </div>
            ) : (
              <>
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  PDF, JPG, or PNG (max 5MB)
                </p>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Certificate uploaded successfully
                  </p>
                  <a
                    href={data.insurance_certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    View certificate
                  </a>
                </div>
              </div>
              <button
                onClick={() => {
                  updateData({
                    insurance_certificate_path: null,
                    insurance_certificate_url: null,
                  });
                }}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </motion.div>
        )}

        {errors.certificate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.certificate}
          </p>
        )}

        {uploadError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ✓ Your certificate is encrypted and securely stored
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Why is insurance required?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Protects you and your customers in case of accidents</li>
          <li>• Required by law for automotive businesses</li>
          <li>• Demonstrates professionalism and credibility</li>
          <li>• Provides peace of mind to customers</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
            Typical coverage types include:
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 mt-1 space-y-0.5">
            <li>• General Liability Insurance</li>
            <li>• Professional Liability Insurance</li>
            <li>• Garage Keepers Insurance</li>
          </ul>
        </div>
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