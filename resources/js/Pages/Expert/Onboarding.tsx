import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

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
  const [currentStep, setCurrentStep] = useState(expert.current_step || 1);
  const [isSaving, setIsSaving] = useState(false);

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
      case 4: // Pricing - optional but encourage completion
        // Complete if they've entered ANY pricing info OR moved past this step
        return (
          !!(data.hourly_rate_min || data.hourly_rate_max || data.diagnostic_fee) ||
          currentStep > 4
        );
      case 5: // Hours - optional but encourage completion
        // Complete if they've entered ANY operating hours OR moved past this step
        const hasAnyHours = [
          'monday', 'tuesday', 'wednesday', 'thursday',
          'friday', 'saturday', 'sunday'
        ].some(day => {
          const openKey = `${day}_open` as keyof ExpertData;
          const closeKey = `${day}_close` as keyof ExpertData;
          return !!(data[openKey] || data[closeKey]);
        });
        return hasAnyHours || currentStep > 5;
      default:
        return false;
    }
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (steps.filter((s) => isStepComplete(s.number)).length / steps.length) * 100
  );

  // Navigate to a specific step
  const goToStep = (step: number) => {
    if (step > currentStep + 1) {
      return;
    }
    setCurrentStep(step);
    saveProgress(step); // ✅ Auto-saves without logout
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation handlers
  const nextStep = () => {
    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveProgress(next); // ✅ Auto-saves without logout
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ FIX: Save progress using Inertia router for proper CSRF handling
  const saveProgress = async (step?: number) => {
    if (isSaving || processing) {
      return;
    }

    setIsSaving(true);

    const updatedData = {
      ...data,
      current_step: step || currentStep,
    };

    console.log('💾 Auto-saving progress for step:', step || currentStep);

    // ✅ Use save-progress endpoint (doesn't logout)
    router.post(
      route('expert.onboarding.save-progress'), // ✅ Changed route
      updatedData,
      {
        preserveScroll: true,
        preserveState: true, // ✅ Changed to true - we're NOT logging out
        onSuccess: () => {
          console.log('✅ Progress auto-saved');
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

  // ✅ FIX: Handle "Save & Exit" button click - explicit save with logout
  const handleSaveAndExit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving || processing) {
      return;
    }

    console.log('🚪 Save & Exit clicked - saving and logging out...');
    setIsSaving(true);

    const dataToSave = {
      ...data,
      current_step: currentStep,
    };

    // ✅ Use save endpoint (logs out)
    router.post(
      route('expert.onboarding.save'), // ✅ Different route
      dataToSave,
      {
        preserveScroll: false,
        preserveState: false, // ✅ false because we're logging out
        replace: true,
        onSuccess: () => {
          console.log('✅ Save & Exit successful');
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

  // Form submission - ONLY for step 5 completion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 5) {
      return;
    }

    post(route('expert.onboarding.complete'));
  };

  const handleStepChange = (step: number) => {
    console.log('📍 Changing step locally (no save):', step);
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
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} businessTypes={businessTypes} />;
      case 2:
        return <LocationStep {...stepProps} mapsLoaded={mapsLoaded} />;
      case 3:
        return <ServicesStep {...stepProps} availableSpecialties={availableSpecialties} />;
      case 4:
        return <PricingStep {...stepProps} onStepChange={handleStepChange} />;
      case 5:
        return <OperatingHoursStep {...stepProps} />;
      default:
        return <BasicInfoStep {...stepProps} businessTypes={businessTypes} />;
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
                  Set up your expert profile to start receiving job requests
                </p>
              </div>

              {/* Progress Badge - Desktop */}
              <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12">
                    <svg className="transform -rotate-90 w-12 h-12">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercentage / 100)}`}
                        className="text-blue-600 dark:text-blue-500 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Step {currentStep} of 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="sm:hidden mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step {currentStep} of 5
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Google Maps Error */}
          {error && (
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
                    {error.message}
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
                    const isCompleted = isStepComplete(step.number);
                    const isCurrent = currentStep === step.number;
                    const isAccessible = step.number <= currentStep || isCompleted;

                    return (
                      <button
                        key={step.number}
                        onClick={() => isAccessible && goToStep(step.number)}
                        disabled={!isAccessible}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${isCurrent
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : isCompleted
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            : 'opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isCompleted
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : isCurrent
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                        >
                          {isCompleted ? (
                            <CheckIcon
                              className="w-5 h-5 text-green-600 dark:text-green-400 font-bold"
                              strokeWidth={3}
                            />
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
                              : isCompleted
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {isCompleted ? 'Completed' : isCurrent ? 'In progress' : 'Pending'}
                          </p>
                        </div>
                        {isCurrent && (
                          <div className="flex-shrink-0 w-1.5 h-8 bg-blue-600 dark:bg-blue-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Mobile Stepper */}
            <div className="lg:hidden mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = isStepComplete(step.number);
                    const isCurrent = currentStep === step.number;
                    const isAccessible = step.number <= currentStep || isCompleted;

                    return (
                      <React.Fragment key={step.number}>
                        <button
                          onClick={() => isAccessible && goToStep(step.number)}
                          disabled={!isAccessible}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                              ? 'bg-green-500 dark:bg-green-600'
                              : isCurrent
                                ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50'
                                : 'bg-gray-200 dark:bg-gray-700'
                              } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                          >
                            {isCompleted ? (
                              <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
                            ) : (
                              <span
                                className={`text-sm sm:text-base font-bold ${isCurrent ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                                  }`}
                              >
                                {step.number}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium text-center max-w-[60px] sm:max-w-[80px] leading-tight ${isCurrent
                              ? 'text-blue-600 dark:text-blue-400'
                              : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            Step {step.number}
                          </span>
                        </button>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                          <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                              initial={{ width: '0%' }}
                              animate={{
                                width: currentStep > step.number ? '100%' : '0%',
                              }}
                              transition={{ duration: 0.4, ease: 'easeInOut' }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="p-6 sm:p-8"
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* ✅ UPDATED: Save & Exit - Now uses handleSaveAndExit */}
                      <motion.button
                        type="button"
                        onClick={handleSaveAndExit}
                        disabled={processing || isSaving}
                        whileHover={{ scale: processing || isSaving ? 1 : 1.02 }}
                        whileTap={{ scale: processing || isSaving ? 1 : 0.98 }}
                        className="group relative px-5 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isSaving ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5"
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
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span>Save & Exit</span>
                            </>
                          )}
                        </div>
                      </motion.button>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Navigation Buttons */}
                      <div className="flex items-center gap-3">
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
                            onClick={nextStep}
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
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              {processing ? (
                                <>
                                  <svg
                                    className="animate-spin h-5 w-5"
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
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  <span>Completing...</span>
                                </>
                              ) : (
                                <>
                                  <CheckIcon className="w-5 h-5" strokeWidth={2.5} />
                                  <span>Complete Profile</span>
                                </>
                              )}
                            </div>
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Help Text */}
                    {!isStepComplete(currentStep) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                      >
                        <svg
                          className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Please complete all required fields to continue
                        </p>
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center flex flex-wrap items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Need help?{' '}
                <a
                  href="mailto:support@driveassist.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Auto-save Indicator */}
          <AnimatePresence>
            {isSaving && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
              >
                <svg
                  className="animate-spin h-5 w-5"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="font-medium">Saving progress...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div >
    </>
  );
}