import DatePicker from '@/Components/ui/DatePicker';
import FileUpload from '@/Components/ui/FileUpload';
import { useState } from 'react';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep1BusinessDocuments({
  data,
  updateData,
  nextStep,
  saveProgress
}: Props) {
  const [formData, setFormData] = useState({
    business_license_number: data.business_license_number || '',
    business_license_expiry: data.business_license_expiry || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    updateData({ [field]: value });
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Business License Documentation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your business license information and upload a copy of your license.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business License Number *
          </label>
          <input
            type="text"
            value={formData.business_license_number}
            onChange={(e) => handleInputChange('business_license_number', e.target.value)}
            className={`
            w-full px-4 py-3 
            border-2 rounded-lg 
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-200
            ${errors.business_license_number
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
          `}
            placeholder="e.g., BL-123456"
          />
          {errors.business_license_number && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.business_license_number}
            </p>
          )}
        </div>

        {/* License Expiry Date - Modern DatePicker */}
        <DatePicker
          label="License Expiry Date"
          value={formData.business_license_expiry}
          onChange={(date) => handleInputChange('business_license_expiry', date || '')}
          minDate={new Date().toISOString().split('T')[0]}
          required
          error={errors.business_license_expiry}
          placeholder="Select expiry date"
        />
      </div>

      {/* Business License Document Upload */}
      <FileUpload
        label="Business License Document"
        description="Upload your business license document (PDF, JPG, or PNG)"
        documentType="business_license"
        currentFileUrl={data.business_license_document_url}
        currentFilePath={data.business_license_document_path}
        onUploadSuccess={(path, url) => {
          updateData({
            business_license_document_path: path,
            business_license_document_url: url,
          });
          // Clear error when file is uploaded
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.document;
            return newErrors;
          });
        }}
        onRemove={() => {
          updateData({
            business_license_document_path: null,
            business_license_document_url: null,
          });
        }}
        required
        acceptedTypes=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={5}
      />
      {errors.document && (
        <p className="text-sm text-red-600 dark:text-red-400 -mt-4">
          {errors.document}
        </p>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          📌 Why do we need this?
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Verify your business is legally registered</li>
          <li>• Build trust with customers</li>
          <li>• Comply with local regulations</li>
          <li>• Protect both you and our users</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <span>Continue to Identity Verification</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}