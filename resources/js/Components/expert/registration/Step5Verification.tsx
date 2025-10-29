import { motion } from 'framer-motion';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Step5VerificationProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function Step5Verification({ data, setData, errors }: Step5VerificationProps) {
  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  };

  const [businessLicensePreview, setBusinessLicensePreview] = useState<string | null>(null);
  const [insurancePreview, setInsurancePreview] = useState<string | null>(null);

  const handleFileChange = (key: string, file: File | null, setPreview?: (url: string | null) => void) => {
    setData(key, file);

    if (file && setPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (setPreview) {
      setPreview(null);
    }
  };

  return (
    <motion.div {...slideIn} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verification Documents
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Upload documents to verify your business (all optional but recommended)
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Note: Verified experts get priority in search results and more customer trust!
        </p>
      </div>

      {/* Business License Number */}
      <div>
        <label htmlFor="business_license_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business License Number (Optional)
        </label>
        <input
          id="business_license_number"
          type="text"
          value={data.business_license_number}
          onChange={(e) => setData('business_license_number', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your business license number"
        />
      </div>

      {/* Business License Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business License Document (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="business_license"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('business_license', e.target.files?.[0] || null, setBusinessLicensePreview)}
            className="hidden"
          />
          <label
            htmlFor="business_license"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {data.business_license ? (
              <>
                <DocumentIcon className="w-12 h-12 text-green-600" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {data.business_license.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileChange('business_license', null, setBusinessLicensePreview);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, JPEG, PNG (Max 5MB)
                </p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Insurance Policy Number */}
      <div>
        <label htmlFor="insurance_policy_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Policy Number (Optional)
        </label>
        <input
          id="insurance_policy_number"
          type="text"
          value={data.insurance_policy_number}
          onChange={(e) => setData('insurance_policy_number', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your insurance policy number"
        />
      </div>

      {/* Insurance Certificate Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insurance Certificate (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="insurance_certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange('insurance_certificate', e.target.files?.[0] || null, setInsurancePreview)}
            className="hidden"
          />
          <label
            htmlFor="insurance_certificate"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {data.insurance_certificate ? (
              <>
                <DocumentIcon className="w-12 h-12 text-green-600" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {data.insurance_certificate.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFileChange('insurance_certificate', null, setInsurancePreview);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, JPEG, PNG (Max 5MB)
                </p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              We'll review your documents
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>
                Our team typically reviews applications within 24-48 hours. You'll receive an email once approved!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}