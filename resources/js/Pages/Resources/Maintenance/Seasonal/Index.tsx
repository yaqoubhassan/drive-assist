import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { BackButton } from '@/Components/ui/BackButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SeasonalChecklist, SeasonalChecklistsIndexProps } from '@/types/maintenance';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Search,
} from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// DEFENSIVE HELPER FUNCTION
// ============================================================================

/**
 * Ensures a value is always an array, never null or undefined
 */
const ensureArray = <T,>(value: any): T[] => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

interface ChecklistItem {
  item: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// ============================================================================
// SEASONAL CHECKLIST CARD COMPONENT - WITH FIXED HEIGHT
// ============================================================================

interface ChecklistCardProps {
  checklist: SeasonalChecklist;
  index: number;
}

function ChecklistCard({ checklist, index }: ChecklistCardProps) {
  const items = ensureArray<ChecklistItem>(checklist.checklist_items);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link
        href={`/resources/maintenance/seasonal/${checklist.slug}`}
        className="flex flex-col h-[420px] group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all"
      >
        {/* Season Header - Fixed height */}
        <div className={`flex-shrink-0 ${checklist.season_info.bg_class} p-6`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{checklist.season_info.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {checklist.title}
              </h3>
              <p className="text-sm text-white/80 capitalize truncate">
                {checklist.season} Preparation
              </p>
            </div>
          </div>
        </div>

        {/* Content - Flexible with overflow control */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Description - Fixed height with line clamp */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
            {checklist.description}
          </p>

          {/* Time & Items Info - Fixed height */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Estimated Time
              </p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {checklist.formatted_time}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Total Items
              </p>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {items.length} tasks
                </span>
              </div>
            </div>
          </div>

          {/* Preview Checklist Items - Fixed height with scroll */}
          <div className="flex-1 mb-4 overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Key Items:
            </p>
            <ul className="space-y-1.5">
              {items.slice(0, 3).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.priority === 'critical'
                      ? 'text-red-500'
                      : item.priority === 'high'
                        ? 'text-orange-500'
                        : item.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                  />
                  <span className="line-clamp-1">{item.item}</span>
                </li>
              ))}
              {items.length > 3 && (
                <li className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                  +{items.length - 3} more items
                </li>
              )}
            </ul>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 space-y-3">
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {checklist.view_count.toLocaleString()} views
                </span>
              </div>
            </div>

            {/* Cost Estimate */}
            {checklist.formatted_cost_range && (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-green-900 dark:text-green-200 truncate">
                    {checklist.formatted_cost_range}
                  </span>
                </div>
              </div>
            )}

            {/* Link */}
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              <span>View Checklist</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SeasonalChecklistsIndex({
  checklists,
  seasons,
  searchQuery = '',
  currentSeason = '',
  currentSort = 'season',
}: SeasonalChecklistsIndexProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('maintenance.seasonal.index'),
      { search: searchInput, season: currentSeason, sort: currentSort },
      { preserveState: true }
    );
  };

  const handleFilterChange = (season: string) => {
    router.get(
      route('maintenance.seasonal.index'),
      { search: searchQuery, season: season || '', sort: currentSort },
      { preserveState: true }
    );
  };

  const handleSortChange = (sort: string) => {
    router.get(
      route('maintenance.seasonal.index'),
      { search: searchQuery, season: currentSeason, sort },
      { preserveState: true }
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    router.get(route('maintenance.seasonal.index'), {}, { preserveState: true });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Head title="Seasonal Maintenance Checklists - DriveAssist" />
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <BackButton href="/resources/maintenance" label="Back to Maintenance Hub" className="mb-6 mt-10" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Seasonal Maintenance Checklists
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Prepare your vehicle for every season
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search checklists..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </form>

              {/* Season Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={currentSeason}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 dark:text-white appearance-none cursor-pointer"
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
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="season">Sort by Season</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Active Filters */}
            {(searchQuery || currentSeason) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Search: {searchQuery}
                  </span>
                )}
                {currentSeason && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Season: {seasons[currentSeason as keyof typeof seasons]}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Count */}
          {checklists.data.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {currentSeason
                  ? `${seasons[currentSeason as keyof typeof seasons]} Checklists`
                  : 'All Seasonal Checklists'}
                {searchQuery && ` matching "${searchQuery}"`}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Showing {checklists.data.length} of {checklists.total} checklists
              </p>
            </div>
          )}

          {/* Checklists Grid */}
          {checklists.data.length > 0 ? (
            <>
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
                      className={`px-4 py-2 rounded-lg transition-colors ${link.active
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No checklists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery
                  ? `No checklists match "${searchQuery}"`
                  : 'No seasonal checklists available'}
              </p>
              {(searchQuery || currentSeason) && (
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}