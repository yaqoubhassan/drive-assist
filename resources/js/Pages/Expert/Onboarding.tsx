import { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
    initMap?: () => void;
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
  const [locationMethod, setLocationMethod] = useState<'autocomplete' | 'map'>('autocomplete');
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  const { data, setData, post, processing, errors } = useForm({
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
  }, [currentStep]);

  // ✅ FIX 1: Load Google Maps Script with async/defer and callback
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return; // Already loaded
    }

    // Create callback function
    window.initMap = () => {
      setMapsLoaded(true);
      console.log('Google Maps loaded successfully');
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places&callback=initMap&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  // ✅ FIX 2: Initialize Google Places Autocomplete when Maps is loaded
  useEffect(() => {
    if (!mapsLoaded || !autocompleteRef.current || autocompleteInstance.current) {
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }, [mapsLoaded, currentStep]);

  // ✅ FIX 3: Initialize Google Map when ready
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || currentStep !== 2 || locationMethod !== 'map') {
      return;
    }

    if (mapInstance.current) {
      return; // Already initialized
    }

    try {
      const initialCenter = {
        lat: data.location_latitude || 5.6037,
        lng: data.location_longitude || -0.1870,
      };

      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Add click listener
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          setData((prev) => ({
            ...prev,
            location_latitude: lat,
            location_longitude: lng,
          }));

          updateMarker(lat, lng);

          // Reverse geocode to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setData('business_address', results[0].formatted_address);
            }
          });
        }
      });

      mapInstance.current = map;

      // Add marker if location exists
      if (data.location_latitude && data.location_longitude) {
        updateMarker(data.location_latitude, data.location_longitude);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapsLoaded, currentStep, locationMethod]);

  const updateMarker = (lat: number, lng: number) => {
    if (!mapInstance.current) return;

    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }

    try {
      markerInstance.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: 'Your Business Location',
      });
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  const handleUseCurrentLocation = () => {
    const button = document.getElementById('use-location-btn');
    if (button) {
      button.textContent = 'Getting location...';
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

        // Reverse geocode to get address
        if (mapsLoaded) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setData('business_address', results[0].formatted_address);
              }

              if (button) {
                button.textContent = '✓ Location Set';
                setTimeout(() => {
                  button.textContent = '📍 Use My Current Location';
                  (button as HTMLButtonElement).disabled = false;
                }, 2000);
              }
            }
          );
        }

        // Update map
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          updateMarker(lat, lng);
        }
      },
      (error) => {
        let errorMessage = 'Error getting location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location permission denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location unavailable.';
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

  const handleSaveAndExit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    post(route('expert.onboarding.save'), {
      preserveScroll: true,
    });
  };

  // ✅ FIX 4: Prevent form submission when clicking Next
  const handleNextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ FIX 5: Only submit when on step 5
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit if we're on step 5
    if (currentStep !== 5) {
      console.log('Not submitting - not on final step');
      return;
    }

    console.log('Submitting onboarding completion...');
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

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+233 XX XXX XXXX"
                        required
                      />
                      {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John's Auto Repair"
                          required
                        />
                        {errors.business_name && <p className="mt-2 text-sm text-red-600">{errors.business_name}</p>}
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
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select a business type</option>
                          {Object.entries(businessTypes).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        {errors.business_type && <p className="mt-2 text-sm text-red-600">{errors.business_type}</p>}
                      </div>
                    </div>

                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                      {/* Years of Experience */}
                      <div>
                        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Years of Experience (Optional)
                        </label>
                        <input
                          id="years_experience"
                          type="number"
                          min="0"
                          max="99"
                          value={data.years_experience || ''}
                          onChange={(e) => setData('years_experience', parseInt(e.target.value) || null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10"
                        />
                      </div>

                      {/* Employee Count */}
                      <div>
                        <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number of Employees (Optional)
                        </label>
                        <input
                          id="employee_count"
                          type="number"
                          min="1"
                          max="999"
                          value={data.employee_count || ''}
                          onChange={(e) => setData('employee_count', parseInt(e.target.value) || null)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="5"
                        />
                      </div>
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
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell customers about your business..."
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                        {data.bio.length} / 500 characters
                      </p>
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
                        Help customers find you by providing your business address
                      </p>
                    </div>

                    {/* Location Method Toggle */}
                    <div className="flex gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setLocationMethod('autocomplete')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${locationMethod === 'autocomplete'
                          ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                          }`}
                      >
                        🔍 Search Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationMethod('map')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${locationMethod === 'map'
                          ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                          }`}
                      >
                        📍 Use Map
                      </button>
                    </div>

                    {/* Autocomplete Search */}
                    {locationMethod === 'autocomplete' && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Business Address *
                          </label>
                          <input
                            ref={autocompleteRef}
                            id="business_address"
                            type="text"
                            value={data.business_address}
                            onChange={(e) => setData('business_address', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Start typing your address..."
                            required
                          />
                          {errors.business_address && <p className="mt-2 text-sm text-red-600">{errors.business_address}</p>}
                        </div>

                        <button
                          type="button"
                          id="use-location-btn"
                          onClick={handleUseCurrentLocation}
                          className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
                        >
                          📍 Use My Current Location
                        </button>
                      </div>
                    )}

                    {/* Map View */}
                    {locationMethod === 'map' && (
                      <div className="space-y-4">
                        <div
                          ref={mapRef}
                          className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click on the map to set your business location
                        </p>
                        {data.business_address && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>Selected:</strong> {data.business_address}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

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
                        className="w-full"
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
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                              {data.specialties.includes(value) && (
                                <CheckCircleSolid className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.specialties && <p className="mt-2 text-sm text-red-600">{errors.specialties}</p>}
                    {data.specialties.length === 0 && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Please select at least one specialty
                      </p>
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
                        Set your rates (all fields are optional)
                      </p>
                    </div>

                    {/* Hourly Rate Range */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="hourly_rate_min" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hourly Rate (Min)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
                          <input
                            id="hourly_rate_min"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.hourly_rate_min || ''}
                            onChange={(e) => setData('hourly_rate_min', parseFloat(e.target.value) || null)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="50.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="hourly_rate_max" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hourly Rate (Max)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
                          <input
                            id="hourly_rate_max"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.hourly_rate_max || ''}
                            onChange={(e) => setData('hourly_rate_max', parseFloat(e.target.value) || null)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="150.00"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic Fee */}
                    <div>
                      <label htmlFor="diagnostic_fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Diagnostic Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">GH₵</span>
                        <input
                          id="diagnostic_fee"
                          type="number"
                          min="0"
                          step="0.01"
                          value={data.diagnostic_fee || ''}
                          onChange={(e) => setData('diagnostic_fee', parseFloat(e.target.value) || null)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="75.00"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Fee for initial vehicle inspection and diagnosis
                      </p>
                    </div>

                    {/* Emergency Service */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Accept Emergency Calls
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Available for urgent after-hours service
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setData('accepts_emergency', !data.accepts_emergency)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.accepts_emergency ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.accepts_emergency ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
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
                        Set your business hours (all optional)
                      </p>
                    </div>

                    {/* Days of Week */}
                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                      <div key={day} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {day}
                          </h3>
                          {day !== 'sunday' && (
                            <button
                              type="button"
                              onClick={() => applyToAllDays(day)}
                              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              Apply to all
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Open
                            </label>
                            <input
                              type="time"
                              value={data[`${day}_open`] || ''}
                              onChange={(e) => setData(`${day}_open`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Close
                            </label>
                            <input
                              type="time"
                              value={data[`${day}_close`] || ''}
                              onChange={(e) => setData(`${day}_close`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
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
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={processing || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center disabled:cursor-not-allowed"
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