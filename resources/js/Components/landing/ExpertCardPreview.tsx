import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Expert } from '@/types/expert';

interface ExpertCardPreviewProps {
  expert: Expert;
  onClose: () => void;
}

export default function ExpertCardPreview({ expert, onClose }: ExpertCardPreviewProps) {
  const getPricingLabel = (pricing: Expert['pricing']) => {
    switch (pricing) {
      case 'budget':
        return '$';
      case 'moderate':
        return '$$';
      case 'premium':
        return '$$$';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute bottom-6 left-6 right-6 z-20 max-w-md mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 border border-gray-200 dark:border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {expert.businessName.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">
              {expert.businessName}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="ml-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {expert.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({expert.reviewCount} reviews)
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {expert.isOpen && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Open Now
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Distance */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{expert.distance} away</span>
          </div>

          {/* Response Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ClockIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>Responds in {expert.responseTime}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CurrencyDollarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{getPricingLabel(expert.pricing)} • {expert.pricing === 'budget' ? 'Budget-friendly' : expert.pricing === 'moderate' ? 'Moderate pricing' : 'Premium service'}</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Specialties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {expert.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/experts/${expert.id}`}
            className="flex-1 text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            View Profile
          </Link>
          <Link
            href={`/experts/${expert.id}/contact`}
            className="flex-1 text-center px-4 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.div>
  );
}