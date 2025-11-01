// resources/js/Pages/Expert/Profile/Edit.tsx
import { useState, FormEvent, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  UserCircleIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ExpertDashboardLayout from '@/Layouts/ExpertDashboardLayout';
import FlashMessages from '@/Components/ui/FlashMessages';

// Import section components
import PersonalInfoSection from './Sections/PersonalInfoSection';
import BusinessDetailsSection from './Sections/BusinessDetailsSection';
import OperatingHoursSection from './Sections/OperatingHoursSection';
import ServicesSection from './Sections/ServicesSection';
import PricingSection from './Sections/PricingSection';
import GallerySection from './Sections/GallerySection';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  location_address: string | null;
  location_latitude: number | null;
  location_longitude: number | null;
}

interface ExpertProfile {
  id: number;
  business_name: string;
  business_type: string;
  bio: string | null;
  years_experience: number | null;
  employee_count: number | null;
  service_radius_km: number;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  diagnostic_fee: number | null;
  accepts_emergency: boolean;
  specialties: string[];
  monday_open: string | null;
  monday_close: string | null;
  tuesday_open: string | null;
  tuesday_close: string | null;
  wednesday_open: string | null;
  wednesday_close: string | null;
  thursday_open: string | null;
  thursday_close: string | null;
  friday_open: string | null;
  friday_close: string | null;
  saturday_open: string | null;
  saturday_close: string | null;
  sunday_open: string | null;
  sunday_close: string | null;
  avg_rating: number;
  total_jobs: number;
  verification_status: string;
}

interface Props {
  user: User;
  expertProfile: ExpertProfile;
}

type Section = 'personal' | 'business' | 'hours' | 'services' | 'pricing' | 'gallery';

const sections = [
  { id: 'personal' as const, name: 'Personal Info', icon: UserCircleIcon },
  { id: 'business' as const, name: 'Business Details', icon: BuildingStorefrontIcon },
  { id: 'hours' as const, name: 'Operating Hours', icon: ClockIcon },
  { id: 'services' as const, name: 'Services & Specialties', icon: WrenchScrewdriverIcon },
  { id: 'pricing' as const, name: 'Pricing', icon: CurrencyDollarIcon },
  { id: 'gallery' as const, name: 'Gallery', icon: PhotoIcon },
];

const businessTypes = [
  { value: 'mechanic', label: 'Auto Mechanic' },
  { value: 'electrician', label: 'Auto Electrician' },
  { value: 'body_shop', label: 'Body Shop' },
  { value: 'mobile_mechanic', label: 'Mobile Mechanic' },
  { value: 'other', label: 'Other' },
];

const specialtyOptions = [
  { value: 'engine', label: 'Engine Repair' },
  { value: 'brakes', label: 'Brakes' },
  { value: 'electrical', label: 'Electrical Systems' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'tires', label: 'Tires & Wheels' },
  { value: 'bodywork', label: 'Bodywork & Paint' },
  { value: 'diagnostics', label: 'Diagnostics' },
  { value: 'maintenance', label: 'General Maintenance' },
  { value: 'air_conditioning', label: 'Air Conditioning' },
  { value: 'suspension', label: 'Suspension' },
  { value: 'exhaust', label: 'Exhaust Systems' },
];

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const formatTimeForInput = (time: string | null): string => {
  if (!time) return '';
  // If time is in HH:MM:SS format, trim to HH:MM (take first 5 characters)
  // If already in HH:MM format, this has no effect
  return time.substring(0, 5);
};

export default function EditProfile({ user, expertProfile }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { data, setData, put, processing, errors, isDirty } = useForm({
    // Personal info
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location_address: user.location_address || '',

    // Business details
    business_name: expertProfile.business_name || '',
    business_type: expertProfile.business_type || 'mechanic',
    bio: expertProfile.bio || '',
    years_experience: expertProfile.years_experience || '',
    employee_count: expertProfile.employee_count || '',
    service_radius_km: expertProfile.service_radius_km || 25,

    // Operating hours
    monday_open: formatTimeForInput(expertProfile.monday_open),
    monday_close: formatTimeForInput(expertProfile.monday_close),
    tuesday_open: formatTimeForInput(expertProfile.tuesday_open),
    tuesday_close: formatTimeForInput(expertProfile.tuesday_close),
    wednesday_open: formatTimeForInput(expertProfile.wednesday_open),
    wednesday_close: formatTimeForInput(expertProfile.wednesday_close),
    thursday_open: formatTimeForInput(expertProfile.thursday_open),
    thursday_close: formatTimeForInput(expertProfile.thursday_close),
    friday_open: formatTimeForInput(expertProfile.friday_open),
    friday_close: formatTimeForInput(expertProfile.friday_close),
    saturday_open: formatTimeForInput(expertProfile.saturday_open),
    saturday_close: formatTimeForInput(expertProfile.saturday_close),
    sunday_open: formatTimeForInput(expertProfile.sunday_open),
    sunday_close: formatTimeForInput(expertProfile.sunday_close),
    // Services & Specialties
    specialties: expertProfile.specialties || [],

    // Pricing
    hourly_rate_min: expertProfile.hourly_rate_min || '',
    hourly_rate_max: expertProfile.hourly_rate_max || '',
    diagnostic_fee: expertProfile.diagnostic_fee || '',
    accepts_emergency: expertProfile.accepts_emergency || false,
  });

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('expert.profile.update'), {
      preserveScroll: true,
      onSuccess: () => setHasUnsavedChanges(false),
    });
  };

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = data.specialties.includes(specialty)
      ? data.specialties.filter(s => s !== specialty)
      : [...data.specialties, specialty];
    setData('specialties', newSpecialties);
  };

  const copyHours = (fromDay: string) => {
    const openKey = `${fromDay}_open` as keyof typeof data;
    const closeKey = `${fromDay}_close` as keyof typeof data;

    daysOfWeek.forEach(day => {
      if (day.key !== fromDay) {
        setData({
          ...data,
          [`${day.key}_open`]: data[openKey],
          [`${day.key}_close`]: data[closeKey],
        });
      }
    });
  };

  // Check if section has errors
  const getSectionErrors = (sectionId: Section) => {
    return Object.keys(errors).some(key => {
      if (sectionId === 'personal') {
        return ['name', 'email', 'phone', 'location_address'].includes(key);
      }
      if (sectionId === 'business') {
        return ['business_name', 'business_type', 'bio', 'years_experience', 'employee_count', 'service_radius_km'].includes(key);
      }
      if (sectionId === 'hours') {
        return key.includes('_open') || key.includes('_close');
      }
      if (sectionId === 'services') {
        return key === 'specialties';
      }
      if (sectionId === 'pricing') {
        return ['hourly_rate_min', 'hourly_rate_max', 'diagnostic_fee'].includes(key);
      }
      return false;
    });
  };

  return (
    <ExpertDashboardLayout>
      <Head title="Edit Profile" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Profile Settings
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your business profile and settings
                </p>
              </div>

              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </motion.div>
              )}
            </div>
          </div>

          <FlashMessages />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:sticky lg:top-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 px-2">
                  Sections
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const hasErrors = getSectionErrors(section.id);

                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 dark:text-gray-500'
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${isActive
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-700 dark:text-gray-300'
                              }`}
                          >
                            {section.name}
                          </p>
                        </div>
                        {hasErrors && (
                          <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                  >
                    {activeSection === 'personal' && (
                      <PersonalInfoSection
                        data={data}
                        setData={setData}
                        errors={errors}
                        user={user}
                      />
                    )}

                    {activeSection === 'business' && (
                      <BusinessDetailsSection
                        data={data}
                        setData={setData}
                        errors={errors}
                        businessTypes={businessTypes}
                      />
                    )}

                    {activeSection === 'hours' && (
                      <OperatingHoursSection
                        data={data}
                        setData={setData}
                        errors={errors}
                        daysOfWeek={daysOfWeek}
                        copyHours={copyHours}
                      />
                    )}

                    {activeSection === 'services' && (
                      <ServicesSection
                        data={data}
                        errors={errors}
                        specialtyOptions={specialtyOptions}
                        toggleSpecialty={toggleSpecialty}
                      />
                    )}

                    {activeSection === 'pricing' && (
                      <PricingSection
                        data={data}
                        setData={setData}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'gallery' && (
                      <GallerySection expertProfile={expertProfile} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Save Button - Not Fixed, Regular Flow */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div>
                      {hasUnsavedChanges ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You have unsaved changes
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          All changes saved
                        </p>
                      )}
                    </div>
                    <motion.button
                      type="submit"
                      disabled={processing || !hasUnsavedChanges}
                      whileHover={{ scale: processing ? 1 : 1.02 }}
                      whileTap={{ scale: processing ? 1 : 0.98 }}
                      className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 transition-all overflow-hidden"
                    >
                      {processing && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        </motion.div>
                      )}
                      <div className={`relative flex items-center gap-2 ${processing ? 'opacity-0' : ''}`}>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Save Changes</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ExpertDashboardLayout>
  );
}