import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep1BusinessDocuments({ data, updateData, nextStep, saveProgress }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    business_license_number: data.business_license_number || '',
    business_license_expiry: data.business_license_expiry || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    // Update parent data
    updateData({ [field]: value });
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('document_type', 'business_license');
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
          business_license_document_path: result.path,
          business_license_document_url: result.url,
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

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.business_license_number) {
      newErrors.business_license_number = 'Business license number is required';
    }

    if (!formData.business_license_expiry) {
      newErrors.business_license_expiry = 'License expiry date is required';
    }

    if (!data.business_license_document_url) {
      newErrors.document = 'Please upload your business license document';
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
          Business License Documentation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your business license information and upload a copy of your license.
        </p>
      </div>

      {/* Business License Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business License Number *
        </label>
        <input
          type="text"
          value={formData.business_license_number}
          onChange={(e) => handleInputChange('business_license_number', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.business_license_number ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., BL-123456"
        />
        {errors.business_license_number && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.business_license_number}
          </p>
        )}
      </div>

      {/* License Expiry Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          License Expiry Date *
        </label>
        <input
          type="date"
          value={formData.business_license_expiry}
          onChange={(e) => handleInputChange('business_license_expiry', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.business_license_expiry ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.business_license_expiry && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.business_license_expiry}
          </p>
        )}
      </div>

      {/* Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business License Document *
        </label>

        {!data.business_license_document_url ? (
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.document
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
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
                    Document uploaded successfully
                  </p>
                  <a
                    href={data.business_license_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    View document
                  </a>
                </div>
              </div>
              <button
                onClick={() => {
                  updateData({
                    business_license_document_path: null,
                    business_license_document_url: null,
                  });
                }}
                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </motion.div>
        )}

        {errors.document && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.document}
          </p>
        )}

        {uploadError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          ✓ Your document is encrypted and securely stored
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Why do we need this?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Verify your business is legally registered</li>
          <li>• Build trust with customers</li>
          <li>• Comply with local regulations</li>
          <li>• Protect both you and our users</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          {/* No previous button on first step */}
        </div>
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