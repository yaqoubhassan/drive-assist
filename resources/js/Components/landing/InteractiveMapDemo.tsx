import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import ExpertPin from './ExpertPin';
import ExpertCardPreview from './ExpertCardPreview';
import { Expert } from '@/types/expert';

// Demo expert data - this could be fetched from API in production
const DEMO_EXPERTS: Expert[] = [
  {
    id: 1,
    name: 'John Smith',
    businessName: "John's Auto Repair",
    lat: 40.7158,
    lng: -74.0070,
    rating: 4.9,
    reviewCount: 234,
    distance: '0.8 mi',
    specialties: ['Engine', 'Brakes', 'Diagnostics'],
    isOpen: true,
    responseTime: '< 1 hour',
    pricing: 'moderate',
  },
  {
    id: 2,
    name: 'Maria Garcia',
    businessName: 'Quick Fix Auto',
    lat: 40.7108,
    lng: -74.0050,
    rating: 4.8,
    reviewCount: 189,
    distance: '1.2 mi',
    specialties: ['Electrical', 'AC Repair', 'Diagnostics'],
    isOpen: true,
    responseTime: '< 2 hours',
    pricing: 'budget',
  },
  {
    id: 3,
    name: 'David Chen',
    businessName: 'Premium Auto Care',
    lat: 40.7138,
    lng: -74.0100,
    rating: 5.0,
    reviewCount: 156,
    distance: '1.5 mi',
    specialties: ['Engine', 'Transmission', 'Luxury Cars'],
    isOpen: false,
    responseTime: '< 3 hours',
    pricing: 'premium',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    businessName: 'City Automotive',
    lat: 40.7178,
    lng: -74.0040,
    rating: 4.7,
    reviewCount: 298,
    distance: '1.8 mi',
    specialties: ['Brakes', 'Suspension', 'Tires'],
    isOpen: true,
    responseTime: '< 1 hour',
    pricing: 'moderate',
  },
  {
    id: 5,
    name: 'Mike Rodriguez',
    businessName: 'Express Auto Service',
    lat: 40.7098,
    lng: -74.0090,
    rating: 4.9,
    reviewCount: 412,
    distance: '2.0 mi',
    specialties: ['Oil Change', 'Maintenance', 'Inspections'],
    isOpen: true,
    responseTime: '< 30 min',
    pricing: 'budget',
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    businessName: 'Anderson Auto Works',
    lat: 40.7188,
    lng: -74.0060,
    rating: 4.8,
    reviewCount: 167,
    distance: '2.3 mi',
    specialties: ['Engine', 'Electrical', 'Bodywork'],
    isOpen: true,
    responseTime: '< 2 hours',
    pricing: 'moderate',
  },
  {
    id: 7,
    name: 'Robert Taylor',
    businessName: 'Mobile Mechanic Pro',
    lat: 40.7118,
    lng: -74.0020,
    rating: 5.0,
    reviewCount: 89,
    distance: '2.5 mi',
    specialties: ['Mobile Service', 'Emergency Repairs', 'Diagnostics'],
    isOpen: true,
    responseTime: '< 1 hour',
    pricing: 'premium',
  },
  {
    id: 8,
    name: 'Jennifer Lee',
    businessName: 'Lee Auto Center',
    lat: 40.7148,
    lng: -74.0110,
    rating: 4.6,
    reviewCount: 203,
    distance: '2.8 mi',
    specialties: ['Transmission', 'Clutch', 'Diagnostics'],
    isOpen: false,
    responseTime: '< 4 hours',
    pricing: 'moderate',
  },
];

interface InteractiveMapDemoProps {
  className?: string;
}

export default function InteractiveMapDemo({ className = '' }: InteractiveMapDemoProps) {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [userLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [hoveredExpert, setHoveredExpert] = useState<number | null>(null);

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
      y: Math.max(10, Math.min(85, y)), // Leave room for card at bottom
    };
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectedExpert && !(e.target as Element).closest('.expert-card-preview')) {
        setSelectedExpert(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedExpert]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
          {/* Grid overlay for map-like appearance */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(147, 197, 253, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(147, 197, 253, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Animated roads/paths */}
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
            <motion.path
              d="M 0,300 Q 200,250 400,300 T 800,300"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-blue-600 dark:text-blue-400"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 200,0 Q 250,200 200,400 T 200,800"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-blue-600 dark:text-blue-400"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
            />
          </svg>

          {/* User location marker (center) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="relative">
              {/* Pulsing circle */}
              <motion.div
                className="absolute inset-0 rounded-full bg-green-500 opacity-30"
                animate={{
                  scale: [1, 2, 2, 1],
                  opacity: [0.3, 0, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* User pin */}
              <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
                You are here
              </span>
            </div>
          </motion.div>
        </div>

        {/* Expert Pins */}
        {DEMO_EXPERTS.map((expert, index) => {
          const position = calculatePosition(expert.lat, expert.lng);
          return (
            <div
              key={expert.id}
              className="absolute z-20"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -100%)',
              }}
              onMouseEnter={() => setHoveredExpert(expert.id)}
              onMouseLeave={() => setHoveredExpert(null)}
            >
              <ExpertPin
                expert={expert}
                isSelected={selectedExpert?.id === expert.id || hoveredExpert === expert.id}
                onClick={() => setSelectedExpert(expert)}
                index={index}
              />
            </div>
          );
        })}

        {/* Expert Card Preview */}
        <AnimatePresence>
          {selectedExpert && (
            <div className="expert-card-preview" onClick={(e) => e.stopPropagation()}>
              <ExpertCardPreview
                expert={selectedExpert}
                onClose={() => setSelectedExpert(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Stats Overlay - Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4 pointer-events-none"
        >
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Experts Nearby</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{DEMO_EXPERTS.length}</p>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Avg. Response</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">&lt;2min</p>
          </div>
        </motion.div>

        {/* CTA Button - Bottom (only visible when no card is shown) */}
        <AnimatePresence>
          {!selectedExpert && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
            >
              <Link
                href="/experts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>View All Experts</span>
                <svg
                  className="w-5 h-5"
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

        {/* Instructions Tooltip - Shows initially then fades */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ delay: 4, duration: 1 }}
            className="bg-gray-900 dark:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg"
          >
            👆 Click on any expert to see details
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile-only note */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Tap on pins to view expert details
        </p>
      </div>
    </div>
  );
}