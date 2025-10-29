import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  WrenchIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface ExpertDashboardProps {
  expert: {
    id: number;
    businessName: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    rating: number | string; // Can be number or string from database
    totalJobs: number;
    profileViews: number;
  };
  stats: {
    newLeads: number;
    activeJobs: number;
    completedJobs: number;
    monthlyEarnings: number | string; // Can be number or string from database
  };
}

export default function Dashboard({ expert, stats }: ExpertDashboardProps) {
  // Helper function to safely format rating
  const formatRating = (rating: number | string | null | undefined): string => {
    if (rating === null || rating === undefined) return '0.0';
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
  };

  // Helper function to safely format currency
  const formatCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return '0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  const getVerificationBadge = () => {
    switch (expert.verificationStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
            <ClockIcon className="w-4 h-4" />
            Pending Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-medium">
            <XCircleIcon className="w-4 h-4" />
            Not Verified
          </span>
        );
    }
  };

  const statCards = [
    {
      title: 'New Leads',
      value: stats.newLeads,
      icon: EnvelopeIcon,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/expert/leads',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: WrenchIcon,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      link: '/expert/jobs?status=active',
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: CheckCircleIcon,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      link: '/expert/jobs?status=completed',
    },
    {
      title: 'Monthly Earnings',
      value: `$${formatCurrency(stats.monthlyEarnings)}`,
      icon: CurrencyDollarIcon,
      color: 'emerald',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      link: '/expert/earnings',
    },
  ];

  return (
    <>
      <Head title="Expert Dashboard" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {expert.businessName}!
                </h1>
                <div className="flex items-center gap-3">
                  {getVerificationBadge()}
                  {expert.verificationStatus === 'pending' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We're reviewing your application
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/experts/${expert.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <EyeIcon className="w-5 h-5" />
                  View Public Profile
                </Link>
                <Link
                  href="/expert/settings"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={stat.link}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/expert/leads"
                  className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    View New Leads ({stats.newLeads})
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Respond to customer inquiries
                  </p>
                </Link>

                <Link
                  href="/expert/profile/edit"
                  className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    Update Profile
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Keep your information current
                  </p>
                </Link>

                <Link
                  href="/expert/availability"
                  className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Manage Availability
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Update your schedule
                  </p>
                </Link>
              </div>
            </motion.div>

            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Performance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRating(expert.rating)} ⭐
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on {expert.totalJobs} {expert.totalJobs === 1 ? 'job' : 'jobs'}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {expert.profileViews}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This month
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}