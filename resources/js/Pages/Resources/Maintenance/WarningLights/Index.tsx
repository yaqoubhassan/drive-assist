import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WarningLightsIndexProps } from '@/types/maintenance';
import WarningLightCard from '@/Components/maintenance/WarningLightCard';
import {
  ArrowLeft,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react';

const severities = {
  info: 'Info',
  caution: 'Caution',
  warning: 'Warning',
  critical: 'Critical',
};

const colors = {
  red: 'Red',
  yellow: 'Yellow',
  amber: 'Amber',
  orange: 'Orange',
  blue: 'Blue',
  green: 'Green',
  white: 'White',
};

const sortOptions = {
  severity: 'By Severity',
  popular: 'Most Common',
  alphabetical: 'Alphabetical',
};

export default function WarningLightsIndex({
  warningLights,
  searchQuery = '',
  currentSeverity = '',
  currentColor = '',
  currentSort = 'severity',
}: WarningLightsIndexProps) {
  const [search, setSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchQuery) {
        handleSearch(search);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.get(`/resources/maintenance/warning-lights?${params.toString()}`, {}, { preserveState: true });
  };

  const handleSeverityChange = (severity: string) => {
    const params = new URLSearchParams(window.location.search);
    if (severity) {
      params.set('severity', severity);
    } else {
      params.delete('severity');
    }
    router.get(`/resources/maintenance/warning-lights?${params.toString()}`, {}, { preserveState: true });
  };

  const handleColorChange = (color: string) => {
    const params = new URLSearchParams(window.location.search);
    if (color) {
      params.set('color', color);
    } else {
      params.delete('color');
    }
    router.get(`/resources/maintenance/warning-lights?${params.toString()}`, {}, { preserveState: true });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', sort);
    router.get(`/resources/maintenance/warning-lights?${params.toString()}`, {}, { preserveState: true });
  };

  const clearFilters = () => {
    setSearch('');
    router.get('/resources/maintenance/warning-lights', {}, { preserveState: true });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Dashboard Warning Lights - DriveAssist" />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link
                href="/resources/maintenance"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Maintenance
              </Link>
            </div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard Warning Lights
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Understand what those dashboard lights mean and what action you should take
              </p>
            </motion.div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search warning lights..."
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Filter Toggle (Mobile) */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>

              {/* Filters */}
              <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4`}>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Severity Filter */}
                  <select
                    value={currentSeverity}
                    onChange={(e) => handleSeverityChange(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="">All Severities</option>
                    {Object.entries(severities).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>

                  {/* Color Filter */}
                  <select
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="">All Colors</option>
                    {Object.entries(colors).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value} Light
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {Object.entries(sortOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>

                  {/* Clear Filters */}
                  {(searchQuery || currentSeverity || currentColor) && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Important Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-6 rounded-lg mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                    Safety First
                  </h3>
                  <p className="text-red-800 dark:text-red-200">
                    If you see a red warning light or the check engine light is flashing, pull over safely
                    and turn off your engine immediately. Some warnings indicate serious safety issues.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Warning Lights Grid */}
            {warningLights.data.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSeverity
                      ? `${severities[currentSeverity as keyof typeof severities]} Warning Lights`
                      : currentColor
                        ? `${colors[currentColor as keyof typeof colors]} Warning Lights`
                        : 'All Warning Lights'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Showing {warningLights.data.length} of {warningLights.total} warning lights
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
                    ? `No lights found matching "${searchQuery}"`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}