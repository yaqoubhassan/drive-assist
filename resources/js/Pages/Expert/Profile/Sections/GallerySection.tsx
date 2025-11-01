import { PhotoIcon } from '@heroicons/react/24/outline';

interface GallerySectionProps {
  expertProfile: {
    id: number;
    avg_rating: number;
    total_jobs: number;
    verification_status: string;
  };
}

export default function GallerySection({ expertProfile }: GallerySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Gallery
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload photos of your shop, team, and completed work
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Gallery management coming soon
        </p>
        <button
          type="button"
          disabled
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
        >
          Upload Photos
        </button>
      </div>
    </div>
  );
}