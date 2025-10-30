import { useState, useEffect } from 'react';

/**
 * Google Maps Autocomplete Debug Overlay
 * 
 * Add this to your page temporarily to see exactly what's happening
 * with the autocomplete dropdown.
 */
export function AutocompleteDebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [pacInfo, setPacInfo] = useState({
    containers: 0,
    visible: 0,
    items: 0,
  });

  useEffect(() => {
    // Monitor console logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('Autocomplete') ||
        message.includes('Place') ||
        message.includes('place_changed') ||
        message.includes('Click outside')) {
        setLogs(prev => [...prev.slice(-9), message].slice(-10));
      }
      originalLog(...args);
    };

    console.warn = (...args) => {
      const message = '⚠️ ' + args.join(' ');
      setLogs(prev => [...prev.slice(-9), message].slice(-10));
      originalWarn(...args);
    };

    console.error = (...args) => {
      const message = '❌ ' + args.join(' ');
      setLogs(prev => [...prev.slice(-9), message].slice(-10));
      originalError(...args);
    };

    // Monitor DOM changes for pac-container
    const observer = new MutationObserver(() => {
      updatePacInfo();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    // Update every second
    const interval = setInterval(updatePacInfo, 1000);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const updatePacInfo = () => {
    const containers = document.querySelectorAll('.pac-container');
    let visible = 0;
    let items = 0;

    containers.forEach(container => {
      const style = (container as HTMLElement).style;
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        visible++;
      }
      items += container.querySelectorAll('.pac-item').length;
    });

    setPacInfo({
      containers: containers.length,
      visible,
      items,
    });
  };

  const testClickOutside = () => {
    console.log('🧪 Testing click outside...');
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    document.body.dispatchEvent(event);
  };

  const inspectPacContainer = () => {
    const containers = document.querySelectorAll('.pac-container');
    console.log('🔍 PAC Container Inspection:');
    containers.forEach((container, i) => {
      const elem = container as HTMLElement;
      console.log(`Container ${i + 1}:`, {
        display: elem.style.display,
        visibility: elem.style.visibility,
        zIndex: elem.style.zIndex,
        position: elem.getBoundingClientRect(),
        parent: elem.parentElement?.tagName,
      });
    });
  };

  const forceClosePac = () => {
    console.log('🔧 Force closing all PAC containers...');
    const containers = document.querySelectorAll('.pac-container');
    containers.forEach(container => {
      (container as HTMLElement).style.display = 'none';
      (container as HTMLElement).style.visibility = 'hidden';
    });
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 z-[9999] overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-2 font-bold flex items-center justify-between">
        <span>🔍 Autocomplete Debug</span>
        <button
          onClick={() => setLogs([])}
          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>

      {/* PAC Info */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="text-xs font-mono space-y-1">
          <div className="flex justify-between">
            <span>PAC Containers:</span>
            <span className="font-bold">{pacInfo.containers}</span>
          </div>
          <div className="flex justify-between">
            <span>Visible:</span>
            <span className={`font-bold ${pacInfo.visible > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {pacInfo.visible}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="font-bold">{pacInfo.items}</span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 space-y-1">
        <button
          onClick={testClickOutside}
          className="w-full text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
        >
          🧪 Test Click Outside
        </button>
        <button
          onClick={inspectPacContainer}
          className="w-full text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
        >
          🔍 Inspect PAC (Check Console)
        </button>
        <button
          onClick={forceClosePac}
          className="w-full text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          🔧 Force Close PAC
        </button>
      </div>

      {/* Logs */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="text-xs font-mono space-y-1">
          {logs.length === 0 ? (
            <div className="text-gray-400 italic">No logs yet...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={`p-1 rounded ${log.includes('❌')
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                  : log.includes('⚠️')
                    ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : log.includes('✅')
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Open DevTools Console for full logs
        </div>
      </div>
    </div>
  );
}

/**
 * Alternative: Simpler inline debug display
 */
export function SimpleDebug() {
  const [status, setStatus] = useState({
    mapsLoaded: false,
    autocompleteExists: false,
    inputExists: false,
    pacContainers: 0,
  });

  useEffect(() => {
    const check = () => {
      setStatus({
        mapsLoaded: typeof window.google !== 'undefined' &&
          typeof window.google.maps !== 'undefined' &&
          typeof window.google.maps.places !== 'undefined',
        autocompleteExists: typeof window.google?.maps?.places?.Autocomplete !== 'undefined',
        inputExists: document.querySelector('input#business_address') !== null,
        pacContainers: document.querySelectorAll('.pac-container').length,
      });
    };

    check();
    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="font-bold mb-2">Quick Status:</div>
      <div className="space-y-1">
        <div>{status.mapsLoaded ? '✅' : '❌'} Maps Loaded</div>
        <div>{status.autocompleteExists ? '✅' : '❌'} Autocomplete API</div>
        <div>{status.inputExists ? '✅' : '❌'} Input Field</div>
        <div>📦 PAC Containers: {status.pacContainers}</div>
      </div>
    </div>
  );
}