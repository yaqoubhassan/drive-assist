import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { UserCircle, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [userType, setUserType] = useState<'driver' | 'expert' | null>(null);

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(() => setUserType(null), 300);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl transition-all">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Content */}
                {!userType ? (
                  /* User Type Selection */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                      Welcome Back!
                    </Dialog.Title>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                      Sign in to continue
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                      How would you like to continue?
                    </p>

                    <div className="space-y-4">
                      {/* Driver Option */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUserType('driver')}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              I'm a Driver
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Diagnose issues & find experts
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      {/* Expert Option */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setUserType('expert')}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wrench className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              I'm an Expert
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Manage leads & grow business
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                          New here?
                        </span>
                      </div>
                    </div>

                    {/* Sign Up Links */}
                    <div className="text-center space-y-2">
                      <a
                        href="/register"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium block"
                      >
                        Create Driver Account
                      </a>
                      <a
                        href="/experts/signup"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium block"
                      >
                        Join as an Expert
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  /* Login Form */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginForm
                      userType={userType}
                      onBack={() => setUserType(null)}
                      onSuccess={handleClose}
                    />
                  </motion.div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog >
    </Transition >
  );
}