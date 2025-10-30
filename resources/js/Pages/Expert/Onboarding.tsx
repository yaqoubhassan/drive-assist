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

  // Navigation handlers - FIX: Accept event parameter and prevent default
  const handleNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Explicitly prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep < 5) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Already on final step');
    }
  };

  const handlePreviousStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Explicitly prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep > 1) {
      console.log('Moving to previous step:', currentStep - 1);
      setCurrentStep(currentStep - 1);
    } else {
      console.log('Already on first step');
    }
  };

  const handleSaveAndExit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Explicitly prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('Saving progress and exiting...');
    post(route('expert.onboarding.save'), {
      preserveScroll: true,
    });
  };

  // Form submission - ONLY for step 5 completion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit if we're on step 5
    if (currentStep !== 5) {
      console.warn('Form submission prevented - not on final step. Current step:', currentStep);
      return;
    }

    console.log('Submitting onboarding completion...');
    post(route('expert.onboarding.complete'));
  };

  // Show Google Maps error if any
  useEffect(() => {
    if (error) {
      console.error('Google Maps Error:', error);
    }
  }, [error]);

  return (
    <>
      <Head title="Complete Your Profile" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
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
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error.message}</p>
            </div>
          )}

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <BasicInfoStep
                    data={data}
                    setData={updateData}
                    errors={errors}
                    businessTypes={businessTypes}
                  />
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <LocationStep
                    data={data}
                    setData={updateData}
                    errors={errors}
                    mapsLoaded={mapsLoaded}
                  />
                )}

                {/* Step 3: Services */}
                {currentStep === 3 && (
                  <ServicesStep
                    data={data}
                    setData={updateData}
                    errors={errors}
                    availableSpecialties={availableSpecialties}
                  />
                )}

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <PricingStep
                    data={data}
                    setData={updateData}
                    errors={errors}
                  />
                )}

                {/* Step 5: Operating Hours */}
                {currentStep === 5 && (
                  <OperatingHoursStep
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
          </motion.div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Need help?{' '}
            <a
              href="mailto:support@driveassist.com"
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div >
    </>
  );
}