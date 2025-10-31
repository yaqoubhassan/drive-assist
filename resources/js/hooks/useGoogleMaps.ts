// ✅ FIXED VERSION - Doesn't interfere with button clicks
// Key Fix: Added check to ignore clicks on buttons and interactive elements

import { useState, useEffect, useRef } from 'react';

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
}

interface UseGoogleMapsReturn {
  mapsLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useGoogleMaps({
  apiKey,
  libraries = [],
}: UseGoogleMapsOptions): UseGoogleMapsReturn {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      (!libraries.includes('places') || window.google.maps.places)
    ) {
      setMapsLoaded(true);
      setIsLoading(false);
      scriptLoadedRef.current = true;
      console.log('✅ Google Maps already loaded');
      return;
    }

    if (scriptLoadedRef.current || document.querySelector('script[src*="maps.googleapis.com"]')) {
      console.log('⏳ Google Maps script already loading...');
      return;
    }

    if (!apiKey) {
      const err = new Error('Google Maps API key is required');
      setError(err);
      setIsLoading(false);
      console.error('❌', err.message);
      return;
    }

    scriptLoadedRef.current = true;
    console.log('🚀 Loading Google Maps...');

    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: apiKey,
      libraries: libraries.join(','),
      callback: '__googleMapsCallback',
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}&loading=async`;
    script.async = true;
    script.defer = true;

    (window as any).__googleMapsCallback = () => {
      console.log('✅ Google Maps loaded successfully');
      setMapsLoaded(true);
      setIsLoading(false);
      delete (window as any).__googleMapsCallback;
    };

    script.onerror = () => {
      const err = new Error('Failed to load Google Maps');
      console.error('❌', err.message);
      setError(err);
      setIsLoading(false);
      scriptLoadedRef.current = false;
    };

    document.head.appendChild(script);

    return () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };
  }, [apiKey, libraries]);

  return { mapsLoaded, isLoading, error };
}

interface UseGoogleAutocompleteOptions {
  inputRef: React.RefObject<HTMLInputElement>;
  mapsLoaded: boolean;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  options?: google.maps.places.AutocompleteOptions;
}

export function useGoogleAutocomplete({
  inputRef,
  mapsLoaded,
  onPlaceSelected,
  options = {
    types: ['address'],
    componentRestrictions: { country: ['us', 'gh', 'gb'] },
  },
}: UseGoogleAutocompleteOptions) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const clickOutsideListenerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const isInitializedRef = useRef(false);
  const inputElementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current) {
      return;
    }

    if (isInitializedRef.current && inputElementRef.current === inputRef.current) {
      console.log('⚠️ Autocomplete already initialized for this input, skipping');
      return;
    }

    console.log('🔧 Initializing autocomplete...');
    inputElementRef.current = inputRef.current;

    if (autocompleteRef.current) {
      console.log('🧹 Cleaning up existing autocomplete instance');
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
      if (inputRef.current) {
        google.maps.event.clearInstanceListeners(inputRef.current);
      }
      autocompleteRef.current = null;
    }

    if (clickOutsideListenerRef.current) {
      document.removeEventListener('mousedown', clickOutsideListenerRef.current, true);
      clickOutsideListenerRef.current = null;
    }

    try {
      const input = inputRef.current;

      input.setAttribute('autocomplete', 'new-password');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');

      const autocomplete = new google.maps.places.Autocomplete(input, {
        ...options,
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      });

      console.log('✅ Autocomplete instance created');

      const listener = google.maps.event.addListener(autocomplete, 'place_changed', () => {
        console.log('🎯 place_changed event fired');
        const place = autocomplete.getPlace();
        console.log('📍 Place data:', place);

        if (!place.geometry || !place.geometry.location) {
          console.warn('⚠️ Selected place has no geometry');
          return;
        }

        console.log('✅ Calling onPlaceSelected callback');
        onPlaceSelected(place);
      });

      autocompleteRef.current = autocomplete;
      listenerRef.current = listener;
      isInitializedRef.current = true;

      console.log('✅ Autocomplete initialized successfully');

      // ✅ CRITICAL FIX: Improved click-outside handler
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // ✅ FIX: Check if click is on any button or interactive element
        const isButton = target.closest('button');
        const isLink = target.closest('a');
        const isFormControl = target.closest('input:not([type="text"]), select, textarea');
        const isLabel = target.closest('label');
        const isInteractiveElement = isButton || isLink || isFormControl || isLabel;

        if (isInteractiveElement) {
          console.log('🎯 Click on interactive element, ignoring (allowing normal behavior)');
          return; // ✅ Exit early, don't interfere with button clicks
        }

        const pacContainers = document.querySelectorAll('.pac-container');

        let isInsideDropdown = false;
        pacContainers.forEach((container) => {
          if (container.contains(target)) {
            isInsideDropdown = true;
          }
        });

        const isInsideInput = input.contains(target);

        if (!isInsideDropdown && !isInsideInput) {
          console.log('🚪 Click outside detected, closing dropdown');

          if (document.activeElement === input) {
            input.blur();
          }

          pacContainers.forEach((container) => {
            (container as HTMLElement).style.visibility = 'hidden';
          });

          const gmContainers = document.querySelectorAll('.gm-style');
          gmContainers.forEach((container) => {
            const pacContainer = container.querySelector('.pac-container');
            if (pacContainer) {
              (pacContainer as HTMLElement).style.visibility = 'hidden';
            }
          });
        }
      };

      const handleFocus = () => {
        console.log('👁️ Input focused, showing dropdown');
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach((container) => {
          (container as HTMLElement).style.visibility = 'visible';
        });
      };

      clickOutsideListenerRef.current = handleClickOutside;
      document.addEventListener('mousedown', handleClickOutside, true);
      input.addEventListener('focus', handleFocus);

      console.log('✅ Click-outside listener added (with button exemption)');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const pacContainer = document.querySelector('.pac-container');
          if (pacContainer && (pacContainer as HTMLElement).style.display !== 'none') {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };

      input.addEventListener('keydown', handleKeyDown, true);

    } catch (error) {
      console.error('❌ Error initializing autocomplete:', error);
      isInitializedRef.current = false;
    }

    return () => {
      console.log('🧹 Cleanup function called');

      const isInputChanged = inputElementRef.current !== inputRef.current;
      const shouldCleanup = isInputChanged || !document.contains(inputRef.current || null);

      if (!shouldCleanup) {
        console.log('⏭️ Skipping cleanup (StrictMode or re-render)');
        return;
      }

      console.log('🧹 Performing actual cleanup');

      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }

      if (inputElementRef.current) {
        google.maps.event.clearInstanceListeners(inputElementRef.current);
      }

      if (clickOutsideListenerRef.current) {
        document.removeEventListener('mousedown', clickOutsideListenerRef.current, true);
        clickOutsideListenerRef.current = null;
      }

      autocompleteRef.current = null;
      isInitializedRef.current = false;
      inputElementRef.current = null;
    };
  }, [mapsLoaded, inputRef, onPlaceSelected, options]);

  return autocompleteRef;
}

interface UseGoogleMapOptions {
  mapRef: React.RefObject<HTMLDivElement>;
  mapsLoaded: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelected?: (location: { lat: number; lng: number; address?: string }) => void;
}

export function useGoogleMap({
  mapRef,
  mapsLoaded,
  center = { lat: 40.7128, lng: -74.006 },
  zoom = 12,
  onLocationSelected,
}: UseGoogleMapOptions) {
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) {
      return;
    }

    try {
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
      console.log('✅ Map initialized');

      if (onLocationSelected) {
        map.addListener('click', async (event: google.maps.MapMouseEvent) => {
          const latLng = event.latLng;
          if (!latLng) return;

          const lat = latLng.lat();
          const lng = latLng.lng();

          if (markerRef.current) {
            markerRef.current.setPosition(latLng);
          } else {
            markerRef.current = new google.maps.Marker({
              position: latLng,
              map,
              title: 'Selected Location',
            });
          }

          try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: latLng });

            if (response.results[0]) {
              const address = response.results[0].formatted_address;
              onLocationSelected({ lat, lng, address });
            } else {
              onLocationSelected({ lat, lng });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            onLocationSelected({ lat, lng });
          }
        });
      }
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [mapsLoaded, mapRef, center, zoom, onLocationSelected]);

  return mapInstanceRef;
}