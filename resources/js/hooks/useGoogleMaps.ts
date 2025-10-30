import { useState, useEffect, useRef, useCallback } from 'react';

interface UseGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
}

interface UseGoogleMapsReturn {
  mapsLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useGoogleMaps({ apiKey, libraries = ['places'] }: UseGoogleMapsOptions): UseGoogleMapsReturn {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Prevent multiple script loads
    if (scriptLoadedRef.current || isLoading) {
      return;
    }

    setIsLoading(true);
    scriptLoadedRef.current = true;

    // Create unique callback name
    const callbackName = 'initGoogleMaps_' + Date.now();

    // Define callback function
    (window as any)[callbackName] = () => {
      console.log('✅ Google Maps loaded successfully');
      setMapsLoaded(true);
      setIsLoading(false);
      setError(null);

      // Cleanup callback
      delete (window as any)[callbackName];
    };

    // Create and append script
    const script = document.createElement('script');
    const librariesParam = libraries.join(',');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('❌ Failed to load Google Maps');
      setError('Failed to load Google Maps. Please check your API key.');
      setIsLoading(false);
      scriptLoadedRef.current = false;
      delete (window as any)[callbackName];
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Note: We don't remove the script as it might be used by other components
      // The callback will be cleaned up after execution
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

  useEffect(() => {
    // Wait for maps to load and input to be available
    if (!mapsLoaded || !inputRef.current) {
      return;
    }

    // Cleanup existing instance
    if (autocompleteRef.current && listenerRef.current) {
      google.maps.event.removeListener(listenerRef.current);
      google.maps.event.clearInstanceListeners(inputRef.current);
      autocompleteRef.current = null;
      listenerRef.current = null;
    }

    try {
      // Create new autocomplete instance with custom styling
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        ...options,
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
      });

      // Add place_changed listener
      const listener = google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();

        console.log('Place selected:', place);

        if (!place.geometry || !place.geometry.location) {
          console.warn('No geometry for selected place');
          return;
        }

        onPlaceSelected(place);
      });

      autocompleteRef.current = autocomplete;
      listenerRef.current = listener;

      console.log('✅ Autocomplete initialized successfully');

      // Apply custom styling to the autocomplete dropdown
      setTimeout(() => {
        styleAutocompleteDropdown();
      }, 100);
    } catch (error) {
      console.error('❌ Error initializing autocomplete:', error);
    }

    // Cleanup function
    return () => {
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
      }
      if (inputRef.current) {
        google.maps.event.clearInstanceListeners(inputRef.current);
      }
      autocompleteRef.current = null;
      listenerRef.current = null;
    };
  }, [mapsLoaded, inputRef, onPlaceSelected]);

  return autocompleteRef;
}

// Helper function to style the autocomplete dropdown
function styleAutocompleteDropdown() {
  // Find all pac-container elements (Google's autocomplete dropdown class)
  const containers = document.querySelectorAll('.pac-container');

  containers.forEach((container: Element) => {
    const htmlContainer = container as HTMLElement;

    // Apply custom styles
    htmlContainer.style.borderRadius = '8px';
    htmlContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    htmlContainer.style.marginTop = '4px';
    htmlContainer.style.border = '1px solid #e5e7eb';
    htmlContainer.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';

    // Check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
      htmlContainer.style.backgroundColor = '#1f2937';
      htmlContainer.style.border = '1px solid #374151';
    } else {
      htmlContainer.style.backgroundColor = '#ffffff';
    }

    // Style individual items
    const items = container.querySelectorAll('.pac-item');
    items.forEach((item: Element) => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.padding = '10px 14px';
      htmlItem.style.cursor = 'pointer';
      htmlItem.style.fontSize = '14px';
      htmlItem.style.lineHeight = '1.5';

      if (isDarkMode) {
        htmlItem.style.color = '#f9fafb';
        htmlItem.style.borderTop = '1px solid #374151';
      } else {
        htmlItem.style.color = '#111827';
        htmlItem.style.borderTop = '1px solid #e5e7eb';
      }

      // Hover effect
      htmlItem.addEventListener('mouseenter', () => {
        if (isDarkMode) {
          htmlItem.style.backgroundColor = '#374151';
        } else {
          htmlItem.style.backgroundColor = '#f3f4f6';
        }
      });

      htmlItem.addEventListener('mouseleave', () => {
        if (isDarkMode) {
          htmlItem.style.backgroundColor = '#1f2937';
        } else {
          htmlItem.style.backgroundColor = '#ffffff';
        }
      });
    });

    // Style the query text (matched portion)
    const queries = container.querySelectorAll('.pac-item-query');
    queries.forEach((query: Element) => {
      const htmlQuery = query as HTMLElement;
      htmlQuery.style.fontWeight = '600';

      if (isDarkMode) {
        htmlQuery.style.color = '#60a5fa';
      } else {
        htmlQuery.style.color = '#2563eb';
      }
    });

    // Style the secondary text
    const secondaryTexts = container.querySelectorAll('.pac-item-query + span');
    secondaryTexts.forEach((text: Element) => {
      const htmlText = text as HTMLElement;

      if (isDarkMode) {
        htmlText.style.color = '#9ca3af';
      } else {
        htmlText.style.color = '#6b7280';
      }
    });
  });
}

interface UseGoogleMapOptions {
  mapRef: React.RefObject<HTMLDivElement>;
  mapsLoaded: boolean;
  center: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

export function useGoogleMap({
  mapRef,
  mapsLoaded,
  center,
  zoom = 15,
  onMapClick,
}: UseGoogleMapOptions) {
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || mapInstance.current) {
      return;
    }

    try {
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
      });

      if (onMapClick) {
        const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
        clickListenerRef.current = listener;
      }

      mapInstance.current = map;
      console.log('✅ Map initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }

    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
      }
      if (mapInstance.current) {
        google.maps.event.clearInstanceListeners(mapInstance.current);
      }
      mapInstance.current = null;
    };
  }, [mapsLoaded, mapRef, center, zoom, onMapClick]);

  // Update marker position
  const updateMarker = useCallback((lat: number, lng: number) => {
    if (!mapInstance.current) return;

    // Remove existing marker
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
    }

    // Create new marker
    try {
      markerInstance.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstance.current,
        title: 'Your Business Location',
        animation: google.maps.Animation.DROP,
      });

      // Center map on new marker
      mapInstance.current.setCenter({ lat, lng });
    } catch (error) {
      console.error('❌ Error creating marker:', error);
    }
  }, []);

  // Recenter map
  const recenterMap = useCallback((lat: number, lng: number) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter({ lat, lng });
    }
  }, []);

  return {
    mapInstance: mapInstance.current,
    updateMarker,
    recenterMap,
  };
}