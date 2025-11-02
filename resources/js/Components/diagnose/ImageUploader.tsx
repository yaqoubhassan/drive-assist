import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  X,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle,
  Camera,
  Trash2,
} from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  onChange: (files: File[]) => void;
  error?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export default function ImageUploader({
  images = [],
  onChange,
  error,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
}: ImageUploaderProps) {
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadErrors([]);
      const errors: string[] = [];

      // Check if adding these files would exceed the limit
      if (images.length + acceptedFiles.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} images allowed`);
        setUploadErrors(errors);
        return;
      }

      // Validate each file
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          errors.push(`${file.name} is too large (max ${maxSize / (1024 * 1024)}MB)`);
          return false;
        }
        return true;
      });

      // Handle rejected files
      rejectedFiles.forEach((rejection) => {
        errors.push(`${rejection.file.name}: ${rejection.errors[0].message}`);
      });

      if (errors.length > 0) {
        setUploadErrors(errors);
      }

      if (validFiles.length > 0) {
        // Create preview URLs for new files
        const newPreviewUrls = new Map(previewUrls);
        validFiles.forEach((file) => {
          if (!newPreviewUrls.has(file)) {
            newPreviewUrls.set(file, URL.createObjectURL(file));
          }
        });
        setPreviewUrls(newPreviewUrls);

        // Update parent component
        onChange([...images, ...validFiles]);
      }
    },
    [images, maxFiles, maxSize, onChange, previewUrls]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: maxFiles - images.length,
    maxSize,
    disabled: images.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    const fileToRemove = images[index];

    // Revoke the object URL to free memory
    const urlToRevoke = previewUrls.get(fileToRemove);
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
      const newPreviewUrls = new Map(previewUrls);
      newPreviewUrls.delete(fileToRemove);
      setPreviewUrls(newPreviewUrls);
    }

    // Remove from images array
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    // Clear any errors when removing an image
    if (uploadErrors.length > 0) {
      setUploadErrors([]);
    }
  };

  const removeAllImages = () => {
    // Revoke all object URLs
    previewUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    setPreviewUrls(new Map());

    // Clear all images
    onChange([]);
    setUploadErrors([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          {/* Upload Icon */}
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center space-y-4"
          >
            {isDragActive ? (
              <Camera className="w-12 h-12 text-blue-500" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}

            <div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isDragActive ? 'Drop images here' : 'Upload vehicle photos'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                JPG, PNG, WEBP • Max {maxSize / (1024 * 1024)}MB • Up to {maxFiles} images
              </p>
            </div>

            {/* Upload Stats */}
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <ImageIcon className="w-4 h-4" />
              <span>
                {images.length} / {maxFiles} images
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Previews Grid */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Header with Remove All Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
                </span>
              </div>

              {images.length > 1 && (
                <motion.button
                  type="button"
                  onClick={removeAllImages}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove All</span>
                </motion.button>
              )}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((file, index) => {
                const previewUrl = previewUrls.get(file) || URL.createObjectURL(file);

                return (
                  <motion.div
                    key={`${file.name}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Image Preview */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200" />

                      {/* Remove Button - Always Visible on Mobile, Hover on Desktop */}
                      <motion.button
                        type="button"
                        onClick={() => removeImage(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-700 transition-all duration-200 shadow-lg z-10"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>

                      {/* File Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs text-white truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Image Number Badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                        #{index + 1}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Errors */}
      <AnimatePresence>
        {uploadErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                  Upload Error{uploadErrors.length > 1 ? 's' : ''}
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Error from Parent */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {images.length === 0 && (
        <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-medium mb-1">💡 Tip: Photos help us diagnose better!</p>
            <p className="text-blue-700 dark:text-blue-300">
              Take clear photos of the problem area, dashboard warning lights, or any visible damage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}