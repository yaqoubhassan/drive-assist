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
    setInputValue(data.business_address || '');
  }, [data.business_address]);

  // Setup autocomplete
  useGoogleAutocomplete({
    inputRef: autocompleteRef,
    mapsLoaded,
    onPlaceSelected: (place) => {
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || '';

      console.log('Place selected in LocationStep:', { address, lat, lng });

      // Update both local state and parent state
      setInputValue(address);
      setData({
        business_address: address,
        location_latitude: lat,
        location_longitude: lng,
      });

      // Update map if it exists
      if (mapInstance) {
        recenterMap(lat, lng);
        updateMarker(lat, lng);
      }
    },
  });

  // Setup map
  const { mapInstance, updateMarker, recenterMap } = useGoogleMap({
    mapRef,
    mapsLoaded,
    center: {
      lat: data.location_latitude || 5.6037,
      lng: data.location_longitude || -0.187,
    },
    zoom: 15,
    onMapClick: (lat, lng) => {
      setData({
        location_latitude: lat,
        location_longitude: lng,
      });

      updateMarker(lat, lng);

      // Reverse geocode to get address
      if (mapsLoaded && window.google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setData({ business_address: results[0].formatted_address });
            }
          }
        );
      }
    },
  });

  // Update marker when location changes
  useEffect(() => {
    if (
      data.location_latitude &&
      data.location_longitude &&
      mapInstance &&
      locationMethod === 'map'
    ) {
      updateMarker(data.location_latitude, data.location_longitude);
    }
  }, [data.location_latitude, data.location_longitude, mapInstance, locationMethod, updateMarker]);

  const handleUseCurrentLocation = () => {
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Reverse geocode to get address
        if (mapsLoaded && window.google) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;

                // Update both local and parent state
                setInputValue(address);
                setData({
                  business_address: address,
                  location_latitude: lat,
                  location_longitude: lng,
                });
              } else {
                // Even if geocoding fails, save the coordinates
                setData({
                  location_latitude: lat,
                  location_longitude: lng,
                });
              }
              setIsGettingLocation(false);
            }
          );
        } else {
          // If Google Maps not available, just save coordinates
          setData({
            location_latitude: lat,
            location_longitude: lng,
          });
          setIsGettingLocation(false);
        }

        // Update map
        if (mapInstance) {
          recenterMap(lat, lng);
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
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
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

      {/* Loading State */}
      {!mapsLoaded && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Loading Google Maps...
          </p>
        </div>
      )}

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
          disabled={!mapsLoaded}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${locationMethod === 'map'
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
            <label
              htmlFor="business_address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Business Address *
            </label>
            <input
              key={`autocomplete-${mapsLoaded}`} // Force remount when maps loads
              ref={autocompleteRef}
              id="business_address"
              type="text"
              value={inputValue}
              onChange={(e) => {
                // Update local state for immediate feedback
                setInputValue(e.target.value);
                // Also update parent state for manual typing
                setData({ business_address: e.target.value });
              }}
              onBlur={() => {
                // Ensure parent state is in sync when input loses focus
                setData({ business_address: inputValue });
              }}
              disabled={!mapsLoaded}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              placeholder={
                mapsLoaded
                  ? 'Start typing your address...'
                  : 'Loading Google Maps...'
              }
              autoComplete="off"
              required
            />
            {errors.business_address && (
              <p className="mt-2 text-sm text-red-600">
                {errors.business_address}
              </p>
            )}
            {mapsLoaded && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                💡 Start typing and select from the suggestions
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={!mapsLoaded || isGettingLocation}
            className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGettingLocation
              ? '⏳ Getting location...'
              : '📍 Use My Current Location'}
          </button>
        </div>
      )}

      {/* Map View */}
      {locationMethod === 'map' && (
        <div className="space-y-4">
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
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
        <label
          htmlFor="service_radius_km"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Service Radius: {data.service_radius_km} km
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
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>5 km</span>
          <span>100 km</span>
        </div>
      </div>
    </motion.div>
  );
}