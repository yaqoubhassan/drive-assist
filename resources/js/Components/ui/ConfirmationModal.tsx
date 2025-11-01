import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export type ConfirmationVariant = 'danger' | 'warning' | 'success' | 'info';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: ExclamationTriangleIcon,
    iconBgColor: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white',
  },
  success: {
    icon: CheckCircleIcon,
    iconBgColor: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white',
  },
  info: {
    icon: InformationCircleIcon,
    iconBgColor: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white',
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    // Don't auto-close - let parent handle it after async operations
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={isLoading ? () => { } : onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                <div className="p-6">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                    className="mx-auto flex items-center justify-center mb-4"
                  >
                    <div className={`w-16 h-16 rounded-full ${config.iconBgColor} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${config.iconColor}`} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2"
                  >
                    {title}
                  </Dialog.Title>

                  {/* Message */}
                  <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                    {message}
                  </Dialog.Description>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelText}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${config.confirmButtonClass}`}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        confirmText
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}