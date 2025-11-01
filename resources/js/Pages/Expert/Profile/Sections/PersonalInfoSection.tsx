import { useRef, useState, useEffect } from 'react';
import UserAvatar from '@/Components/UserAvatar';
import ConfirmationModal from '@/Components/ui/ConfirmationModal';
import { useGoogleAutocomplete } from '@/hooks/useGoogleMaps';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, TrashIcon, CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface PersonalInfoSectionProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    location_address: string | null;
  };
  onAvatarUpdate?: (avatarUrl: string | null) => void;
  mapsLoaded?: boolean;
}

export default function PersonalInfoSection({
  data,
  setData,
  errors,
  user,
  onAvatarUpdate,
  mapsLoaded = false
}: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(user.avatar_url);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addressInputValue, setAddressInputValue] = useState(data.location_address || '');

  // Update local address input when data changes externally
  useEffect(() => {
    if (data.location_address && data.location_address !== addressInputValue) {
      setAddressInputValue(data.location_address);
    }
  }, [data.location_address]);

  // Setup Google Maps autocomplete for address
  useGoogleAutocomplete({
    inputRef: addressInputRef,
    mapsLoaded,
    onPlaceSelected: (place) => {
      console.log('🎯 Address selected:', place);

      if (!place.geometry || !place.geometry.location) {
        console.error('❌ Place missing geometry');
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || '';

      console.log('📍 Updating address:', { address, lat, lng });

      // Update both local state and parent state
      setAddressInputValue(address);
      setData('location_address', address);
      setData('location_latitude', lat);
      setData('location_longitude', lng);
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: ['us', 'gh', 'gb'] },
    },
  });

  const handleFileSelect = async (file: File) => {
    // Validate file
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setUploadError('File size must be less than 2MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, GIF, and WebP images are allowed');
      return;
    }

    // Start upload
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await window.axios.post(
        route('expert.profile.upload-avatar'),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setCurrentAvatarUrl(response.data.avatar_url);
        setUploadSuccess(true);

        // Notify parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(response.data.avatar_url);
        }

        // Hide success message after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
          setUploadProgress(0);
        }, 3000);
      } else {
        setUploadError('Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to upload avatar. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatarClick = () => {
    if (!currentAvatarUrl) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await window.axios.delete(route('expert.profile.delete-avatar'));

      if (response.data.success) {
        setCurrentAvatarUrl(null);
        if (onAvatarUpdate) {
          onAvatarUpdate(null);
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Close modal
        setShowDeleteModal(false);
      } else {
        setUploadError(response.data.error || 'Failed to delete avatar');
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setUploadError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to delete avatar. Please try again.'
      );
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Personal Information
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Update your personal details and contact information
          </p>
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Picture
          </label>

          <div className="flex items-start gap-6">
            <UserAvatar
              name={data.name || user.name}
              avatarUrl={currentAvatarUrl}
              size="xl"
            />

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Upload avatar"
              />

              <div className="flex gap-3 mb-2">
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </button>

                {currentAvatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatarClick}
                    disabled={isUploading}
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                JPG, PNG, GIF, or WebP. Max size 2MB.
              </p>

              {/* Upload Progress */}
              <AnimatePresence mode="wait">
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <CloudArrowUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Uploading... {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5">
                        <motion.div
                          className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success Message */}
                {uploadSuccess && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Avatar uploaded successfully!
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {uploadError && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                            Upload failed
                          </p>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            {uploadError}
                          </p>
                        </div>
                        <button
                          onClick={() => setUploadError(null)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <span className="sr-only">Dismiss</span>
                          ×
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={e => setData('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white"
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={addressInputRef}
              id="location_address"
              type="text"
              value={addressInputValue}
              onChange={(e) => {
                const newValue = e.target.value;
                setAddressInputValue(newValue);
                setData('location_address', newValue);
                // Clear coordinates when manually editing
                if (newValue !== data.location_address) {
                  setData('location_latitude', null);
                  setData('location_longitude', null);
                }
              }}
              disabled={!mapsLoaded}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
              placeholder={
                mapsLoaded
                  ? 'Start typing your business address...'
                  : 'Loading Google Maps...'
              }
              autoComplete="off"
            />
          </div>
          {errors.location_address && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location_address}</p>
          )}
          {mapsLoaded && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              💡 Start typing and select a suggestion from the dropdown for accurate location
            </p>
          )}
          {!mapsLoaded && (
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              ⏳ Loading address search...
            </p>
          )}
          {data.location_latitude && data.location_longitude && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                ✅ Location Coordinates Set
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                {data.location_latitude.toFixed(6)}, {data.location_longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Profile Picture?"
        message="Are you sure you want to remove your profile picture? This action cannot be undone."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}