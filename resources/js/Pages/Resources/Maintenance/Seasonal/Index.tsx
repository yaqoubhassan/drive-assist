import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SeasonalChecklistsIndexProps, SeasonalChecklist } from '@/types/maintenance';
import {
  Calendar,
  Clock,
  DollarSign,
  Search,
  Filter,
  CheckCircle,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Seasonal Checklist Card Component
interface ChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

function ChecklistCard({ checklist, index }: ChecklistCardProps) {
  // Ensure checklist_items is an array
  const items = Array.isArray(checklist.checklist_items)
    ? checklist.checklist_items
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/resources/maintenance/seasonal/${checklist.slug}`}
        className="group block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${checklist.season_info.bg_class}`}>
                <span className="text-xl mr-2">{checklist.season_info.emoji}</span>
                {checklist.season.charAt(0).toUpperCase() + checklist.season.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                {items.length} items
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
              {checklist.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {checklist.description}
        </p>

        {/* Preview Checklist Items */}
        {items.length > 0 && (
          <div className="space-y-2 mb-4">
            {items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.priority === 'critical' ? 'text-red-500' :
                  item.priority === 'high' ? 'text-orange-500' :
                    item.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                  }`} />
                <span className="line-clamp-1">{item.item}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                +{items.length - 3} more items
              </p>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {checklist.formatted_time}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {checklist.formatted_cost_range}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {checklist.view_count.toLocaleString()}
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function SeasonalChecklistsIndex({
  checklists,
  seasons,
  searchQuery,
  currentSeason,
  currentSort,
}: SeasonalChecklistsIndexProps) {
  const [search, setSearch] = useState(searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/resources/maintenance/seasonal', {
      search,
      season: currentSeason,
      sort: currentSort,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    router.get('/resources/maintenance/seasonal', {
      search: searchQuery,
      season: key === 'season' ? value : currentSeason,
      sort: key === 'sort' ? value : currentSort,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const sortOptions = [
    { value: 'season', label: 'By Season' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'helpful', label: 'Most Helpful' },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Head title="Seasonal Maintenance Checklists - DriveAssist Resources" />

        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Seasonal Maintenance Checklists
              </h1>
              <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
                Prepare your vehicle for every season with comprehensive maintenance checklists
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search seasonal checklists..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </form>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Season Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Season
                  </label>
                  <select
                    value={currentSeason || 'all'}
                    onChange={(e) => handleFilterChange('season', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(seasons).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={currentSort || 'season'}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{checklists.data.length}</span> of{' '}
              <span className="font-semibold">{checklists.total}</span> checklists
            </p>
          </div>

          {/* Checklists Grid */}
          {checklists.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {checklists.data.map((checklist, index) => (
                  <ChecklistCard key={checklist.id} checklist={checklist} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {checklists.last_page > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  {checklists.links[0].url && (
                    <Link
                      href={checklists.links[0].url}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      preserveState
                      preserveScroll
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Link>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {checklists.links.slice(1, -1).map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`px-4 py-2 rounded-lg transition-colors ${link.active
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        preserveState
                        preserveScroll
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Next Button */}
                  {checklists.links[checklists.links.length - 1].url && (
                    <Link
                      href={checklists.links[checklists.links.length - 1].url || '#'}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      preserveState
                      preserveScroll
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No checklists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  router.get('/resources/maintenance/seasonal', {}, {
                    preserveState: false,
                  });
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}