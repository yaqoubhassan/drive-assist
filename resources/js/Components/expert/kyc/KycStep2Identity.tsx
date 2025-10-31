import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep2Identity({ data, updateData, nextStep, previousStep, saveProgress }: Props) {
  const [formData, setFormData] = useState({
    id_type: data.id_type || '',
    id_number: data.id_number || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const idTypes = [
    { value: 'drivers_license', label: "Driver's License", icon: '🚗' },
    { value: 'passport', label: 'Passport', icon: '🛂' },
    { value: 'national_id', label: 'National ID', icon: '🆔' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    updateData({ [field]: value });
  };

  const handleFileUpload = async (file: File, side: 'front' | 'back') => {
    const setUploading = side === 'front' ? setIsUploadingFront : setIsUploadingBack;
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('document_type', side === 'front' ? 'id_front' : 'id_back');
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
        if (side === 'front') {
          updateData({
            id_document_front_path: result.path,
            id_document_front_url: result.url,
          });
        } else {
          updateData({
            id_document_back_path: result.path,
            id_document_back_url: result.url,
          });
        }
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id_type) {
      newErrors.id_type = 'Please select an ID type';
    }

    if (!formData.id_number) {
      newErrors.id_number = 'ID number is required';
    }

    if (!data.id_document_front_url) {
      newErrors.front = 'Please upload the front of your ID';
    }

    // Back is only required for driver's license and national ID
    if (formData.id_type !== 'passport' && !data.id_document_back_url) {
      newErrors.back = 'Please upload the back of your ID';
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
          Identity Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide a government-issued ID to verify your identity.
        </p>
      </div>

      {/* ID Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select ID Type *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {idTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleInputChange('id_type', type.value)}
              className={`p-4 border-2 rounded-lg transition-all text-center ${formData.id_type === type.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {type.label}
              </div>
            </button>
          ))}
        </div>
        {errors.id_type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.id_type}
          </p>
        )}
      </div>

      {/* ID Number */}
      {formData.id_type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Number *
          </label>
          <input
            type="text"
            value={formData.id_number}
            onChange={(e) => handleInputChange('id_number', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.id_number ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder={
              formData.id_type === 'passport'
                ? 'e.g., A12345678'
                : formData.id_type === 'drivers_license'
                  ? 'e.g., D1234567'
                  : 'e.g., 123456789'
            }
          />
          {errors.id_number && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.id_number}
            </p>
          )}
        </motion.div>
      )}

      {/* Front Document Upload */}
      {formData.id_type && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {formData.id_type === 'passport' ? 'Passport Photo Page' : 'Front of ID'} *
          </label>

          {!data.id_document_front_url ? (
            <div
              onClick={() => frontInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.front
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
            >
              <input
                ref={frontInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'front');
                }}
                className="hidden"
              />

              {isUploadingFront ? (
                <div className="space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uploading...
                  </p>
                </div>
              ) : (
                <>
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
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
                      href={data.id_document_front_url}
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
                      id_document_front_path: null,
                      id_document_front_url: null,
                    });
                  }}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>
              </div>
            </motion.div>
          )}

          {errors.front && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.front}</p>
          )}
        </motion.div>
      )}

      {/* Back Document Upload (if not passport) */}
      {formData.id_type && formData.id_type !== 'passport' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Back of ID *
          </label>

          {!data.id_document_back_url ? (
            <div
              onClick={() => backInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.back
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                }`}
            >
              <input
                ref={backInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'back');
                }}
                className="hidden"
              />

              {isUploadingBack ? (
                <div className="space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Uploading...
                  </p>
                </div>
              ) : (
                <>
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
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
                      href={data.id_document_back_url}
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
                      id_document_back_path: null,
                      id_document_back_url: null,
                    });
                  }}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>
              </div>
            </motion.div>
          )}

          {errors.back && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.back}</p>
          )}
        </motion.div>
      )}

      {uploadError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{uploadError}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Why do we need this?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Verify you are who you say you are</li>
          <li>• Prevent fraud and identity theft</li>
          <li>• Comply with legal requirements</li>
          <li>• Protect both you and our users</li>
        </ul>
        <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
          🔒 Your ID information is encrypted and stored securely. We will never share it with anyone.
        </p>
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