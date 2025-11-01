import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Import step components
import BasicInfoStep from '@/Components/expert/onboarding/BasicInfoStep';
import LocationStep from '@/Components/expert/onboarding/LocationStep';
import ServicesStep from '@/Components/expert/onboarding/ServicesStep';
import PricingStep from '@/Components/expert/onboarding/PricingStep';
import OperatingHoursStep from '@/Components/expert/onboarding/OperatingHoursStep';

// ✅ Import Google Maps hook
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

import type { ExpertData, Step } from '@/types/expert-onboarding';

interface Props {
  expert: ExpertData;
  businessTypes: Array<{ value: string; label: string }>;
  availableSpecialties: Array<{ value: string; label: string }>;
  errors: any;
}

export default function Onboarding({
  expert,
  businessTypes,
  availableSpecialties,
  errors,
}: Props) {
  const [currentStep, setCurrentStep] = useState(expert.current_step || 1);
  const [isSaving, setIsSaving] = useState(false);
  const { processing, post } = useForm();

  // ✅ Load Google Maps
  const { mapsLoaded, isLoading: mapsLoading, error: mapsError } = useGoogleMaps({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ['places'],
  });

  // Initialize data state
  const [data, setData] = useState<ExpertData>({
    current_step: expert.current_step || 1,
    phone: expert.phone || '',
    business_name: expert.business_name || '',
    business_type: expert.business_type || 'mechanic',
    bio: expert.bio || '',
    years_experience: expert.years_experience || null,
    employee_count: expert.employee_count || null,
    business_address: expert.business_address || '',
    location_latitude: expert.location_latitude || null,
    location_longitude: expert.location_longitude || null,
    service_radius_km: expert.service_radius_km || 25,
    specialties: expert.specialties || [],
    hourly_rate_min: expert.hourly_rate_min || null,
    hourly_rate_max: expert.hourly_rate_max || null,
    diagnostic_fee: expert.diagnostic_fee || null,
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

  // Helper to update multiple fields at once
  const updateData = (updates: Partial<ExpertData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  // Define steps
  const steps: Step[] = [
    { number: 1, title: 'Basic Information', icon: PhoneIcon },
    { number: 2, title: 'Location', icon: MapPinIcon },
    { number: 3, title: 'Services & Specialties', icon: WrenchScrewdriverIcon },
    { number: 4, title: 'Pricing', icon: CurrencyDollarIcon },
    { number: 5, title: 'Operating Hours', icon: ClockIcon },
  ];

  // ✅ FIXED: Check if step is complete
  // Steps 4 and 5 are OPTIONAL, so they should NEVER block navigation
  // const isStepComplete = (step: number): boolean => {
  //   switch (step) {
  //     case 1: // Required
  //       return !!(data.phone && data.business_name && data.business_type);
  //     case 2: // Required
  //       return !!(
  //         data.business_address &&
  //         data.location_latitude &&
  //         data.location_longitude
  //       );
  //     case 3: // Required
  //       return data.specialties.length > 0;
  //     case 4: // ✅ OPTIONAL - Always returns true to allow skipping
  //       return true;
  //     case 5: // ✅ OPTIONAL - Always returns true to allow skipping
  //       return true;
  //     default:
  //       return false;
  //   }
  // };

  const isStepComplete = (step: number): boolean => {
    console.log(`🔍 Checking if step ${step} is complete, currentStep: ${currentStep}`);

    switch (step) {
      case 1: // Basic Information (REQUIRED)
        const step1Complete = !!(data.phone && data.business_name && data.business_type);
        console.log(`✅ Step 1 complete: ${step1Complete}`);
        return step1Complete;

      case 2: // Location (REQUIRED)
        const step2Complete = !!(
          data.business_address &&
          data.location_latitude &&
          data.location_longitude
        );
        console.log(`✅ Step 2 complete: ${step2Complete}`);
        return step2Complete;

      case 3: // Services & Specialties (REQUIRED)
        const step3Complete = data.specialties.length > 0;
        console.log(`✅ Step 3 complete: ${step3Complete} (specialties: ${data.specialties.length})`);
        return step3Complete;

      case 4: // Pricing (OPTIONAL)
        // ✅ FIXED: Always return true - step 4 is optional
        // This allows users to proceed to step 5 without filling pricing
        console.log(`✅ Step 4 (Pricing) is OPTIONAL - always complete: true`);
        return true;

      case 5: // Operating Hours (OPTIONAL)
        // ✅ FIXED: Also always return true - step 5 is optional
        // This allows users to complete onboarding without operating hours
        console.log(`✅ Step 5 (Operating Hours) is OPTIONAL - always complete: true`);
        return true;

      default:
        console.log(`❌ Unknown step ${step}`);
        return false;
    }
  };

  // ✅ NEW: Check if step has data (for visual indicators only, not blocking)
  const hasStepData = (step: number): boolean => {
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
      case 4: // Has pricing data
        return !!(data.hourly_rate_min || data.hourly_rate_max || data.diagnostic_fee);
      case 5: // Has hours data
        const hasAnyHours = [
          'monday', 'tuesday', 'wednesday', 'thursday',
          'friday', 'saturday', 'sunday'
        ].some(day => {
          const openKey = `${day}_open` as keyof ExpertData;
          const closeKey = `${day}_close` as keyof ExpertData;
          return !!(data[openKey] || data[closeKey]);
        });
        return hasAnyHours;
      default:
        return false;
    }
  };

  // Calculate completion percentage based on steps with data
  const completionPercentage = Math.round(
    (steps.filter((s) => hasStepData(s.number)).length / steps.length) * 100
  );

  // Navigate to a specific step
  const goToStep = (step: number) => {
    if (step > currentStep + 1) {
      return;
    }
    setCurrentStep(step);
    // Only save progress when navigating backwards
    if (step < currentStep) {
      saveProgress(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Navigation handlers - only update LOCAL state
  // const nextStep = () => {
  //   if (currentStep < 5) {
  //     const next = currentStep + 1;
  //     console.log(`📍 Moving to step ${next} (local only)`);
  //     setCurrentStep(next);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // };

  const nextStep = () => {
    console.log(`🔵 nextStep() called, current: ${currentStep}`);

    if (currentStep < 5) {
      const next = currentStep + 1;
      console.log(`📍 Moving to step ${next} (local state only, no backend save)`);
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log(`✅ Step changed successfully to: ${next}`);
    } else {
      console.warn(`⚠️ Cannot go beyond step 5. Current: ${currentStep}`);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      console.log(`📍 Moving back to step ${prev}`);
      setCurrentStep(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ Save progress to backend (only when explicitly needed)
  const saveProgress = async (step?: number) => {
    if (isSaving || processing) {
      return;
    }

    setIsSaving(true);

    const updatedData = {
      ...data,
      current_step: step || currentStep,
    };

    console.log('💾 Saving progress to backend for step:', step || currentStep);

    router.post(
      route('expert.onboarding.save-progress'),
      updatedData,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          console.log('✅ Progress saved successfully');
          setIsSaving(false);
        },
        onError: (errors) => {
          console.error('❌ Failed to save progress:', errors);
          setIsSaving(false);
        },
        onFinish: () => {
          setIsSaving(false);
        },
      }
    );
  };

  // ✅ Handle "Save & Exit" button - saves and logs out
  const handleSaveAndExit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving || processing) {
      return;
    }

    console.log('🚪 Save & Exit clicked');
    setIsSaving(true);

    const dataToSave = {
      ...data,
      current_step: currentStep,
    };

    router.post(
      route('expert.onboarding.save'),
      dataToSave,
      {
        preserveScroll: false,
        preserveState: false,
        replace: true,
        onSuccess: () => {
          console.log('✅ Saved and logging out');
          sessionStorage.clear();
        },
        onError: (errors) => {
          console.error('❌ Save & Exit failed:', errors);
          setIsSaving(false);
          alert('Failed to save progress. Please try again.');
        },
        onFinish: () => {
          setIsSaving(false);
        },
      }
    );
  };

  // ✅ Form submission - ONLY for final step completion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 Form submit triggered, current step:', currentStep);

    if (currentStep !== 5) {
      console.warn('⚠️ Submit called but not on final step! Current step:', currentStep);
      console.warn('⚠️ Preventing submission. User should be on step 5.');
      return;
    }

    console.log('✅ Submitting final onboarding from step 5');

    // Update data with current step before submitting
    const finalData = {
      ...data,
      current_step: 5,
    };

    console.log('📤 Submitting data:', {
      currentStep: finalData.current_step,
      hasPhone: !!finalData.phone,
      hasBusinessName: !!finalData.business_name,
      hasLocation: !!(finalData.location_latitude && finalData.location_longitude),
      specialtiesCount: finalData.specialties.length,
    });

    router.post(route('expert.onboarding.complete'), finalData, {
      onSuccess: () => {
        console.log('🎉 Onboarding completed!');
      },
      onError: (errors) => {
        console.error('❌ Completion failed:', errors);
      },
    });
  };

  // ✅ Handle step change without backend save (NOT NEEDED ANYMORE since Continue button works)
  const handleStepChange = (step: number) => {
    console.log(`📍 Changing step locally to ${step} (no backend save)`);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current step component
  const renderStep = () => {
    const stepProps = {
      data,
      setData: updateData,
      errors,
      nextStep,
      previousStep,
      onStepChange: handleStepChange, // Pass for compatibility (but won't be used)
    };

    // ✅ FIX: Convert arrays to Record format that child components expect
    const businessTypesRecord = Array.isArray(businessTypes)
      ? Object.fromEntries(businessTypes.map(bt => [bt.value, bt.label]))
      : businessTypes;

    const specialtiesRecord = Array.isArray(availableSpecialties)
      ? Object.fromEntries(availableSpecialties.map(s => [s.value, s.label]))
      : availableSpecialties;

    switch (currentStep) {
      case 1:
        return <BasicInfoStep
          {...stepProps}
          businessTypes={businessTypesRecord}
        />;
      case 2:
        return <LocationStep {...stepProps} mapsLoaded={mapsLoaded} />;
      case 3:
        return <ServicesStep {...stepProps} availableSpecialties={specialtiesRecord} />;
      case 4:
        return <PricingStep {...stepProps} />;
      case 5:
        return <OperatingHoursStep {...stepProps} />;
      default:
        return <BasicInfoStep
          {...stepProps}
          businessTypes={businessTypesRecord}
        />;
    }
  };

  return (
    <>
      <Head title="Complete Your Profile" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  Complete Your Profile
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Step {currentStep} of 5: {steps[currentStep - 1]?.title}
                </p>
              </div>

              {/* Save & Exit Button */}
              <button
                type="button"
                onClick={handleSaveAndExit}
                disabled={isSaving || processing}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save & Exit'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Error Message (Google Maps) */}
          {mapsError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                    Google Maps Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {mapsError.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 px-2">
                  Setup Steps
                </h3>
                <nav className="space-y-1">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const hasData = hasStepData(step.number);
                    const isCurrent = currentStep === step.number;
                    const isAccessible = step.number <= currentStep || hasData;

                    return (
                      <button
                        key={step.number}
                        onClick={() => isAccessible && goToStep(step.number)}
                        disabled={!isAccessible}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${isCurrent
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : hasData
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            : 'opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${hasData
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : isCurrent
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                        >
                          {hasData ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Icon
                              className={`w-5 h-5 ${isCurrent
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${isCurrent
                              ? 'text-blue-900 dark:text-blue-100'
                              : hasData
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500'
                              }`}
                          >
                            {step.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step Content with Animation */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
                  <AnimatePresence mode="wait">
                    {renderStep()}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  {/* Previous Button */}
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={previousStep}
                      disabled={processing}
                      whileHover={{ scale: processing ? 1 : 1.02 }}
                      whileTap={{ scale: processing ? 1 : 0.98 }}
                      className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Back</span>
                      </div>
                    </motion.button>
                  )}

                  {/* Next / Complete Button */}
                  {currentStep < 5 ? (
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        console.log(`🔵 Continue button clicked on step ${currentStep}`);
                        e.preventDefault(); // ✅ Prevent any default behavior
                        e.stopPropagation(); // ✅ Stop event bubbling

                        // Additional check to prevent accidental submission
                        if (currentStep < 5) {
                          console.log(`📍 Moving from step ${currentStep} to ${currentStep + 1}`);
                          nextStep();
                        } else {
                          console.warn('⚠️ Already on final step, use Complete button instead');
                        }
                      }}
                      disabled={!isStepComplete(currentStep) || processing}
                      whileHover={{
                        scale: !isStepComplete(currentStep) || processing ? 1 : 1.02,
                      }}
                      whileTap={{
                        scale: !isStepComplete(currentStep) || processing ? 1 : 0.98,
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span>Continue</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={processing}
                      whileHover={{ scale: processing ? 1 : 1.02 }}
                      whileTap={{ scale: processing ? 1 : 0.98 }}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{processing ? 'Completing...' : 'Complete Profile'}</span>
                      </div>
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Auto-save indicator */}
              {isSaving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  💾 Saving progress...
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}