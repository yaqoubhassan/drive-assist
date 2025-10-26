import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import ExpertPin from './ExpertPin';
import ExpertCardPreview from './ExpertCardPreview';
import { Expert } from '@/types/expert';
import axios from 'axios';

interface InteractiveMapDemoProps {
  className?: string;
}

export default function InteractiveMapDemo({ className = '' }: InteractiveMapDemoProps) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [userLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [hoveredExpert, setHoveredExpert] = useState<number | null>(null);

  // Fetch real expert data from API
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/experts/map');
        setExperts(response.data);
      } catch (error) {
        console.error('❌ Error fetching experts:', error);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Calculate position on the map (simplified for demo)
  const calculatePosition = (lat: number, lng: number) => {
    const mapCenter = { lat: userLocation.lat, lng: userLocation.lng };
    const latRange = 0.02; // ~2.2 km vertical range
    const lngRange = 0.02; // ~2.2 km horizontal range

    // Convert to percentage (50% = center)
    const x = ((lng - mapCenter.lng + lngRange) / (latRange * 2)) * 100;
    const y = ((mapCenter.lat - lat + latRange) / (lngRange * 2)) * 100;

    return {
      x: Math.max(10, Math.min(90, x)), // Clamp to visible area
      y: Math.max(15, Math.min(80, y)), // Leave room for card at bottom and stats at top
    };
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedInsidePin = target.closest('.expert-pin-wrapper');
      const clickedInsideCard = target.closest('.expert-card-preview');

      if (selectedExpert && !clickedInsidePin && !clickedInsideCard) {
        setSelectedExpert(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedExpert]);

  // Calculate average stats from real data
  const avgRating = experts.length > 0
    ? (experts.reduce((sum, expert) => sum + expert.rating, 0) / experts.length).toFixed(1)
    : '4.9';

  // DEBUG: Handler for pin clicks
  const handlePinClick = (expert: Expert) => {
    setSelectedExpert(expert);
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        className="relative w-full h-[500px] sm:h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Map Grid Background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-700 dark:text-gray-300">Loading nearby experts...</p>
              </div>
            </div>
          </div>
        )}

        {/* No Experts Message */}
        {!loading && experts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-2">No experts found nearby</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check back soon!</p>
            </div>
          </div>
        )}

        {/* Your Location Pin (Center) */}
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            {/* Pulsing circle effect */}
            <motion.div
              className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow">
              You
            </div>
          </div>
        </motion.div>

        {/* Expert Pins - WITH ENHANCED CLICK HANDLING */}
        {!loading && experts.map((expert, index) => {
          const position = calculatePosition(expert.lat, expert.lng);

          return (
            <div
              key={expert.id}
              className="expert-pin-wrapper absolute z-30 cursor-pointer"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'auto', // ENSURE CLICKS ARE ENABLED
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinClick(expert);
              }}
              onMouseEnter={() => {
                setHoveredExpert(expert.id);
              }}
              onMouseLeave={() => {
                setHoveredExpert(null);
              }}
            >
              <ExpertPin
                expert={expert}
                isSelected={selectedExpert?.id === expert.id || hoveredExpert === expert.id}
                onClick={() => {
                  handlePinClick(expert);
                }}
                index={index}
              />
            </div>
          );
        })}

        {/* Expert Card Preview */}
        <AnimatePresence>
          {selectedExpert && (
            <div
              className="expert-card-preview"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ExpertCardPreview
                expert={selectedExpert}
                onClose={() => {
                  setSelectedExpert(null);
                }}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Stats Overlay - Top - Mobile Responsive - POINTER EVENTS NONE */}
        {!loading && experts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-4 pointer-events-none z-10"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5">Experts Nearby</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{experts.length}</p>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5">Avg. Rating</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">⭐ {avgRating}</p>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-0.5">Avg. Response</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">&lt;2min</p>
            </div>
          </motion.div>
        )}

        {/* CTA Button - Bottom (only visible when no card is shown) */}
        <AnimatePresence>
          {!selectedExpert && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[calc(100%-2rem)] sm:max-w-none sm:w-auto pointer-events-auto"
            >
              <Link
                href="/experts"
                className="inline-flex items-center justify-center gap-2 w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="whitespace-nowrap">View All Experts</span>
                <svg
                  className="hidden sm:inline w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions Tooltip - Mobile Responsive */}
        {!loading && experts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 pointer-events-none px-4 max-w-xs sm:max-w-none z-5"
          >
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ delay: 4, duration: 1 }}
              className="bg-gray-900 dark:bg-gray-800 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg text-center"
            >
              <span className="hidden sm:inline">👆 Click on any expert to see details</span>
              <span className="sm:hidden">👆 Tap on any pin</span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile-only note */}
      {!loading && experts.length > 0 && (
        <div className="sm:hidden mt-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 Tap on map pins to view expert details
          </p>
        </div>
      )}
    </div>
  );
}