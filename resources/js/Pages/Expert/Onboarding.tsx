import { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon as CheckCircleSolid,
  BookmarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';

// Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

interface OnboardingProps {
  expert: {
    current_step: number;
    phone: string;
    business_name: string;
    business_type: string;
    bio: string | null;
    years_experience: number | null;
    employee_count: number | null;
    service_radius_km: number;
    business_address: string;
    location_latitude: number | null;
    location_longitude: number | null;
    specialties: string[];
    hourly_rate_min: number | null;
    hourly_rate_max: number | null;
    diagnostic_fee: number | null;
    accepts_emergency: boolean;
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
  };
  businessTypes: Record<string, string>;
  availableSpecialties: Record<string, string>;
}

export default function Onboarding({ expert, businessTypes, availableSpecialties }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(expert.current_step);
  const [locationMethod, setLocationMethod] = useState<'search' | 'map'>('search');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    current_step: currentStep,
    phone: expert.phone || '',
    business_name: expert.business_name || '',
    business_type: expert.business_type || 'mechanic',
    bio: expert.bio || '',
    years_experience: expert.years_experience || null,
    employee_count: expert.employee_count || null,
    service_radius_km: expert.service_radius_km || 25,
    business_address: expert.business_address || '',
    location_latitude: expert.location_latitude || null,
    location_longitude: expert.location_longitude || null,
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

  // Update current_step in form data when currentStep changes
  useEffect(() => {
    setData('current_step', currentStep);
  }, [currentStep]);

  // Load Google Maps Script
  useEffect(() => {
    if (window.google && window.google.maps) {
      return; // Already loaded
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!autocompleteRef.current || !window.google || !window.google.maps) return;
    if (autocompleteInstance.current) return; // Already initialized

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
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
  }, [currentStep]);

  // Initialize Google Map
  useEffect(() => {
    // Only initialize when on step 2 and Google Maps is loaded
    if (!window.google || !window.google.maps || currentStep !== 2 || locationMethod !== 'map') return;
    if (!mapRef.current) return;
    if (mapInstance.current) return; // Already initialized

    const defaultLat = data.location_latitude || 40.7128;
    const defaultLng = data.location_longitude || -74.0060;

    const map = new window.google.maps.Map(mapRef.current, {
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
  }, [currentStep, locationMethod]);

  const updateMarker = (lat: number, lng: number) => {
    if (!mapInstance.current || !window.google) return;

    // Remove old marker
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }

    // Create new marker
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      animation: window.google.maps.Animation.DROP,
      title: 'Your Business Location',
    });

    markerInstance.current = marker;
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();

    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results[0]) {
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

    const button = document.getElementById('detect-location-btn');
    if (button) {
      button.textContent = 'Detecting...';
      (button as HTMLButtonElement).disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setData((prev) => ({
          ...prev,
          location_latitude: lat,
          location_longitude: lng,
        }));

        // Update map center and marker
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(15);
          updateMarker(lat, lng);
        }

        // Get address from coordinates
        reverseGeocode(lat, lng);

        if (button) {
          button.textContent = '📍 Use My Current Location';
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

        if (button) {
          button.textContent = '📍 Use My Current Location';
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
    });
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
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
    { number: 4, title: 'Pricing', icon: CurrencyDollarIcon },
    { number: 5, title: 'Hours', icon: ClockIcon },
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!(data.phone && data.business_name && data.business_type);
      case 2:
        return !!(data.business_address && data.location_latitude && data.location_longitude);
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

  const applyToAllDays = (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday') => {
    const openTime = data[`${day}_open`];
    const closeTime = data[`${day}_close`];

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const updates: any = {};

    days.forEach(d => {
      updates[`${d}_open`] = openTime;
      updates[`${d}_close`] = closeTime;
    });

    setData(prev => ({ ...prev, ...updates }));
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
              Step {currentStep} of 5 • You can save and continue later
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
                      <p
                        className={`text-sm font-medium ${currentStep === step.number || isStepComplete(step.number)
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                          }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 -mt-8 ${isStepComplete(step.number) ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    />
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
                        Let's start with your contact details and business information
                      </p>
                    </div>

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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="(555) 123-4567"
                        required
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Tell potential customers about your expertise and what makes your business special..."
                      />
                      {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                    </div>

                    {/* Years of Experience & Employee Count */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Years of Experience
                        </label>
                        <input
                          id="years_experience"
                          type="number"
                          value={data.years_experience || ''}
                          onChange={(e) => setData('years_experience', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          min="0"
                          max="99"
                        />
                      </div>
                      <div>
                        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number of Employees
                        </label>
                        <input
                          id="employee_count"
                          type="number"
                          value={data.employee_count || ''}
                          onChange={(e) => setData('employee_count', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          min="1"
                        />
                      </div>
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
                          <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            id="business_address"
                            ref={autocompleteRef}
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
                          Click on the map to set your location
                        </label>
                        <div
                          ref={mapRef}
                          className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                        />
                        {data.business_address && (
                          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            📍 Selected: {data.business_address}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Service Radius */}
                    <div>
                      <label htmlFor="service_radius_km" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Service Radius (km)
                      </label>
                      <input
                        id="service_radius_km"
                        type="number"
                        value={data.service_radius_km}
                        onChange={(e) => setData('service_radius_km', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="5"
                        max="100"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        How far are you willing to travel for service calls?
                      </p>
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
                        Services & Specialties
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Select the services you offer (select at least one)
                      </p>
                    </div>

                    {/* Specialties Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(availableSpecialties).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleSpecialty(value)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${data.specialties.includes(value)
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                            }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mr-3 ${data.specialties.includes(value)
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                              {data.specialties.includes(value) && (
                                <CheckCircleSolid className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {label}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {errors.specialties && (
                      <p className="text-sm text-red-600">{errors.specialties}</p>
                    )}

                    {data.specialties.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✓ {data.specialties.length} {data.specialties.length === 1 ? 'specialty' : 'specialties'} selected
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Pricing Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help customers understand your rates (all optional)
                      </p>
                    </div>

                    {/* Hourly Rate Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minimum Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={data.hourly_rate_min || ''}
                          onChange={(e) => setData('hourly_rate_min', e.target.value ? parseFloat(e.target.value) : null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          step="0.01"
                          min="0"
                          placeholder="75.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Maximum Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={data.hourly_rate_max || ''}
                          onChange={(e) => setData('hourly_rate_max', e.target.value ? parseFloat(e.target.value) : null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          step="0.01"
                          min="0"
                          placeholder="150.00"
                        />
                      </div>
                    </div>

                    {/* Diagnostic Fee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Diagnostic Fee ($)
                      </label>
                      <input
                        type="number"
                        value={data.diagnostic_fee || ''}
                        onChange={(e) => setData('diagnostic_fee', e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        step="0.01"
                        min="0"
                        placeholder="75.00"
                      />
                    </div>

                    {/* Emergency Service */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="accepts_emergency"
                        checked={data.accepts_emergency}
                        onChange={(e) => setData('accepts_emergency', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor="accepts_emergency" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        I accept emergency service calls
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Operating Hours */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Operating Hours
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Set your business hours (optional - you can update these later)
                      </p>
                    </div>

                    {/* Days of the week */}
                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-32">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {day}
                          </p>
                        </div>
                        <input
                          type="time"
                          value={data[`${day}_open`] || ''}
                          onChange={(e) => setData(`${day}_open`, e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={data[`${day}_close`] || ''}
                          onChange={(e) => setData(`${day}_close`, e.target.value)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => applyToAllDays(day)}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Apply to all
                        </button>
                      </div>
                    ))}
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
                {currentStep < 5 ? (
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
                    disabled={processing || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)}
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
            Nee help? <a href="mailto:support@driveassist.com" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </>
  );
}