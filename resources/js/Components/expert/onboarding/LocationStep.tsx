import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGoogleAutocomplete, useGoogleMap } from '@/hooks/useGoogleMaps';
import type { ExpertData } from '@/types/expert-onboarding';

interface LocationStepProps {
  data: ExpertData;
  setData: (updates: Partial<ExpertData>) => void;
  errors: Partial<Record<keyof ExpertData, string>>;
  mapsLoaded: boolean;
}

export default function LocationStep({
  data,
  setData,
  errors,
  mapsLoaded,
}: LocationStepProps) {
  const [locationMethod, setLocationMethod] = useState<'autocomplete' | 'map'>(
    'autocomplete'
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [inputValue, setInputValue] = useState(data.business_address || '');

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Update local input value when data changes from external source
  useEffect(() => {
    if (data.business_address && data.business_address !== inputValue) {
      setInputValue(data.business_address);
    }
  }, [data.business_address]);

  // Setup autocomplete with proper place selection handler
  useGoogleAutocomplete({
    inputRef: autocompleteRef,
    mapsLoaded,
    onPlaceSelected: (place) => {
      console.log('🎯 Place selected callback triggered:', place);

      if (!place.geometry || !place.geometry.location) {
        console.error('❌ Place missing geometry');
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || '';

      console.log('📍 Updating location:', { address, lat, lng });

      // Update both local state and parent state immediately
      setInputValue(address);
      setData({
        business_address: address,
        location_latitude: lat,
        location_longitude: lng,
      });
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: ['us', 'gh', 'gb'] },
    },
  });

  // Setup map
  useGoogleMap({
    mapRef,
    mapsLoaded,
    center: data.location_latitude && data.location_longitude
      ? { lat: data.location_latitude, lng: data.location_longitude }
      : undefined,
    onLocationSelected: ({ lat, lng, address }) => {
      console.log('🗺️ Map location selected:', { address, lat, lng });

      setData({
        business_address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        location_latitude: lat,
        location_longitude: lng,
      });

      if (address) {
        setInputValue(address);
      }
    },
  });

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log('📍 Got current location:', { lat, lng });

        // Reverse geocode to get address
        if (mapsLoaded && window.google && window.google.maps) {
          try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({
              location: { lat, lng },
            });

            if (response.results[0]) {
              const address = response.results[0].formatted_address;
              console.log('🏠 Geocoded address:', address);

              setInputValue(address);
              setData({
                business_address: address,
                location_latitude: lat,
                location_longitude: lng,
              });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            alert('Failed to get address for your location');
          }
        } else {
          // If geocoding fails, just use coordinates
          const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setInputValue(coordAddress);
          setData({
            business_address: coordAddress,
            location_latitude: lat,
            location_longitude: lng,
          });
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Failed to get your location. Please enter your address manually.');
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📍 Business Location
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help customers find you by providing your business address
        </p>
      </div>

      {/* Method Toggle */}
      <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setLocationMethod('autocomplete')}
          disabled={!mapsLoaded}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${locationMethod === 'autocomplete'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          🔍 Search Address
        </button>
        <button
          type="button"
          onClick={() => setLocationMethod('map')}
          disabled={!mapsLoaded}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${locationMethod === 'map'
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          🗺️ Use Map
        </button>
      </div>

      {/* Autocomplete Search */}
      {locationMethod === 'autocomplete' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="business_address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Business Address *
            </label>
            <input
              ref={autocompleteRef}
              id="business_address"
              type="text"
              value={inputValue}
              onChange={(e) => {
                // Update local state for immediate feedback
                const newValue = e.target.value;
                setInputValue(newValue);

                // Also update parent state for manual typing
                // Don't update coordinates when manually typing
                setData({
                  business_address: newValue,
                  // Clear coordinates if manually editing
                  ...(newValue !== data.business_address ? {
                    location_latitude: undefined,
                    location_longitude: undefined,
                  } : {})
                });
              }}
              disabled={!mapsLoaded}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900 transition-all"
              placeholder={
                mapsLoaded
                  ? 'Start typing your address...'
                  : 'Loading Google Maps...'
              }
              autoComplete="off"
              required
            />
            {errors.business_address && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.business_address}
              </p>
            )}
            {mapsLoaded && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                💡 Start typing and select a suggestion from the dropdown
              </p>
            )}
            {!mapsLoaded && (
              <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                ⏳ Loading address search...
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={!mapsLoaded || isGettingLocation}
            className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>
              {isGettingLocation
                ? '⏳ Getting your location...'
                : '📍 Use My Current Location'}
            </span>
          </button>

          {/* Show coordinates when address is set */}
          {data.location_latitude && data.location_longitude && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                ✅ Location Set
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Coordinates: {data.location_latitude.toFixed(6)}, {data.location_longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Map View */}
      {locationMethod === 'map' && (
        <div className="space-y-4">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 overflow-hidden"
          >
            {!mapsLoaded && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  Loading map...
                </p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📌 Click on the map to set your business location
          </p>
          {data.business_address && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Selected Address:
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {data.business_address}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Service Radius */}
      <div>
        <label
          htmlFor="service_radius_km"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Service Radius: <span className="text-blue-600 dark:text-blue-400 font-semibold">{data.service_radius_km} km</span>
        </label>
        <input
          id="service_radius_km"
          type="range"
          min="5"
          max="100"
          step="5"
          value={data.service_radius_km}
          onChange={(e) =>
            setData({ service_radius_km: parseInt(e.target.value) })
          }
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>5 km</span>
          <span>25 km</span>
          <span>50 km</span>
          <span>75 km</span>
          <span>100 km</span>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 This is how far you're willing to travel for jobs
        </p>
      </div>
    </motion.div>
  );
}