import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import DriverLayout from '@/Layouts/DriverLayout';
import {
  AlertTriangle,
  RefreshCcw,
  Home,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';

interface Diagnosis {
  id: number;
  category: string;
  user_description: string;
  created_at: string;
}

interface ErrorProps {
  auth?: {
    user?: any;
  };
  diagnosis: Diagnosis;
  error: string;
}

export default function Error({ auth, diagnosis, error }: ErrorProps) {
  const Layout = auth?.user ? DriverLayout : GuestLayout;

  const handleRetry = () => {
    // Navigate back to create page with pre-filled data
    router.visit(route('diagnose.create'), {
      method: 'get',
      data: {
        category: diagnosis.category,
        description: diagnosis.user_description,
      },
    });
  };

  return (
    <Layout>
      <Head title="Diagnosis Error" />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Error Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
              >
                <AlertTriangle className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Diagnosis Failed
              </h1>
              <p className="text-red-100">
                We couldn't process your diagnosis at this time
              </p>
            </div>

            {/* Error Content */}
            <div className="p-8 space-y-6">
              {/* Error Message */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>

              {/* What Happened Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  What Happened?
                </h2>
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI service encountered an issue while analyzing your vehicle problem.
                    This could be due to:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <li>Temporary service unavailability</li>
                    <li>Network connectivity issues</li>
                    <li>Insufficient information in the description</li>
                    <li>Image processing difficulties</li>
                  </ul>
                </div>
              </div>

              {/* What You Can Do */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What You Can Do
                </h2>
                <div className="grid gap-4">
                  {/* Retry Button */}
                  <motion.button
                    onClick={handleRetry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    <span>Try Again with More Details</span>
                  </motion.button>

                  {/* Contact Expert Button */}
                  <Link
                    href={route('experts.index')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Skip AI & Contact Expert Directly</span>
                  </Link>

                  {/* Go Home Button */}
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span>Return to Homepage</span>
                  </Link>
                </div>
              </div>

              {/* Tips for Better Results */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Tips for Better Results:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Provide a detailed description (at least 50 characters)</li>
                  <li>• Include when the problem started</li>
                  <li>• Describe any sounds, smells, or visual issues</li>
                  <li>• Upload clear photos of the problem area</li>
                  <li>• Mention your vehicle's make, model, and year</li>
                </ul>
              </div>

              {/* Support Information */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Still having trouble?
                </p>
                <a
                  href="mailto:support@driveassist.com"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Contact our support team →
                </a>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Go back</span>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}