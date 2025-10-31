import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';

// Import custom components
import OnboardingHeader from '@/Components/expert/onboarding/OnboardingHeader';
import OnboardingProgressSteps from '@/Components/expert/onboarding/OnboardingProgressSteps';
import OnboardingNavigation from '@/Components/expert/onboarding/OnboardingNavigation';

// Import step components
import BasicInfoStep from '@/Components/expert/onboarding/BasicInfoStep';
import LocationStep from '@/Components/expert/onboarding/LocationStep';
import ServicesStep from '@/Components/expert/onboarding/ServicesStep';
import PricingStep from '@/Components/expert/onboarding/PricingStep';
import OperatingHoursStep from '@/Components/expert/onboarding/OperatingHoursStep';

// Import hooks and types
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import type { OnboardingProps, ExpertData, Step } from '@/types/expert-onboarding';

export default function Onboarding({
  expert,
  businessTypes,
  availableSpecialties,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(expert.current_step);

  // Load Google Maps
  const { mapsLoaded, isLoading, error } = useGoogleMaps({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  const { data, setData, post, processing, errors } = useForm<ExpertData>({
    current_step: expert.current_step,
    phone: expert.phone || '',
    business_name: expert.business_name || '',
    business_type: expert.business_type || '',
    bio: expert.bio || '',
    years_experience: expert.years_experience || null,
    employee_count: expert.employee_count || null,
    service_radius_km: expert.service_radius_km || 25,
    business_address: expert.business_address || '',
    location_latitude: expert.location_latitude,
    location_longitude: expert.location_longitude,
    specialties: expert.specialties || [],
    hourly_rate_min: expert.hourly_rate_min,
    hourly_rate_max: expert.hourly_rate_max,
    diagnostic_fee: expert.diagnostic_fee,
    accepts_emergency: expert.accepts_emergency || false,
    monday_open: expert.monday_open || '',
    monday_close: expert.monday_close || '',
    tuesday_open: expert.tuesday_open || '',
    tuesday_close: expert.tuesday_close || '',
    wednesday_open: expert.wednesday_open || '',
    wednesday_close: expert.wednesday_close || '',
    thursday_open: expert.thursday_open || '',
    thursday_close: expert.thursday_close || '',
    friday_open: expert.friday_open || '',
    friday_close: expert.friday_close || '',
    saturday_open: expert.saturday_open || '',
    saturday_close: expert.saturday_close || '',
    sunday_open: expert.sunday_open || '',
    sunday_close: expert.sunday_close || '',
  });

  // Update current_step in form data when currentStep changes
  useEffect(() => {
    setData('current_step', currentStep);
  }, [currentStep, setData]);

  // Helper to update multiple fields at once
  const updateData = (updates: Partial<ExpertData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Define steps
  const steps: Step[] = [
    { number: 1, title: 'Basic Info', icon: PhoneIcon },
    { number: 2, title: 'Location', icon: MapPinIcon },
    { number: 3, title: 'Services', icon: WrenchScrewdriverIcon },
    { number: 4, title: 'Pricing', icon: CurrencyDollarIcon },
    { number: 5, title: 'Hours', icon: ClockIcon },
  ];

  // Check if step is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.phone && data.business_name && data.business_type);
      case 2:
        return !!(
          data.business_address &&
          data.location_latitude &&
          data.location_longitude
        );
      case 3:
        return data.specialties.length > 0;
      case 4:
        return true; // Pricing is optional
      case 5:
        return true; // Hours are optional
      default:
        return false;
    }
  };

  // Navigation handlers
  const handleNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    post(route('expert.onboarding.save'), {
      preserveScroll: true,
    });
  };

  // Form submission - ONLY for step 5 completion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit if we're on step 5
    if (currentStep !== 5) {
      return;
    }

    post(route('expert.onboarding.complete'));
  };

  return (
    <>
      <Head title="Complete Your Profile" />

      {/* Enhanced background with gradient blend */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <OnboardingHeader currentStep={currentStep} totalSteps={5} />

          {/* Progress Steps */}
          <OnboardingProgressSteps
            steps={steps}
            currentStep={currentStep}
            isStepComplete={isStepComplete}
          />

          {/* Google Maps Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Google Maps Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Premium Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative group"
          >
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Main card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Subtle top border accent */}
              <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

              {/* Form content */}
              <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <BasicInfoStep
                        key="step-1"
                        data={data}
                        setData={updateData}
                        errors={errors}
                        businessTypes={businessTypes}
                      />
                    )}

                    {/* Step 2: Location */}
                    {currentStep === 2 && (
                      <LocationStep
                        key="step-2"
                        data={data}
                        setData={updateData}
                        errors={errors}
                        mapsLoaded={mapsLoaded}
                      />
                    )}

                    {/* Step 3: Services */}
                    {currentStep === 3 && (
                      <ServicesStep
                        key="step-3"
                        data={data}
                        setData={updateData}
                        errors={errors}
                        availableSpecialties={availableSpecialties}
                      />
                    )}

                    {/* Step 4: Pricing */}
                    {currentStep === 4 && (
                      <PricingStep
                        key="step-4"
                        data={data}
                        setData={updateData}
                        errors={errors}
                      />
                    )}

                    {/* Step 5: Operating Hours */}
                    {currentStep === 5 && (
                      <OperatingHoursStep
                        key="step-5"
                        data={data}
                        setData={updateData}
                        errors={errors}
                      />
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <OnboardingNavigation
                    currentStep={currentStep}
                    totalSteps={5}
                    processing={processing}
                    isStepComplete={isStepComplete}
                    onPrevious={handlePreviousStep}
                    onNext={handleNextStep}
                    onSaveAndExit={handleSaveAndExit}
                  />
                </form>
              </div>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
          >
            Need help?{' '}
            <a
              href="mailto:support@driveassist.com"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Contact Support
            </a>
          </motion.p>
        </div>
      </div>
    </>
  );
}