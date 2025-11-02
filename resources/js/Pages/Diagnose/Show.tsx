import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Wrench,
  DollarSign,
  Clock,
  Car,
  MapPin,
  Share2,
  Printer,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';
import DriverLayout from '@/Layouts/DriverLayout';

interface Diagnosis {
  id: number;
  category: string;
  user_description: string;
  identified_issue: string;
  confidence_score: number;
  explanation: string;
  diy_steps: string[];
  safety_warnings: string | null;
  estimated_cost_min: number;
  estimated_cost_max: number;
  urgency_level: 'low' | 'medium' | 'critical';
  safe_to_drive: boolean;
  safe_to_drive_notes?: string;
  created_at: string;
  images?: Array<{
    id: number;
    image_url: string;
  }>;
}

interface PageProps {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
  diagnosis: Diagnosis;
}

const urgencyConfig = {
  low: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: CheckCircle2,
    label: 'Low Priority',
    description: 'No immediate concern, but keep monitoring',
  },
  medium: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle,
    label: 'Medium Priority',
    description: 'Get this fixed within the next week',
  },
  critical: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertCircle,
    label: 'Critical - Urgent',
    description: 'Stop driving immediately and get help',
  },
};

export default function Show({ auth, diagnosis }: PageProps) {
  const urgency = urgencyConfig[diagnosis.urgency_level];
  const UrgencyIcon = urgency.icon;
  const Layout = auth?.user ? DriverLayout : GuestLayout;

  return (
    <Layout>
      <Head title={`Diagnosis: ${diagnosis.identified_issue}`} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 py-8 sm:py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/diagnose"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
            >
              ← New Diagnosis
            </Link>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Printer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Success Banner */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Diagnosis Complete!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We've analyzed your vehicle issue and prepared recommendations
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {diagnosis.confidence_score}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Diagnosis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Identified */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Issue Identified
              </h2>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {diagnosis.identified_issue}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {diagnosis.explanation}
              </p>
            </motion.div>

            {/* Safety Warning */}
            {diagnosis.safety_warnings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Safety Warning
                </h3>
                <p className="text-red-800 dark:text-red-300">{diagnosis.safety_warnings}</p>
              </motion.div>
            )}

            {/* DIY Steps */}
            {diagnosis.diy_steps && diagnosis.diy_steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  DIY Troubleshooting Steps
                </h3>
                <div className="space-y-4">
                  {diagnosis.diy_steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Images */}
            {diagnosis.images && diagnosis.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {diagnosis.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.image_url}
                      alt="Diagnosis"
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Urgency Level */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`${urgency.bg} ${urgency.border} border-2 rounded-2xl p-6`}
            >
              <div className="flex items-start gap-3 mb-3">
                <UrgencyIcon className={`w-8 h-8 ${urgency.color} flex-shrink-0`} />
                <div>
                  <h3 className={`text-lg font-bold ${urgency.color} mb-1`}>
                    {urgency.label}
                  </h3>
                  <p className={`text-sm ${urgency.color} opacity-90`}>
                    {urgency.description}
                  </p>
                </div>
              </div>
              <div className={`mt-4 p-3 rounded-lg ${urgency.bg} border ${urgency.border}`}>
                <div className="flex items-center gap-2 text-sm">
                  <Car className={`w-5 h-5 ${urgency.color}`} />
                  <span className={`font-semibold ${urgency.color}`}>
                    {diagnosis.safe_to_drive ? 'Safe to drive' : 'Do not drive'}
                  </span>
                </div>
                {diagnosis.safe_to_drive_notes && (
                  <p className={`text-sm mt-2 ${urgency.color} opacity-90`}>
                    {diagnosis.safe_to_drive_notes}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Cost Estimate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                Estimated Cost
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ${diagnosis.estimated_cost_min} - ${diagnosis.estimated_cost_max}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Includes parts and labor
              </p>
            </motion.div>

            {/* Find Expert CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <h3 className="text-lg font-bold mb-2">Need Professional Help?</h3>
              <p className="text-sm text-blue-50 mb-4">
                Connect with verified local experts who can fix this issue
              </p>
              <Link
                href="/experts"
                className="block w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                Find Local Experts
                <MapPin className="inline-block w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Was this helpful?
              </h3>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 font-medium transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  Yes
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-medium transition-colors">
                  <ThumbsDown className="w-5 h-5" />
                  No
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}