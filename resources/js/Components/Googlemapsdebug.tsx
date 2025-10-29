import { useState, useEffect } from 'react';

/**
 * Google Maps Debug Component
 * 
 * Add this temporarily to your onboarding page to verify Google Maps is loading correctly
 * Remove this once everything is working
 */
export function GoogleMapsDebug() {
  const [status, setStatus] = useState({
    scriptLoaded: false,
    googleAvailable: false,
    mapsAvailable: false,
    placesAvailable: false,
    apiKey: '',
    errors: [] as string[],
  });

  useEffect(() => {
    const checkStatus = () => {
      const newStatus = {
        scriptLoaded: !!document.querySelector('script[src*="maps.googleapis.com"]'),
        googleAvailable: typeof window.google !== 'undefined',
        mapsAvailable: typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined',
        placesAvailable: typeof window.google !== 'undefined' &&
          typeof window.google.maps !== 'undefined' &&
          typeof window.google.maps.places !== 'undefined',
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || 'NOT SET',
        errors: [] as string[],
      };

      // Check for common errors
      if (!newStatus.apiKey || newStatus.apiKey === 'NOT SET') {
        newStatus.errors.push('❌ VITE_GOOGLE_MAPS_KEY not set in .env');
      }

      if (newStatus.scriptLoaded && !newStatus.googleAvailable) {
        newStatus.errors.push('❌ Google Maps script loaded but google object not available');
      }

      if (newStatus.googleAvailable && !newStatus.mapsAvailable) {
        newStatus.errors.push('❌ google.maps not available');
      }

      if (newStatus.mapsAvailable && !newStatus.placesAvailable) {
        newStatus.errors.push('❌ google.maps.places not available - Places API may not be enabled');
      }

      // Check console for Google Maps errors
      const consoleErrors = (window as any).__googleMapsErrors || [];
      if (consoleErrors.length > 0) {
        newStatus.errors.push(...consoleErrors);
      }

      setStatus(newStatus);
    };

    // Check immediately
    checkStatus();

    // Check again after 2 seconds (in case script is still loading)
    const timer = setTimeout(checkStatus, 2000);

    // Set up error listener
    window.addEventListener('error', (e) => {
      if (e.message.includes('Google') || e.message.includes('maps')) {
        setStatus(prev => ({
          ...prev,
          errors: [...prev.errors, `❌ ${e.message}`]
        }));
      }
    });

    return () => clearTimeout(timer);
  }, []);

  const StatusIndicator = ({ isOk, label }: { isOk: boolean; label: string }) => (
    <div className="flex items-center space-x-2">
      <span className={`text-2xl ${isOk ? 'text-green-500' : 'text-red-500'}`}>
        {isOk ? '✅' : '❌'}
      </span>
      <span className={isOk ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          🗺️ Google Maps Debug
        </h3>
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload
        </button>
      </div>

      <div className="space-y-2">
        <StatusIndicator
          isOk={status.apiKey !== 'NOT SET'}
          label="API Key Set"
        />
        <StatusIndicator
          isOk={status.scriptLoaded}
          label="Script Loaded"
        />
        <StatusIndicator
          isOk={status.googleAvailable}
          label="Google Available"
        />
        <StatusIndicator
          isOk={status.mapsAvailable}
          label="Maps API Available"
        />
        <StatusIndicator
          isOk={status.placesAvailable}
          label="Places API Available"
        />
      </div>

      {status.apiKey && status.apiKey !== 'NOT SET' && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
          <p className="text-gray-600 dark:text-gray-400 mb-1">API Key:</p>
          <p className="font-mono text-gray-900 dark:text-white break-all">
            {status.apiKey.substring(0, 20)}...
          </p>
        </div>
      )}

      {status.errors.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-semibold text-red-700 dark:text-red-300">Errors:</p>
          {status.errors.map((error, index) => (
            <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          ))}
        </div>
      )}

      {status.errors.length === 0 && status.placesAvailable && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            ✅ All systems operational!
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Quick Fixes:
        </p>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Restart dev server after .env changes</li>
          <li>• Enable APIs in Google Cloud Console</li>
          <li>• Check domain restrictions on API key</li>
          <li>• Clear browser cache and reload</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Usage:
 * 
 * In your Onboarding.tsx, add this at the bottom:
 * 
 * import { GoogleMapsDebug } from '@/Components/GoogleMapsDebug';
 * 
 * export default function Onboarding() {
 *   return (
 *     <>
 *       {import.meta.env.DEV && <GoogleMapsDebug />}
 *       {/* rest of your component *\/}
 *     </>
 *   );
 * }
 */