import { Head, Link } from '@inertiajs/react';
import ExpertDashboardLayout from '@/Layouts/Expertdashboardlayout';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BriefcaseIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KycInfo {
  kyc_status: string;
  completion_percentage: number;
  is_approved: boolean;
  is_pending_review: boolean;
  needs_resubmission: boolean;
  rejection_reason: string | null;
}

interface DashboardProps {
  expert: {
    id: number;
    businessName: string;
    verificationStatus: string;
    rating: number;
    totalJobs: number;
    profileViews: number;
  };
  stats: {
    newLeads: number;
    activeJobs: number;
    completedJobs: number;
    monthlyEarnings: number;
    leadsThisWeek: number;
    leadsLastWeek: number;
    earningsLastMonth: number;
  };
  kycInfo?: KycInfo;
  recentLeads: Array<{
    id: number;
    driverName: string;
    message: string;
    createdAt: string;
    status: string;
  }>;
  earningsData: Array<{
    month: string;
    earnings: number;
  }>;
  jobStatusData: Array<{
    status: string;
    count: number;
  }>;
}

export default function Dashboard({ expert, stats, kycInfo, recentLeads, earningsData, jobStatusData }: DashboardProps) {
  // Calculate trend percentages
  const leadsTrend = stats.leadsLastWeek > 0
    ? ((stats.leadsThisWeek - stats.leadsLastWeek) / stats.leadsLastWeek) * 100
    : 0;

  const earningsTrend = stats.earningsLastMonth > 0
    ? ((stats.monthlyEarnings - stats.earningsLastMonth) / stats.earningsLastMonth) * 100
    : 0;

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <ExpertDashboardLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {expert.businessName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* KYC Status Banner */}
        {kycInfo && !kycInfo.is_approved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border-2 p-4 ${kycInfo.is_pending_review
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800'
              : kycInfo.needs_resubmission
                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {kycInfo.is_pending_review ? (
                    <ShieldCheckIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-semibold mb-1 ${kycInfo.is_pending_review
                    ? 'text-yellow-900 dark:text-yellow-100'
                    : 'text-blue-900 dark:text-blue-100'
                    }`}>
                    {kycInfo.is_pending_review
                      ? 'KYC Under Review'
                      : kycInfo.needs_resubmission
                        ? 'KYC Resubmission Required'
                        : 'Complete Your KYC Verification'}
                  </h3>
                  <p className={`text-sm mb-3 ${kycInfo.is_pending_review
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-blue-800 dark:text-blue-200'
                    }`}>
                    {kycInfo.is_pending_review
                      ? 'Your KYC is being reviewed by our team. This usually takes 24-48 hours.'
                      : kycInfo.needs_resubmission
                        ? kycInfo.rejection_reason || 'Please update your information and resubmit.'
                        : `${kycInfo.completion_percentage}% complete • Unlock all features by completing verification`}
                  </p>
                  {!kycInfo.is_pending_review && (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 max-w-xs bg-white dark:bg-gray-800 rounded-full h-2">
                        <motion.div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${kycInfo.completion_percentage}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <Link
                        href={route('expert.kyc.index')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        {kycInfo.completion_percentage > 0 ? 'Continue Verification' : 'Start KYC'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {kycInfo && kycInfo.is_approved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-800 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                  KYC Verified ✓
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your account is fully verified. You have access to all platform features.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* New Leads Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  New Leads
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.newLeads}
                </p>
                <div className="flex items-center mt-2">
                  {leadsTrend >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${leadsTrend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {Math.abs(leadsTrend).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    vs last week
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <UsersIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Active Jobs Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Active Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.activeJobs}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  In progress
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <BriefcaseIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Monthly Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  This Month
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${stats.monthlyEarnings.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {earningsTrend >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${earningsTrend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {Math.abs(earningsTrend).toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="h-7 w-7 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          {/* Average Rating Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {expert.rating.toFixed(1)}
                </p>
                <div className="flex items-center mt-2">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    Based on {expert.totalJobs} reviews
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <StarIcon className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Monthly Earnings
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Job Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Job Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const { name, value, index } = props;
                    const entry = jobStatusData[index];
                    const total = jobStatusData.reduce((sum, item) => sum + item.count, 0);
                    return `${entry.status}: ${((entry.count / total) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Leads & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h3>
              <Link
                href={route('expert.leads.index')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={route('expert.leads.show', lead.id)}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {lead.driverName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {lead.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span
                        className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${lead.status === 'new'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : lead.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : lead.status === 'in_progress'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}
                      >
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No new leads yet. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <EyeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {expert.profileViews}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {expert.totalJobs}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {stats.completedJobs}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ExpertDashboardLayout>
  );
}