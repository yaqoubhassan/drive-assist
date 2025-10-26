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
      whileHover={{ scale: 1.2, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group focus:outline-none"
      aria-label={`View ${expert.businessName}`}
    >
      {/* Pulse effect - always visible */}
      <span className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500 animate-ping opacity-20" />

      {/* Secondary pulse - on hover */}
      <motion.span
        className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500"
        initial={{ scale: 1, opacity: 0 }}
        animate={isSelected ? { scale: 1.5, opacity: 0 } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Main pin circle */}
      <div
        className={`
          relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center
          transform transition-all duration-200
          ${isSelected
            ? 'bg-blue-700 dark:bg-blue-600 ring-4 ring-blue-400 dark:ring-blue-500 ring-opacity-50'
            : 'bg-blue-600 dark:bg-blue-500 group-hover:bg-blue-700 dark:group-hover:bg-blue-600'
          }
        `}
      >
        <WrenchScrewdriverIcon className="w-6 h-6 text-white" />

        {/* Rating badge */}
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
          {expert.rating}
        </div>
      </div>

      {/* Pin pointer triangle */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-full
          w-0 h-0
          border-l-[8px] border-l-transparent
          border-r-[8px] border-r-transparent
          border-t-[12px]
          ${isSelected ? 'border-t-blue-700 dark:border-t-blue-600' : 'border-t-blue-600 dark:border-t-blue-500'}
          transition-colors duration-200
        `}
      />

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          {expert.businessName}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 dark:border-t-gray-800" />
        </div>
      </div>
    </motion.button>
  );
}