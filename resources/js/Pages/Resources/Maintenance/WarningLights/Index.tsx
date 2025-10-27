import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import WarningLightCard from '@/Components/maintenance/WarningLightCard';
// import EmptyState from '@/Components/resources/EmptyState';
import {
  EmptyState,
  Pagination,
} from '@/Components/ui';
import { WarningLightsIndexProps } from '@/types/maintenance';
import {
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { BackButton } from '@/Components/ui';

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

  const handleClearFilters = () => {
    setSearch('');
    router.get('/resources/maintenance/warning-lights', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const hasActiveFilters = searchQuery || currentSeverity || currentColor || currentSort !== 'name';

  return (
    <ThemeProvider>
      <Head title="Warning Lights Guide | DriveAssist Resources" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />

        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton href="/resources/maintenance" label="Back to Maintenance" className="mb-6" />

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <AlertTriangle className="w-4 h-4" />
                Dashboard Warning Lights
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Understanding Your Dashboard Warning Lights
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Learn what each warning light means, what causes it, and what you should do when it appears.
              </p>
            </motion.div>

            {/* Important Safety Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-2 border-rose-300 dark:border-rose-800 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-2">
                    ⚠️ Important Safety Notice
                  </h3>
                  <div className="space-y-2 text-sm text-rose-800 dark:text-rose-300">
                    <p>
                      <strong>If a red warning light appears while driving:</strong> This typically indicates a serious issue that requires immediate attention. Pull over safely as soon as possible and turn off the engine.
                    </p>
                    <p>
                      <strong>Never ignore warning lights:</strong> What seems like a minor issue can quickly become a major (and expensive) problem. When in doubt, consult a professional mechanic.
                    </p>
                    <p>
                      <strong>Disclaimer:</strong> This guide provides general information only. Always consult your vehicle's owner manual and a qualified mechanic for specific advice about your car.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Color Coding Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
            >
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Understanding Warning Light Colors
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Warning lights use a color-coded system to indicate severity. Here's what each color means:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Red */}
                <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-200 dark:border-rose-800/50">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-900 dark:text-rose-200 mb-1">
                      🔴 Red Lights
                    </h4>
                    <p className="text-sm text-rose-800 dark:text-rose-300">
                      <strong>Critical:</strong> Stop driving immediately. Indicates a serious safety issue that requires immediate attention.
                    </p>
                  </div>
                </div>

                {/* Yellow/Amber */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/50">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                      ⚠️ Yellow/Amber Lights
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <strong>Warning:</strong> Something needs attention soon. You can continue driving but schedule service as soon as possible.
                    </p>
                  </div>
                </div>

                {/* Orange */}
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800/50">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-1">
                      🟠 Orange Lights
                    </h4>
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      <strong>Caution:</strong> Similar to yellow - address the issue but not necessarily urgent. Schedule a service appointment.
                    </p>
                  </div>
                </div>

                {/* Blue */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/50">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">
                      🔵 Blue Lights
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Informational:</strong> Usually indicates a feature is active (like high beams). Not a warning - just information.
                    </p>
                  </div>
                </div>

                {/* Green */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                      🟢 Green Lights
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                      <strong>Normal Operation:</strong> Indicates that a system is working properly (like turn signals). No action needed.
                    </p>
                  </div>
                </div>

                {/* White */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-200 mb-1">
                      ⚪ White Lights
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Information:</strong> Provides general information or indicates a system is active. Typically non-urgent.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
            >
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search warning lights (e.g., 'check engine', 'oil', 'brake')..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </form>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </span>
                  {hasActiveFilters && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Filter Options */}
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
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

            {/* Results Section */}
            {warningLights.data.length > 0 ? (
              <>
                {/* Results Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mb-6"
                >
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
                </motion.div>

                {/* Warning Lights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {warningLights.data.map((light, index) => (
                    <WarningLightCard key={light.id} light={light} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  links={warningLights.links}
                  currentPage={warningLights.current_page}
                  lastPage={warningLights.last_page}
                  className="mt-8"
                />
              </>
            ) : (

              <EmptyState
                variant="search"
                title="No warning lights found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{
                  label: 'Clear Filters',
                  onClick: handleClearFilters,
                }}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}