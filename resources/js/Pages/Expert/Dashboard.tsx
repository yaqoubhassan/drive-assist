import { Head } from '@inertiajs/react';
import ExpertDashboardLayout from '@/Layouts/Expertdashboardlayout';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  BriefcaseIcon,
  StarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function Dashboard({ expert, stats, recentLeads, earningsData, jobStatusData }: DashboardProps) {
  // Calculate trend percentages
  const leadsTrend = stats.leadsLastWeek > 0
    ? ((stats.leadsThisWeek - stats.leadsLastWeek) / stats.leadsLastWeek) * 100
    : 0;

  const earningsTrend = stats.earningsLastMonth > 0
    ? ((stats.monthlyEarnings - stats.earningsLastMonth) / stats.earningsLastMonth) * 100
    : 0;

  // Stats cards data
  const statsCards = [
    {
      title: 'New Leads',
      value: stats.newLeads,
      icon: UsersIcon,
      trend: leadsTrend,
      trendLabel: 'vs last week',
      color: 'blue',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: BriefcaseIcon,
      color: 'purple',
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Monthly Earnings',
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      trend: earningsTrend,
      trendLabel: 'vs last month',
      color: 'green',
      bgColor: 'bg-green-500',
    },
    {
      title: 'Average Rating',
      value: expert.rating.toFixed(1),
      icon: StarIcon,
      suffix: '/ 5.0',
      color: 'yellow',
      bgColor: 'bg-yellow-500',
    },
  ];

  // Pie chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <ExpertDashboardLayout title="Dashboard">
      <Head title="Expert Dashboard" />

      <div className="space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {expert.businessName}! 👋
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your business today.
              </p>
            </div>
            {expert.verificationStatus === 'pending' && (
              <div className="hidden md:block">
                <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
                  ⏳ Verification Pending
                </div>
              </div>
            )}
            {expert.verificationStatus === 'approved' && (
              <div className="hidden md:block">
                <div className="bg-green-400 text-green-900 px-4 py-2 rounded-lg font-semibold flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Verified
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                {stat.trend !== undefined && (
                  <div className={`flex items-center text-sm font-semibold ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(stat.trend).toFixed(1)}%
                  </div>
                )}
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.suffix && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {stat.suffix}
                  </span>
                )}
              </div>
              {stat.trendLabel && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.trendLabel}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
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
                <Legend />
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
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
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
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
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h3>
              <a
                href={route('expert.leads.index')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => window.location.href = route('expert.leads.show', lead.id)}
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
                      <span className={`
                                                ml-4 px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0
                                                ${lead.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                                                ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                                                ${lead.status === 'in_progress' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                                            `}>
                        {lead.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
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
            transition={{ delay: 0.7 }}
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