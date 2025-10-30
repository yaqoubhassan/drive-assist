import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => void;
}

export default function KycStep4Banking({ data, updateData, nextStep, previousStep, saveProgress }: Props) {
  const [formData, setFormData] = useState({
    bank_name: data.bank_name || '',
    account_holder_name: data.account_holder_name || '',
    account_number: '',
    routing_number: data.routing_number || '',
    tax_id: '',
  });

  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showTaxId, setShowTaxId] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    updateData({ [field]: value });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.bank_name) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.account_holder_name) {
      newErrors.account_holder_name = 'Account holder name is required';
    }

    if (!formData.account_number && !data.account_number_masked) {
      newErrors.account_number = 'Account number is required';
    } else if (formData.account_number && formData.account_number.length < 8) {
      newErrors.account_number = 'Please enter a valid account number';
    }

    if (!formData.routing_number) {
      newErrors.routing_number = 'Routing number is required';
    } else if (formData.routing_number.length !== 9) {
      newErrors.routing_number = 'Routing number must be 9 digits';
    }

    if (!formData.tax_id && !data.tax_id_encrypted) {
      newErrors.tax_id = 'Tax ID is required';
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
          Banking Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This information is required for payment processing when you complete jobs.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <LockClosedIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">
              Your Information is Secure
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              All banking information is encrypted using bank-level security. We will never share
              your information with anyone except for authorized payment processing.
            </p>
          </div>
        </div>
      </div>

      {/* Bank Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bank Name *
        </label>
        <input
          type="text"
          value={formData.bank_name}
          onChange={(e) => handleInputChange('bank_name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bank_name ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., Chase, Bank of America, Wells Fargo"
        />
        {errors.bank_name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bank_name}</p>
        )}
      </div>

      {/* Account Holder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Account Holder Name *
        </label>
        <input
          type="text"
          value={formData.account_holder_name}
          onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.account_holder_name ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Full name as it appears on your bank account"
        />
        {errors.account_holder_name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.account_holder_name}</p>
        )}
      </div>

      {/* Account Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Account Number *
        </label>
        {data.account_number_masked ? (
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Account on file:
            </p>
            <p className="text-lg font-mono text-gray-900 dark:text-white">
              {data.account_number_masked}
            </p>
            <button
              onClick={() => updateData({ account_number_masked: null })}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Update account number
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type={showAccountNumber ? 'text' : 'password'}
              value={formData.account_number}
              onChange={(e) => handleInputChange('account_number', e.target.value.replace(/\D/g, ''))}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.account_number ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your account number"
            />
            <button
              type="button"
              onClick={() => setShowAccountNumber(!showAccountNumber)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showAccountNumber ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
        {errors.account_number && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.account_number}</p>
        )}
      </div>

      {/* Routing Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Routing Number *
        </label>
        <input
          type="text"
          value={formData.routing_number}
          onChange={(e) => handleInputChange('routing_number', e.target.value.replace(/\D/g, '').slice(0, 9))}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.routing_number ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="9-digit routing number"
          maxLength={9}
        />
        {errors.routing_number && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.routing_number}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          You can find this on your check or by logging into your online banking
        </p>
      </div>

      {/* Tax ID (EIN or SSN) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tax ID (EIN or SSN) *
        </label>
        <div className="relative">
          <input
            type={showTaxId ? 'text' : 'password'}
            value={formData.tax_id}
            onChange={(e) => handleInputChange('tax_id', e.target.value)}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.tax_id ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="XX-XXXXXXX or XXX-XX-XXXX"
          />
          <button
            type="button"
            onClick={() => setShowTaxId(!showTaxId)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showTaxId ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.tax_id && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tax_id}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Business EIN or Personal SSN for tax reporting purposes
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
          How we use this information:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Direct deposit of your earnings from completed jobs</li>
          <li>• Comply with tax reporting requirements (1099 forms)</li>
          <li>• Verify business legitimacy</li>
          <li>• Prevent fraud and ensure secure transactions</li>
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
