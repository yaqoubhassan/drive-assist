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
} from 'lucide-react';

// Seasonal Checklist Card Component
interface ChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

function ChecklistCard({ checklist, index }: ChecklistCardProps) {
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
                {checklist.checklist_items.length} items
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
        <div className="space-y-2 mb-4">
          {checklist.checklist_items.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.priority === 'critical' ? 'text-red-500' :
                item.priority === 'high' ? 'text-orange-500' :
                  item.priority === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                }`} />
              <span className="line-clamp-1">{item.item}</span>
            </div>
          ))}
          {checklist.checklist_items.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
              +{checklist.checklist_items.length - 3} more items
            </p>
          )}
        </div>

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

  const clearFilters = () => {
    router.get('/resources/maintenance/seasonal');
  };

  const hasActiveFilters = currentSeason || searchQuery;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Seasonal Maintenance Checklists - DriveAssist" />

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
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Seasonal Maintenance Checklists
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Prepare your vehicle for every season with our comprehensive maintenance checklists.
                Keep your car running smoothly year-round.
              </p>
            </motion.div>

            {/* Season Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {Object.entries(seasons).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange('season', currentSeason === key ? '' : key)}
                  className={`p-4 rounded-xl border-2 transition-all ${currentSeason === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <div className="text-3xl mb-2">
                    {key === 'spring' && '🌸'}
                    {key === 'summer' && '☀️'}
                    {key === 'fall' && '🍂'}
                    {key === 'winter' && '❄️'}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {label}
                  </div>
                </button>
              ))}
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
                    placeholder="Search seasonal checklists..."
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
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Season Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Season
                    </label>
                    <select
                      value={currentSeason || ''}
                      onChange={(e) => handleFilterChange('season', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="">All Seasons</option>
                      {Object.entries(seasons).map(([key, label]) => (
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
                      value={currentSort || 'season'}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="season">By Season</option>
                      <option value="popular">Most Popular</option>
                      <option value="time">By Time (Shortest)</option>
                      <option value="cost">By Cost (Lowest)</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Checklists Grid */}
            {checklists.data.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSeason
                      ? `${seasons[currentSeason]} Maintenance`
                      : 'All Seasonal Checklists'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Showing {checklists.data.length} of {checklists.total} checklists
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {checklists.data.map((checklist, index) => (
                    <ChecklistCard key={checklist.id} checklist={checklist} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {checklists.last_page > 1 && (
                  <div className="flex justify-center gap-2">
                    {checklists.links.map((link, index) => (
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
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No checklists found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No checklists match "${searchQuery}". Try a different search term.`
                    : 'No checklists match your current filters. Try adjusting your filters.'}
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

            {/* Why Seasonal Maintenance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Why Seasonal Maintenance Matters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div>
                  <p className="mb-2">
                    <strong>Prevent Breakdowns:</strong> Seasonal changes put stress on your vehicle. Regular maintenance helps prevent unexpected failures.
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <strong>Save Money:</strong> Catching problems early costs less than major repairs from neglect.
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <strong>Stay Safe:</strong> Weather-related issues can compromise safety. Proper preparation keeps you protected.
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Extend Vehicle Life:</strong> Regular seasonal care keeps your vehicle running longer and maintains its value.
                  </p>
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