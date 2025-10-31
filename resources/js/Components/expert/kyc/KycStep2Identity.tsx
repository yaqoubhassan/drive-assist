import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUpload from '@/Components/ui/FileUpload';

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
      {/* Header */}
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
              className={`
                p-4 border-2 rounded-lg transition-all text-center
                ${formData.id_type === type.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }
              `}
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
            className={`
              w-full px-4 py-3 
              border-2 rounded-lg 
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-200
              ${errors.id_number
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
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
          <FileUpload
            label={formData.id_type === 'passport' ? 'Passport Photo Page *' : 'Front of ID *'}
            description={`Upload ${formData.id_type === 'passport' ? 'the photo page of your passport' : 'the front of your ID'}`}
            documentType="id_front"
            currentFileUrl={data.id_document_front_url}
            currentFilePath={data.id_document_front_path}
            onUploadSuccess={(path, url) => {
              updateData({
                id_document_front_path: path,
                id_document_front_url: url,
              });
              // Clear error when file is uploaded
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.front;
                return newErrors;
              });
            }}
            onRemove={() => {
              updateData({
                id_document_front_path: null,
                id_document_front_url: null,
              });
            }}
            required
            acceptedTypes=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={5}
          />
          {errors.front && (
            <p className="text-sm text-red-600 dark:text-red-400 -mt-4">
              {errors.front}
            </p>
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
          <FileUpload
            label="Back of ID *"
            description="Upload the back of your ID document"
            documentType="id_back"
            currentFileUrl={data.id_document_back_url}
            currentFilePath={data.id_document_back_path}
            onUploadSuccess={(path, url) => {
              updateData({
                id_document_back_path: path,
                id_document_back_url: url,
              });
              // Clear error when file is uploaded
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.back;
                return newErrors;
              });
            }}
            onRemove={() => {
              updateData({
                id_document_back_path: null,
                id_document_back_url: null,
              });
            }}
            required
            acceptedTypes=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={5}
          />
          {errors.back && (
            <p className="text-sm text-red-600 dark:text-red-400 -mt-4">
              {errors.back}
            </p>
          )}
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          📌 Why do we need this?
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
          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>Continue to Insurance Verification</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}