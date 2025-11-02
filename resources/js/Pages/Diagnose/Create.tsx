import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm } from 'react-hook-form';
import GuestLayout from '@/Layouts/GuestLayout';
import DriverLayout from '@/Layouts/DriverLayout';
import FormContainer, { FormSection, FormActions } from '@/Components/diagnose/FormContainer';
import CategorySelector from '@/Components/diagnose/CategorySelector';
import DescriptionInput from '@/Components/diagnose/DescriptionInput';
import ImageUploader from '@/Components/diagnose/ImageUploader';
import VoiceRecorder from '@/Components/diagnose/VoiceRecorder';
import VehicleDetails from '@/Components/diagnose/VehicleDetails';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

// Validation schema
const diagnosisSchema = z.object({
  category: z.enum(['engine', 'brakes', 'electrical', 'transmission', 'tires', 'other'], {
    error: 'Please select a category',
  }),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(700, 'Description must be less than 700 characters'),
  images: z.array(z.instanceof(File)).max(5, 'Maximum 5 images allowed').optional(),
  voice_note_url: z.string().url().optional().or(z.literal('')),
  vehicle_make: z.string().optional(),
  vehicle_model: z.string().optional(),
  vehicle_year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  mileage: z.number().min(0).optional(),
});

type DiagnosisFormData = z.infer<typeof diagnosisSchema>;

interface PageProps {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
      user_type: 'driver' | 'expert' | 'admin';
    };
  };
}

export default function Create({ auth }: PageProps) {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useHookForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisSchema),
    mode: 'onChange',
  });

  const { data, setData, post, processing, errors: serverErrors } = useForm<DiagnosisFormData>({
    category: undefined as any,
    description: '',
    images: [],
    voice_note_url: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: undefined,
    mileage: undefined,
  });

  const category = watch('category');
  const description = watch('description');
  const images = watch('images') || [];

  // Handle form submission
  const onSubmit = (formData: DiagnosisFormData) => {
    post(route('diagnose.store'), {
      onSuccess: () => {
        // Will redirect to results page
      },
    });
  };

  // Sync react-hook-form with Inertia form
  const syncFormData = (field: keyof DiagnosisFormData, value: any) => {
    setValue(field, value);
    setData(field, value);
  };

  // Calculate progress
  const progress = React.useMemo(() => {
    let completed = 0;
    if (category) completed += 25;
    if (description && description.length >= 20) completed += 50;
    if (images.length > 0) completed += 15;
    if (showVehicleDetails && watch('vehicle_make')) completed += 10;
    return Math.min(completed, 100);
  }, [category, description, images, showVehicleDetails]);

  const Layout = auth?.user ? DriverLayout : GuestLayout;

  return (
    <Layout>
      <Head title="Diagnose Your Car Issue" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8 sm:py-12 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 sm:mb-6">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            Diagnose Your Car Issue
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            Tell us what's wrong and get instant AI-powered analysis
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Category Selection */}
          <FormContainer
            title="What type of issue are you experiencing?"
            subtitle="Select the category that best describes your problem"
            stepNumber={1}
            progress={progress}
          >
            <FormSection>
              <CategorySelector
                value={category}
                onChange={(value) => {
                  syncFormData('category', value);
                  trigger('category');
                }}
                error={errors.category?.message}
              />
            </FormSection>
          </FormContainer>

          {/* Step 2: Description */}
          {category && (
            <FormContainer
              title="Describe the issue"
              subtitle="The more details you provide, the better our AI can help"
              stepNumber={2}
            >
              <FormSection>
                <DescriptionInput
                  value={description || ''}
                  onChange={(value) => {
                    syncFormData('description', value);
                    trigger('description');
                  }}
                  error={errors.description?.message}
                  minLength={20}
                  maxLength={700}
                />

                {/* Voice Input */}
                <div className="pt-4">
                  <VoiceRecorder
                    onTranscript={(transcript) => {
                      const newDescription = description
                        ? `${description} ${transcript}`
                        : transcript;
                      syncFormData('description', newDescription);
                      trigger('description');
                    }}
                    onAudioUrl={(url) => {
                      syncFormData('voice_note_url', url);
                    }}
                  />
                </div>
              </FormSection>
            </FormContainer>
          )}

          {/* Step 3: Images (Optional) */}
          {description && description.length >= 20 && (
            <FormContainer
              title="Add photos (Optional)"
              subtitle="Images help our AI provide a more accurate diagnosis"
              stepNumber={3}
            >
              <FormSection>
                <ImageUploader
                  images={images}
                  onChange={(files) => {
                    syncFormData('images', files);
                    trigger('images');
                  }}
                  error={errors.images?.message}
                />
              </FormSection>
            </FormContainer>
          )}

          {/* Vehicle Details (Optional) */}
          {description && description.length >= 20 && (
            <FormContainer
              title="Vehicle details (Optional)"
              subtitle="Help us provide more specific recommendations"
              stepNumber={4}
            >
              <FormSection>
                {!showVehicleDetails ? (
                  <button
                    type="button"
                    onClick={() => setShowVehicleDetails(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Add Vehicle Details</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <VehicleDetails
                    make={watch('vehicle_make')}
                    model={watch('vehicle_model')}
                    year={watch('vehicle_year')}
                    mileage={watch('mileage')}
                    onMakeChange={(value) => syncFormData('vehicle_make', value)}
                    onModelChange={(value) => syncFormData('vehicle_model', value)}
                    onYearChange={(value) => syncFormData('vehicle_year', value)}
                    onMileageChange={(value) => syncFormData('mileage', value)}
                  />
                )}
              </FormSection>
            </FormContainer>
          )}

          {/* Submit Button */}
          {description && description.length >= 20 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <FormActions>
                  <button
                    type="submit"
                    disabled={processing || !isValid}
                    className="flex-1 sm:flex-none sm:min-w-[200px] px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                  >
                    <span>{processing ? 'Analyzing...' : 'Get AI Diagnosis'}</span>
                    {!processing && <ArrowRight className="w-5 h-5" />}
                  </button>

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left flex-1">
                    🔒 Your information is secure and will only be used to diagnose your vehicle issue
                  </p>
                </FormActions>
              </div>
            </motion.div>
          )}
        </form>

        {/* Helpful Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Tips for better results:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Describe when the issue occurs (e.g., when starting, while driving, when braking)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Include any sounds, smells, or warning lights you've noticed</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Add photos of warning lights, leaks, or visible damage</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                <span>Mention any recent services or repairs that might be related</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}