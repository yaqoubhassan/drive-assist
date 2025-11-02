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
        onChange([...images, ...validFiles]);
      }
    },
    [images, maxFiles, maxSize, onChange]
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
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
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
        <input {...getInputProps()} disabled={images.length >= maxFiles} />

        {/* Icon */}
        <motion.div
          animate={isDragActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4"
        >
          {isDragActive ? (
            <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          ) : (
            <Upload className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          )}
        </motion.div>

        {/* Text */}
        <div>
          {isDragActive ? (
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Drop your images here!
            </p>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {images.length >= maxFiles
                  ? `Maximum ${maxFiles} images reached`
                  : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                or click to browse
              </p>
            </>
          )}
        </div>

        {/* Info */}
        {images.length < maxFiles && (
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span>• Up to {maxFiles} images</span>
            <span>• Max {maxSize / (1024 * 1024)}MB each</span>
            <span>• JPG, PNG, WEBP</span>
          </div>
        )}

        {/* Progress Indicator */}
        {images.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {images.length} / {maxFiles} images uploaded
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {images.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Image Preview */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200" />

                  {/* Remove Button */}
                  <motion.button
                    type="button"
                    onClick={() => removeImage(index)}
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-xs text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-300">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                {/* Index Badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Errors */}
      <AnimatePresence>
        {(error || uploadErrors.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            )}
            {uploadErrors.map((err, idx) => (
              <p
                key={idx}
                className="text-sm text-red-600 dark:text-red-400 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {err}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {images.length === 0 && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          📸 Clear photos help our AI provide more accurate diagnoses
        </p>
      )}
    </div>
  );
}