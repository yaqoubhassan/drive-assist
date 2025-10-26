import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WarningLightsIndexProps, WarningLight } from '@/types/maintenance';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Filter,
  TrendingUp,
  Eye,
  ArrowRight,
} from 'lucide-react';

// Warning Light Card Component
interface WarningLightCardProps {
  light: WarningLight;
  index: number;
}

function WarningLightCard({ light, index }: WarningLightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/resources/maintenance/warning-lights/${light.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${light.color_badge.bg_class} ${light.color_badge.color}`}>
                {light.color_badge.label}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${light.severity_badge.bg_class} ${light.severity_badge.color}`}>
                {light.severity === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {light.severity === 'warning' && <AlertCircle className="w-3 h-3 mr-1" />}
                {light.severity_badge.label}
              </span>
              {light.is_common && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Common
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {light.name}
            </h3>
          </div>

          {/* Icon */}
          {light.icon_image ? (
            <img
              src={light.icon_image}
              alt={light.icon_description}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className={`w-12 h-12 rounded-lg ${light.color_badge.bg_class} flex items-center justify-center`}>
              <AlertCircle className={`w-6 h-6 ${light.color_badge.color}`} />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {light.icon_description}
        </p>

        {/* What it means preview */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {light.what_it_means}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {light.view_count.toLocaleString()} views
            </div>
            {!light.can_continue_driving && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Stop driving!
              </span>
            )}
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function WarningLightsIndex({
  warningLights,
  severities,
  colors,
  searchQuery,
  currentSeverity,
  currentColor,
  currentSort,
}: WarningLightsIndexProps) {
  const [search, setSearch] = useState(searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/resources/maintenance/warning-lights', {
      search,
      severity: currentSeverity,
      color: currentColor,
      sort: currentSort,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    router.get('/resources/maintenance/warning-lights', {
      search: searchQuery,
      severity: key === 'severity' ? value : currentSeverity,
      color: key === 'color' ? value : currentColor,
      sort: key === 'sort' ? value : currentSort,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    router.get('/resources/maintenance/warning-lights');
  };

  const hasActiveFilters = currentSeverity || currentColor || searchQuery;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Dashboard Warning Lights - DriveAssist" />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard Warning Lights
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Understand what those dashboard lights mean and what action you should take.
                From critical warnings to routine maintenance reminders.
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-lg mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                    Important Safety Notice
                  </h3>
                  <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
                    While this guide provides general information about warning lights, always consult your
                    vehicle's owner manual for specific meanings and recommended actions. If you see a red
                    warning light, stop driving as soon as it's safe to do so and seek professional help
                    immediately.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8"
            >
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search warning lights (e.g., check engine, oil pressure...)"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </form>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </span>
                  {hasActiveFilters && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {/* Severity Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity
                    </label>
                    <select
                      value={currentSeverity || ''}
                      onChange={(e) => handleFilterChange('severity', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">All Severities</option>
                      {Object.entries(severities).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Light Color
                    </label>
                    <select
                      value={currentColor || ''}
                      onChange={(e) => handleFilterChange('color', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">All Colors</option>
                      {Object.entries(colors).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={currentSort || 'name'}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="severity">Severity (Critical First)</option>
                      <option value="popular">Most Popular</option>
                      <option value="recent">Recently Updated</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Warning Lights Grid */}
            {warningLights.data.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSeverity
                      ? `${severities[currentSeverity]} Warning Lights`
                      : currentColor
                        ? `${colors[currentColor]} Warning Lights`
                        : 'All Warning Lights'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Showing {warningLights.data.length} of {warningLights.total} lights
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {warningLights.data.map((light, index) => (
                    <WarningLightCard key={light.id} light={light} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {warningLights.last_page > 1 && (
                  <div className="flex justify-center gap-2">
                    {warningLights.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-4 py-2 rounded-lg ${link.active
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                          } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No warning lights found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No warning lights match "${searchQuery}". Try a different search term.`
                    : 'No warning lights match your current filters. Try adjusting your filters.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                    Color Coding Guide
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <strong>Red:</strong> Critical - Stop driving immediately when safe
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <strong>Yellow/Amber:</strong> Warning - Address soon, monitor closely
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <strong>Green:</strong> System is working/active
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      <strong>Blue:</strong> Information or feature indicator
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}