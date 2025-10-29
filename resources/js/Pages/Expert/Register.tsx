import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Step1BasicInfo from '@/Components/expert/registration/Step1BasicInfo';
import Step2BusinessDetails from '@/Components/expert/registration/Step2BusinessDetails';
import Step3Pricing from '@/Components/expert/registration/Step3Pricing';
import Step4OperatingHours from '@/Components/expert/registration/Step4OperatingHours';
import Step5Verification from '@/Components/expert/registration/Step5Verification';
import Step6Review from '@/Components/expert/registration/Step6Review';
import ProgressStepper from '@/Components/expert/registration/ProgressStepper';

interface ExpertRegisterProps {
  specialties: Record<string, string>;
  businessTypes: Record<string, string>;
}

export default function Register({ specialties, businessTypes }: ExpertRegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const { data, setData, post, processing, errors, progress } = useForm({
    // Step 1: Basic Information
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    business_name: '',
    business_address: '',
    latitude: null as number | null,
    longitude: null as number | null,

    // Step 2: Business Details
    business_type: 'mechanic',
    years_experience: 0,
    employee_count: null as number | null,
    service_radius_km: 25,
    bio: '',
    specialties: [] as string[],

    // Step 3: Pricing
    hourly_rate_min: null as number | null,
    hourly_rate_max: null as number | null,
    diagnostic_fee: null as number | null,
    accepts_emergency: false,

    // Step 4: Operating Hours
    monday_open: '',
    monday_close: '',
    tuesday_open: '',
    tuesday_close: '',
    wednesday_open: '',
    wednesday_close: '',
    thursday_open: '',
    thursday_close: '',
    friday_open: '',
    friday_close: '',
    saturday_open: '',
    saturday_close: '',
    sunday_open: '',
    sunday_close: '',

    // Step 5: Verification Documents
    business_license: null as File | null,
    insurance_certificate: null as File | null,
    certifications: [] as File[],
    business_license_number: '',
    insurance_policy_number: '',
  });

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Contact & business name' },
    { number: 2, title: 'Business Details', description: 'Services & experience' },
    { number: 3, title: 'Pricing', description: 'Rates & fees' },
    { number: 4, title: 'Operating Hours', description: 'Schedule & availability' },
    { number: 5, title: 'Verification', description: 'Documents & licenses' },
    { number: 6, title: 'Review', description: 'Confirm & submit' },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('expert.register.store'));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          data.name &&
          data.email &&
          data.password &&
          data.password.length >= 8 &&
          data.password === data.password_confirmation &&
          data.phone &&
          data.business_name &&
          data.business_address
        );
      case 2:
        return !!(
          data.business_type &&
          data.years_experience >= 0 &&
          data.service_radius_km > 0 &&
          data.specialties.length > 0
        );
      case 3:
        return true; // Pricing is optional
      case 4:
        return true; // Operating hours are optional
      case 5:
        return true; // Documents are optional
      case 6:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  return (
    <>
      <Head title="Become an Expert" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join DriveAssist as an Expert
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Connect with thousands of drivers and grow your business
            </p>
          </motion.div>

          {/* Progress Stepper */}
          <ProgressStepper steps={steps} currentStep={currentStep} />

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-8"
          >
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <Step1BasicInfo
                    key="step1"
                    data={data}
                    setData={setData}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <Step2BusinessDetails
                    key="step2"
                    data={data}
                    setData={setData}
                    errors={errors}
                    specialties={specialties}
                    businessTypes={businessTypes}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Pricing
                    key="step3"
                    data={data}
                    setData={setData}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <Step4OperatingHours
                    key="step4"
                    data={data}
                    setData={setData}
                    errors={errors}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Verification
                    key="step5"
                    data={data}
                    setData={setData}
                    errors={errors}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Review
                    key="step6"
                    data={data}
                    specialties={specialties}
                    businessTypes={businessTypes}
                  />
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-3">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Progress (if any) */}
              {progress && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Uploading documents... {progress.percentage}%
                  </p>
                </div>
              )}
            </form>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400"
          >
            <p>
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Sign in
              </a>
            </p>
            <p className="mt-2">
              Need help?{' '}
              <a
                href="/contact"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Contact support
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}