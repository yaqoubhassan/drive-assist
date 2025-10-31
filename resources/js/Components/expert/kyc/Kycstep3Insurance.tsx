import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import FileUpload from '@/Components/ui/FileUpload';
import DatePicker from '@/Components/ui/DatePicker';

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    updateData({ [field]: value });
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
      today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Insurance Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your business insurance details and upload a copy of your certificate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Insurance Policy Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Insurance Policy Number *
          </label>
          <input
            type="text"
            value={formData.insurance_policy_number}
            onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
            className={`
              w-full px-4 py-3 
              border-2 rounded-lg 
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-200
              ${errors.insurance_policy_number
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
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
            className={`
              w-full px-4 py-3 
              border-2 rounded-lg 
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              transition-all duration-200
              ${errors.insurance_provider
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
            placeholder="e.g., State Farm, Allstate, Progressive"
          />
          {errors.insurance_provider && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.insurance_provider}
            </p>
          )}
        </div>
      </div>

      {/* Insurance Expiry Date - Using DatePicker */}
      <div>
        <DatePicker
          label="Insurance Expiry Date"
          value={formData.insurance_expiry}
          onChange={(date) => handleInputChange('insurance_expiry', date || '')}
          minDate={new Date().toISOString().split('T')[0]}
          required
          error={errors.insurance_expiry}
          placeholder="Select expiry date"
        />

        {/* Expiring Soon Warning */}
        {isExpiringSoon() && (
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

      {/* Insurance Certificate Upload - Using FileUpload Component */}
      <FileUpload
        label="Insurance Certificate"
        description="Upload your insurance certificate (PDF, JPG, or PNG)"
        documentType="insurance_certificate"
        currentFileUrl={data.insurance_certificate_url}
        currentFilePath={data.insurance_certificate_path}
        onUploadSuccess={(path, url) => {
          updateData({
            insurance_certificate_path: path,
            insurance_certificate_url: url,
          });
          // Clear error when file is uploaded
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.certificate;
            return newErrors;
          });
        }}
        onRemove={() => {
          updateData({
            insurance_certificate_path: null,
            insurance_certificate_url: null,
          });
        }}
        required
        acceptedTypes=".pdf,.jpg,.jpeg,.png"
        maxSizeMB={5}
      />
      {errors.certificate && (
        <p className="text-sm text-red-600 dark:text-red-400 -mt-4">
          {errors.certificate}
        </p>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          📌 Why is insurance required?
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
          <span>Continue to Background Check</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}