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
    // Check if already loaded
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

    // Prevent duplicate loading
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

    // Global callback
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
      // Cleanup is tricky with Google Maps, so we keep the script
      // but reset our loading state if component unmounts early
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
  const isInitializedRef = useRef(false); // Track if already initialized
  const inputElementRef = useRef<HTMLInputElement | null>(null); // Store input element

  useEffect(() => {
    // Wait for maps to load and input to be available
    if (!mapsLoaded || !inputRef.current) {
      return;
    }

    // CRITICAL: Prevent double initialization in StrictMode
    // Only initialize once per input element
    if (isInitializedRef.current && inputElementRef.current === inputRef.current) {
      console.log('⚠️ Autocomplete already initialized for this input, skipping');
      return;
    }

    console.log('🔧 Initializing autocomplete...');

    // Store the input element reference
    inputElementRef.current = inputRef.current;

    // Cleanup existing instance if any
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

    // Remove existing click listener
    if (clickOutsideListenerRef.current) {
      document.removeEventListener('mousedown', clickOutsideListenerRef.current, true);
      clickOutsideListenerRef.current = null;
    }

    try {
      const input = inputRef.current;

      // CRITICAL: Prevent browser autocomplete interference
      input.setAttribute('autocomplete', 'new-password'); // Use 'new-password' as it's more aggressive
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');

      // Create new autocomplete instance
      const autocomplete = new google.maps.places.Autocomplete(input, {
        ...options,
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      });

      console.log('✅ Autocomplete instance created');

      // Add place_changed listener
      const listener = google.maps.event.addListener(autocomplete, 'place_changed', () => {
        console.log('🎯 place_changed event fired');

        const place = autocomplete.getPlace();
        console.log('📍 Place data:', place);

        if (!place.geometry || !place.geometry.location) {
          console.warn('⚠️ Selected place has no geometry');
          return;
        }

        // Call the callback
        console.log('✅ Calling onPlaceSelected callback');
        onPlaceSelected(place);
      });

      autocompleteRef.current = autocomplete;
      listenerRef.current = listener;
      isInitializedRef.current = true;

      console.log('✅ Autocomplete initialized successfully');

      // CRITICAL: Use mousedown instead of click for better event capture
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Find all Google autocomplete dropdowns
        const pacContainers = document.querySelectorAll('.pac-container');

        // Check if click is inside dropdown
        let isInsideDropdown = false;
        pacContainers.forEach((container) => {
          if (container.contains(target)) {
            isInsideDropdown = true;
          }
        });

        // Check if click is inside input
        const isInsideInput = input.contains(target);

        // If click is outside both, hide the dropdown
        if (!isInsideDropdown && !isInsideInput) {
          console.log('🚪 Click outside detected, closing dropdown');

          // Method 1: Blur the input
          if (document.activeElement === input) {
            input.blur();
          }

          // Method 2: Manually hide all pac-containers
          pacContainers.forEach((container) => {
            (container as HTMLElement).style.visibility = 'hidden';
          });

          // Method 3: Set gm-style-iw to hidden (Google's container)
          const gmContainers = document.querySelectorAll('.gm-style');
          gmContainers.forEach((container) => {
            const pacContainer = container.querySelector('.pac-container');
            if (pacContainer) {
              (pacContainer as HTMLElement).style.visibility = 'hidden';
            }
          });
        }
      };

      // CRITICAL: Add focus listener to show dropdown again
      const handleFocus = () => {
        console.log('👁️ Input focused, showing dropdown');

        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach((container) => {
          (container as HTMLElement).style.visibility = 'visible';
        });
      };

      // Add listeners
      clickOutsideListenerRef.current = handleClickOutside;
      document.addEventListener('mousedown', handleClickOutside, true);
      input.addEventListener('focus', handleFocus);

      console.log('✅ Click-outside listener added');

      // CRITICAL: Prevent form submission on Enter in autocomplete
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          // Check if pac-container is visible
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

    // Cleanup function - CRITICAL: Only cleanup when truly unmounting
    return () => {
      console.log('🧹 Cleanup function called');

      // Don't cleanup if we're just in StrictMode double-render
      // Only cleanup if the input element has changed or component is truly unmounting
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
  center = { lat: 40.7128, lng: -74.006 }, // Default: NYC
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
      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
      console.log('✅ Map initialized');

      // Add click listener
      if (onLocationSelected) {
        map.addListener('click', async (event: google.maps.MapMouseEvent) => {
          const latLng = event.latLng;
          if (!latLng) return;

          const lat = latLng.lat();
          const lng = latLng.lng();

          // Update or create marker
          if (markerRef.current) {
            markerRef.current.setPosition(latLng);
          } else {
            markerRef.current = new google.maps.Marker({
              position: latLng,
              map,
              title: 'Selected Location',
            });
          }

          // Reverse geocode to get address
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