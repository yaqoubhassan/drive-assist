import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface OnboardingProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  expertProfile: {
    business_name: string;
    business_type: string;
    bio: string | null;
    years_experience: number | null;
    service_radius_km: number;
    specialties: string[];
  } | null;
  businessTypes: Record<string, string>;
  availableSpecialties: Record<string, string>;
}

export default function Onboarding({
  user,
  expertProfile,
  businessTypes,
  availableSpecialties,
}: OnboardingProps) {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    phone: user.phone || '',
    business_name: expertProfile?.business_name || '',
    business_type: expertProfile?.business_type || 'mechanic',
    bio: expertProfile?.bio || '',
    years_experience: expertProfile?.years_experience || '',
    business_address: '',
    location_latitude: 0,
    location_longitude: 0,
    service_radius_km: expertProfile?.service_radius_km || 25,
    specialties: expertProfile?.specialties || [],
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!window.google || !addressInputRef.current) return;

    const autocompleteInstance = new google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: ['us', 'gh'] }, // Add your countries
      }
    );

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      setData((prev) => ({
        ...prev,
        business_address: place.formatted_address || '',
        location_latitude: place.geometry!.location!.lat(),
        location_longitude: place.geometry!.location!.lng(),
      }));
    });

    setAutocomplete(autocompleteInstance);
  }, []);

  const toggleSpecialty = (specialty: string) => {
    setData(
      'specialties',
      data.specialties.includes(specialty)
        ? data.specialties.filter((s) => s !== specialty)
        : [...data.specialties, specialty]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('expert.onboarding.complete'));
  };

  return (
    <>
      <Head title="Complete Your Profile" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Expert Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Just a few details to get you started receiving leads
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <PhoneIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                      required
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <BuildingOfficeIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Business Information
                </h2>

                <div className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name *
                    </label>
                    <input
                      id="business_name"
                      type="text"
                      value={data.business_name}
                      onChange={(e) => setData('business_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John's Auto Repair"
                      required
                    />
                    {errors.business_name && <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>}
                  </div>

                  {/* Business Type */}
                  <div>
                    <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type *
                    </label>
                    <select
                      id="business_type"
                      value={data.business_type}
                      onChange={(e) => setData('business_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {Object.entries(businessTypes).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.business_type && <p className="mt-1 text-sm text-red-600">{errors.business_type}</p>}
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience
                    </label>
                    <input
                      id="years_experience"
                      type="number"
                      min="0"
                      max="99"
                      value={data.years_experience}
                      onChange={(e) => setData('years_experience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                    {errors.years_experience && <p className="mt-1 text-sm text-red-600">{errors.years_experience}</p>}
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About Your Business
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={data.bio}
                      onChange={(e) => setData('bio', e.target.value)}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Tell customers about your business..."
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {data.bio.length} / 1000
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Location & Service Area
                </h2>

                <div className="space-y-4">
                  {/* Business Address with Google Places Autocomplete */}
                  <div>
                    <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Address *
                    </label>
                    <input
                      id="business_address"
                      ref={addressInputRef}
                      type="text"
                      value={data.business_address}
                      onChange={(e) => setData('business_address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Start typing your address..."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Start typing and select from the suggestions
                    </p>
                    {errors.business_address && <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>}
                  </div>

                  {/* Service Radius */}
                  <div>
                    <label htmlFor="service_radius_km" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Radius: {data.service_radius_km} km
                    </label>
                    <input
                      id="service_radius_km"
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={data.service_radius_km}
                      onChange={(e) => setData('service_radius_km', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>5 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Specialties *
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select all services you offer
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(availableSpecialties).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleSpecialty(value)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${data.specialties.includes(value)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500'
                        }`}
                    >
                      {data.specialties.includes(value) && (
                        <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
                {errors.specialties && <p className="mt-2 text-sm text-red-600">{errors.specialties}</p>}
                {data.specialties.length === 0 && (
                  <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-500">
                    Please select at least one specialty
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  What happens next?
                </h3>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Your profile will be reviewed (usually within 24 hours)
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Once approved, you'll start appearing in expert searches
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    You'll receive email notifications when drivers contact you
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing || data.specialties.length === 0}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-colors text-lg"
                >
                  {processing ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Load Google Maps Script */}
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`}
        async
        defer
      ></script>
    </>
  );
}