import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { GuidesIndexProps } from '@/types/maintenance';
import MaintenanceGuideCard from '@/Components/maintenance/MaintenanceGuideCard';
import {
  ArrowLeft,
  Search,
  Filter,
  Wrench,
  Star,
} from 'lucide-react';
import { BackButton } from '@/Components/ui';

const categories = {
  fluid_check: 'Fluid Check',
  filter_replacement: 'Filter Replacement',
  tire_maintenance: 'Tire Maintenance',
  brake_maintenance: 'Brake Maintenance',
  engine_maintenance: 'Engine Maintenance',
  electrical: 'Electrical',
  seasonal: 'Seasonal',
  general: 'General',
};

const sortOptions = {
  popular: 'Most Popular',
  newest: 'Newest',
  title: 'Alphabetical',
  time: 'Quickest First',
};

export default function GuidesIndex({
  guides,
  popularGuides,
  searchQuery = '',
  currentCategory = '',
  currentSort = 'popular',
}: GuidesIndexProps) {
  const [search, setSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
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
    router.get(`/resources/maintenance/guides?${params.toString()}`, {}, { preserveState: true });
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.get(`/resources/maintenance/guides?${params.toString()}`, {}, { preserveState: true });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', sort);
    router.get(`/resources/maintenance/guides?${params.toString()}`, {}, { preserveState: true });
  };

  const clearFilters = () => {
    setSearch('');
    router.get('/resources/maintenance/guides', {}, { preserveState: true });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Maintenance Guides - DriveAssist" />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <BackButton href="/resources/maintenance" label="Back to Maintenance" className="mb-6" />

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Maintenance Guides
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Step-by-step instructions for common vehicle maintenance tasks
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
                      placeholder="Search maintenance guides..."
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
                  {/* Category Filter */}
                  <select
                    value={currentCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(categories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="pl-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {Object.entries(sortOptions).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>

                  {/* Clear Filters */}
                  {(searchQuery || currentCategory) && (
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

            {/* Popular Guides (Only show when no filters) */}
            {!searchQuery && !currentCategory && popularGuides.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Popular Guides
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {popularGuides.map((guide, index) => (
                    <MaintenanceGuideCard key={guide.id} guide={guide} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* All Guides */}
            {guides.data.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentCategory !== 'all'
                      ? `${categories[currentCategory as keyof typeof categories]} Guides`
                      : 'All Guides'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Showing {guides.data.length} of {guides.total} guides
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {guides.data.map((guide, index) => (
                    <MaintenanceGuideCard key={guide.id} guide={guide} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {guides.last_page > 1 && (
                  <div className="flex justify-center gap-2">
                    {guides.links.map((link, index) => (
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
                  <Wrench className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No guides found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No guides found matching "${searchQuery}"`
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