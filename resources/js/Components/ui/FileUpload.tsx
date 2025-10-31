import React, { useRef, useState, useCallback } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  documentType: string;
  currentFileUrl?: string | null;
  currentFilePath?: string | null;
  onUploadSuccess: (path: string, url: string) => void;
  onRemove?: () => void;
  label?: string;
  description?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({
  documentType,
  currentFileUrl,
  currentFilePath,
  onUploadSuccess,
  onRemove,
  label = 'Upload Document',
  description = 'Drag and drop your file here, or click to browse',
  acceptedTypes = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  required = false,
  disabled = false,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = acceptedTypes.split(',').map(ext => ext.trim().toLowerCase());

    if (!allowedExtensions.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes}`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);

    try {
      // Simulate progress (since we can't track real upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(route('expert.kyc.upload-document'), {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        onUploadSuccess(result.path, result.url);
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      uploadFile(file);
    },
    [documentType, onUploadSuccess]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  const hasFile = !!(currentFileUrl || currentFilePath);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area or File Display */}
      <AnimatePresence mode="wait">
        {hasFile && !isUploading ? (
          // File Uploaded State
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                    Document uploaded successfully
                  </p>
                  {currentFileUrl && (
                    <a
                      href={currentFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 dark:text-green-400 hover:underline break-all"
                    >
                      View document
                    </a>
                  )}
                </div>
              </div>
              {!disabled && (
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors ml-2"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>
              )}
            </div>
          </motion.div>
        ) : isUploading ? (
          // Uploading State
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <CloudArrowUpIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </motion.div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Upload Area
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              disabled={disabled}
              className="hidden"
              aria-label={label}
            />

            <div className="flex flex-col items-center">
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isDragging ? 'Drop your file here' : description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {acceptedTypes.toUpperCase().replace(/\./g, '').replace(/,/g, ', ')} (max {maxSizeMB}MB)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {description && !hasFile && !isUploading && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          ✓ Your document is encrypted and securely stored
        </p>
      )}
    </div>
  );
}