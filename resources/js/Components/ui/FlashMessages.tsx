import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FlashMessage {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

export default function FlashMessages() {
  const { flash } = usePage<{ flash: FlashMessage; auth: { user: any } }>().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    if (flash?.success) {
      setMessage({ type: 'success', text: flash.success });
      setVisible(true);
    } else if (flash?.error) {
      setMessage({ type: 'error', text: flash.error });
      setVisible(true);
    } else if (flash?.warning) {
      setMessage({ type: 'warning', text: flash.warning });
      setVisible(true);
    } else if (flash?.info) {
      setMessage({ type: 'info', text: flash.info });
      setVisible(true);
    }
  }, [flash]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000); // Auto-hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!message) return null;

  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-200',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
    },
  };

  const currentColors = colors[message.type as keyof typeof colors];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <div className={`${currentColors.bg} ${currentColors.border} border rounded-lg shadow-lg p-4`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <CheckCircleIcon className={`w-6 h-6 ${currentColors.icon}`} />
                ) : (
                  <XCircleIcon className={`w-6 h-6 ${currentColors.icon}`} />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${currentColors.text}`}>
                  {message.text}
                </p>
              </div>
              <button
                onClick={() => setVisible(false)}
                className={`flex-shrink-0 ${currentColors.icon} hover:opacity-75 transition-opacity`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}