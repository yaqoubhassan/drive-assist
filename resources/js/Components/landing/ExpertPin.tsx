import { motion } from 'framer-motion';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { Expert } from '@/types/expert';

interface ExpertPinProps {
  expert: Expert;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export default function ExpertPin({ expert, isSelected, onClick, index }: ExpertPinProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
      aria-label={`View ${expert.businessName}`}
    >
      {/* Pulse effect - always visible */}
      <span className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500 animate-ping opacity-20" />

      {/* Secondary pulse - on selection */}
      <motion.span
        className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500"
        initial={{ scale: 1, opacity: 0 }}
        animate={isSelected ? { scale: 1.5, opacity: 0 } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Main pin circle - larger touch target for mobile */}
      <div
        className={`
          relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg flex items-center justify-center
          transform transition-all duration-200
          ${isSelected
            ? 'bg-blue-700 dark:bg-blue-600 ring-4 ring-blue-400 dark:ring-blue-500 ring-opacity-50'
            : 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 dark:group-hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-700'
          }
        `}
      >
        <WrenchScrewdriverIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

        {/* Rating badge - slightly adjusted for mobile */}
        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full shadow-md min-w-[18px] sm:min-w-[20px] text-center">
          {expert.rating}
        </div>
      </div>

      {/* Pin pointer triangle */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-full
          w-0 h-0
          border-l-[7px] sm:border-l-[8px] border-l-transparent
          border-r-[7px] sm:border-r-[8px] border-r-transparent
          border-t-[10px] sm:border-t-[12px]
          ${isSelected ? 'border-t-blue-700 dark:border-t-blue-600' : 'border-t-blue-600 dark:border-t-blue-500'}
          transition-colors duration-200
        `}
      />

      {/* Tooltip - desktop only (doesn't work on mobile touch) */}
      <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          {expert.businessName}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 dark:border-t-gray-800" />
        </div>
      </div>

      {/* Mobile label - only shown when selected */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-3 pointer-events-none z-50"
        >
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap max-w-[120px] text-center truncate">
            {expert.businessName}
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}