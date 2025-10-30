import React from 'react';
import { Link } from '@inertiajs/react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface KycData {
  kyc_status: string;
  kyc_status_label: string;
  status_badge_color: string;
  completion_percentage: number;
  is_approved: boolean;
  is_pending_review: boolean;
  is_rejected: boolean;
  needs_resubmission: boolean;
  rejection_reason: string | null;
}

interface Props {
  kyc: KycData;
}

export default function KycStatusBanner({ kyc }: Props) {
  if (kyc.is_approved) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
              KYC Approved! 🎉
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your account is fully verified. You can now respond to all leads and access all features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (kyc.is_pending_review) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
              Under Review
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your KYC documents are being reviewed by our team. This usually takes 24-48 hours.
              We'll notify you once the review is complete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (kyc.is_rejected) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
              KYC Rejected
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">
              {kyc.rejection_reason || 'Your KYC verification was rejected. Please review and resubmit.'}
            </p>
            <Link
              href={route('expert.kyc.index')}
              className="text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline"
            >
              Update and Resubmit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (kyc.needs_resubmission) {
    return (
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-1">
              Resubmission Required
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
              {kyc.rejection_reason || 'Please update your information and resubmit for review.'}
            </p>
            <Link
              href={route('expert.kyc.index')}
              className="text-sm font-medium text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 underline"
            >
              Update and Resubmit
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not started or in progress
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              Complete your KYC to unlock all features
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {kyc.completion_percentage}% complete • Respond to leads and build trust with verified status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}