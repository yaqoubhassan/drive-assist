import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm } from 'react-hook-form';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import CategorySelector from '@/Components/diagnose/CategorySelector';
import DescriptionInput from '@/Components/diagnose/DescriptionInput';
import ImageUploader from '@/Components/diagnose/ImageUploader';
import VoiceRecorder from '@/Components/diagnose/VoiceRecorder';
import VehicleDetails from '@/Components/diagnose/VehicleDetails';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

// Validation schema
const diagnosisSchema = z.object({
  category: z.enum(['engine', 'brakes', 'electrical', 'transmission', 'tires', 'other'], {
    error: 'Please select a category',
  }),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
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
    };
  };
}

export default function Create({ auth }: PageProps) {
  const [currentStep, setCurrentStep] = useState(1);
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

  const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

  return (
    <Layout>
      <Head title="Diagnose Your Car Issue" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Diagnose Your Car Issue
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tell us what's wrong and get instant AI-powered analysis
            </p>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
              {/* Step 1: Category Selection */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    What type of issue are you experiencing?
                  </h2>
                </div>

                <CategorySelector
                  value={category}
                  onChange={(value) => syncFormData('category', value)}
                  error={errors.category?.message}
                />
              </motion.div>

              {/* Step 2: Description */}
              <AnimatePresence mode="wait">
                {category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">
                        2
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Describe the problem
                      </h2>
                    </div>

                    <DescriptionInput
                      value={description}
                      onChange={(value) => syncFormData('description', value)}
                      error={errors.description?.message}
                    />

                    {/* Voice Recorder */}
                    <div className="mt-4">
                      <VoiceRecorder
                        onTranscript={(transcript) => {
                          const newDescription = description
                            ? `${description} ${transcript}`
                            : transcript;
                          syncFormData('description', newDescription);
                        }}
                        onAudioUrl={(url) => syncFormData('voice_note_url', url)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Images (Optional) */}
              <AnimatePresence mode="wait">
                {category && description && description.length >= 20 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Add photos (Optional)
                        </h2>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Optional
                      </span>
                    </div>

                    <ImageUploader
                      images={images}
                      onChange={(files) => syncFormData('images', files)}
                      error={errors.images?.message}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4: Vehicle Details (Optional) */}
              <AnimatePresence mode="wait">
                {category && description && description.length >= 20 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold mr-3">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Vehicle information
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowVehicleDetails(!showVehicleDetails)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {showVehicleDetails ? 'Hide' : 'Add vehicle details'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showVehicleDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <AnimatePresence>
                {category && description && description.length >= 20 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <button
                      type="submit"
                      disabled={processing || !isValid}
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <span className="mr-2">Get AI Diagnosis</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Trust Indicators */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span>Free diagnosis</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span>Instant results</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span>No account needed</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help?{' '}
              <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">
                View troubleshooting tips
              </a>{' '}
              or{' '}
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                contact support
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}