import { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

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
    business_address?: string;
    location_latitude?: number;
    location_longitude?: number;
  } | null;
  businessTypes: Record<string, string>;
  availableSpecialties: Record<string, string>;
}

export default function ExpertOnboarding({
  user,
  expertProfile,
  businessTypes,
  availableSpecialties,
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationMethod, setLocationMethod] = useState<'search' | 'map'>('search');

  const addressInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  const { data, setData, post, put, processing, errors } = useForm({
    phone: user.phone || '',
    business_name: expertProfile?.business_name || '',
    business_type: expertProfile?.business_type || 'mechanic',
    bio: expertProfile?.bio || '',
    years_experience: expertProfile?.years_experience || '',
    business_address: expertProfile?.business_address || '',
    location_latitude: expertProfile?.location_latitude || 0,
    location_longitude: expertProfile?.location_longitude || 0,
    service_radius_km: expertProfile?.service_radius_km || 25,
    specialties: expertProfile?.specialties || [],
  });

  // Load Google Maps Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!mapLoaded || !addressInputRef.current || autocompleteInstance.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: ['us', 'gh', 'gb'] },
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setData((prev) => ({
        ...prev,
        business_address: place.formatted_address || '',
        location_latitude: lat,
        location_longitude: lng,
      }));

      // Update map if it exists
      if (mapInstance.current) {
        mapInstance.current.setCenter({ lat, lng });
        updateMarker(lat, lng);
      }
    });

    autocompleteInstance.current = autocomplete;
  }, [mapLoaded]);

  // Initialize Google Map
  useEffect(() => {
    // Only initialize when on step 2 and map is loaded
    if (!mapLoaded || !mapRef.current || currentStep !== 2) return;

    // Don't reinitialize if already exists
    if (mapInstance.current) return;

    const defaultLat = data.location_latitude || 40.7128;
    const defaultLng = data.location_longitude || -74.0060;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    // Add click listener
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        updateMarker(lat, lng);
        reverseGeocode(lat, lng);

        setData((prev) => ({
          ...prev,
          location_latitude: lat,
          location_longitude: lng,
        }));
      }
    });

    // Add initial marker if we have coordinates
    if (data.location_latitude && data.location_longitude) {
      updateMarker(data.location_latitude, data.location_longitude);
    }

    mapInstance.current = map;
  }, [mapLoaded, currentStep]); // Added currentStep dependency

  const updateMarker = (lat: number, lng: number) => {
    if (!mapInstance.current) return;

    // Remove old marker
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }

    // Create new marker
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      animation: google.maps.Animation.DROP,
      title: 'Your Business Location',
    });

    markerInstance.current = marker;
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();

    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        setData((prev) => ({
          ...prev,
          business_address: response.results[0].formatted_address,
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    // Show loading state
    const button = document.getElementById('detect-location-btn');
    if (button) {
      button.textContent = 'Detecting...';
      (button as HTMLButtonElement).disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update form data
        setData((prev) => ({
          ...prev,
          location_latitude: lat,
          location_longitude: lng,
        }));

        // Update map center and marker
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(15); // Zoom in closer
          updateMarker(lat, lng);
        }

        // Get address from coordinates
        reverseGeocode(lat, lng);

        // Reset button
        if (button) {
          button.textContent = '📍 Use My Location';
          (button as HTMLButtonElement).disabled = false;
        }

        // Switch to map view to show the detected location
        setLocationMethod('map');
      },
      (error) => {
        console.error('Geolocation error:', error);

        let errorMessage = 'Could not detect your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
        }

        alert(errorMessage);

        // Reset button
        if (button) {
          button.textContent = '📍 Use My Location';
          (button as HTMLButtonElement).disabled = false;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setData(
      'specialties',
      data.specialties.includes(specialty)
        ? data.specialties.filter((s) => s !== specialty)
        : [...data.specialties, specialty]
    );
  };

  const handleSaveAndExit = () => {
    post(route('expert.onboarding.save'), {
      preserveScroll: true,
      onSuccess: () => {
        router.visit(route('expert.dashboard'), {
          data: { message: 'Progress saved! Complete your profile anytime.' }
        });
      },
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('expert.onboarding.complete'));
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: PhoneIcon },
    { number: 2, title: 'Location', icon: MapPinIcon },
    { number: 3, title: 'Services', icon: WrenchScrewdriverIcon },
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!(data.phone && data.business_name && data.business_type);
      case 2:
        return !!(data.business_address && data.location_latitude && data.location_longitude);
      case 3:
        return data.specialties.length > 0;
      default:
        return false;
    }
  };

  return (
    <>
      <Head title="Complete Your Profile" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <WrenchScrewdriverIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Expert Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Step {currentStep} of 3 • You can save and continue later
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    {/* Step Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.number
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isStepComplete(step.number)
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                        }`}
                    >
                      {isStepComplete(step.number) ? (
                        <CheckCircleSolid className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${currentStep === step.number || isStepComplete(step.number)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                        }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 -mt-8 ${isStepComplete(step.number)
                      ? 'bg-green-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

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
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Basic Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Let's start with your contact details and business name
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="phone"
                          type="tel"
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Business Name */}
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Business Name *
                      </label>
                      <div className="relative">
                        <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="business_name"
                          type="text"
                          value={data.business_name}
                          onChange={(e) => setData('business_name', e.target.value)}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John's Auto Repair"
                          required
                        />
                      </div>
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

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        About Your Business (Optional)
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        maxLength={1000}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell customers about your business, experience, and what makes you special..."
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                        {data.bio.length} / 1000
                      </p>
                    </div>

                    {/* Years Experience */}
                    <div>
                      <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Years of Experience (Optional)
                      </label>
                      <input
                        id="years_experience"
                        type="number"
                        min="0"
                        max="99"
                        value={data.years_experience}
                        onChange={(e) => setData('years_experience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="15"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Business Location
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help customers find you by setting your exact location
                      </p>
                    </div>

                    {/* Auto-detect Location Button */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <button
                        type="button"
                        id="detect-location-btn"
                        onClick={detectCurrentLocation}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                      >
                        📍 Use My Current Location
                      </button>
                      <p className="mt-2 text-xs text-blue-800 dark:text-blue-200 text-center">
                        Click to automatically detect your location
                      </p>
                    </div>

                    {/* Location Method Toggle */}
                    <div className="flex gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setLocationMethod('search')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${locationMethod === 'search'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        🔍 Search Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationMethod('map')}
                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${locationMethod === 'map'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        🗺️ Pick on Map
                      </button>
                    </div>

                    {/* Search Method */}
                    {locationMethod === 'search' && (
                      <div>
                        <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Address *
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="business_address"
                            ref={addressInputRef}
                            type="text"
                            value={data.business_address}
                            onChange={(e) => setData('business_address', e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Start typing your address..."
                            required
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          💡 Start typing and select from suggestions
                        </p>
                        {errors.business_address && <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>}
                      </div>
                    )}

                    {/* Map Method */}
                    {locationMethod === 'map' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Click on the map to set your location *
                        </label>
                        <div
                          ref={mapRef}
                          className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          💡 Click anywhere on the map to set your business location
                        </p>

                        {/* Display selected address */}
                        {data.business_address && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-200">
                              <strong>Selected:</strong> {data.business_address}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Service Radius */}
                    <div>
                      <label htmlFor="service_radius_km" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Radius: {data.service_radius_km} km ({Math.round(data.service_radius_km * 0.621)} miles)
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
                  </motion.div>
                )}

                {/* Step 3: Services & Specialties */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Specialties
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Select the services you offer (choose at least one)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(availableSpecialties).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleSpecialty(value)}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${data.specialties.includes(value)
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
                        ⚠️ Please select at least one specialty
                      </p>
                    )}

                    {/* Preview */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2">
                        ✨ What happens next?
                      </h3>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          Your profile will be reviewed (usually within 24 hours)
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          Once approved, you'll appear in expert searches
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          Start receiving leads from local drivers!
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* Save & Exit */}
                <button
                  type="button"
                  onClick={handleSaveAndExit}
                  disabled={processing}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                >
                  <BookmarkIcon className="w-5 h-5 mr-2" />
                  Save & Exit
                </button>

                <div className="flex-1" />

                {/* Previous */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Previous
                  </button>
                )}

                {/* Next / Submit */}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepComplete(currentStep)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processing || !isStepComplete(3)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    {processing ? 'Submitting...' : 'Complete Profile'}
                    <CheckCircleSolid className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Need help? <a href="mailto:support@driveassist.com" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </>
  );
}