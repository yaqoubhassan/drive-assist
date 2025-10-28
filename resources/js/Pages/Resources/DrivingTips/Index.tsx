import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { BackButton } from '@/Components/ui/BackButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Search,
  Filter,
  X,
  GraduationCap,
  Eye,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ThumbsUp,
} from 'lucide-react';

// TypeScript Interfaces
interface DrivingTip {
  id: number;
  title: string;
  slug: string;
  category: string;
  category_label: string;
  category_color: string;
  difficulty: string;
  difficulty_label: string;
  difficulty_color: string;
  excerpt: string;
  reading_time_minutes: number;
  formatted_reading_time: string;
  view_count: number;
  helpful_count: number;
  is_featured: boolean;
  is_popular: boolean;
}

interface Props {
  tips: {
    data: DrivingTip[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  categories: Record<string, string>;
  difficulties: Record<string, string>;
  stats: {
    total_tips: number;
    categories_count: number;
    total_views: number;
  };
  featuredTips: DrivingTip[];
  filters: {
    search: string;
    category: string;
    difficulty: string;
    sort: string;
  };
}

// Category icon mapping
const categoryIcons: Record<string, any> = {
  beginner: GraduationCap,
  defensive: '🛡️',
  fuel_efficiency: '⛽',
  weather: '🌦️',
  advanced: '🏎️',
  safety: '🦺',
  parking: '🅿️',
  highway: '🛣️',
};

// Difficulty badge colors
const difficultyColors = {
  beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

// Category badge colors
const categoryColors = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  gray: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
};

export default function DrivingTipsIndex({
  tips,
  categories,
  difficulties,
  stats,
  filters,
}: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('driving-tips.index'),
      {
        search: searchQuery,
        category: filters.category || undefined,
        difficulty: filters.difficulty || undefined,
        sort: filters.sort,
      },
      { preserveState: true }
    );
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    router.get(
      route('driving-tips.index'),
      {
        search: filters.search || undefined,
        category: key === 'category' ? value : filters.category || undefined,
        difficulty: key === 'difficulty' ? value : filters.difficulty || undefined,
        sort: key === 'sort' ? value : filters.sort,
      },
      { preserveState: true }
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    router.get(route('driving-tips.index'));
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.search || filters.category || filters.difficulty || filters.sort !== 'recent';

  // Sort options
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'views', label: 'Most Viewed' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filters.sort)?.label || 'Most Recent';

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Head title="Driving Tips - DriveAssist" />

        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton href="/resources" label="Back to Resources" className="mb-6" />

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Driving Tips & Techniques
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                Master essential and advanced driving skills to become a safer, more confident driver
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {stats.total_tips} Expert Tips
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {stats.categories_count} Categories
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {stats.total_views.toLocaleString()} Total Views
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search driving tips..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Filter Toggle and Sort */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <Filter className="w-4 h-4" />
                    <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-4">
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>{currentSortLabel}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {showSortMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                handleFilterChange('sort', option.value);
                                setShowSortMenu(false);
                              }}
                              className={`block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${filters.sort === option.value
                                ? 'text-purple-600 dark:text-purple-400 font-semibold'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">All Categories</option>
                        {Object.entries(categories).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={filters.difficulty || ''}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">All Levels</option>
                        {Object.entries(difficulties).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Tips Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {tips.data.map((tip, index) => (
                <TipCard key={tip.id} tip={tip} index={index} />
              ))}
            </motion.div>

            {/* Pagination */}
            {tips.last_page > 1 && (
              <div className="flex justify-center gap-2">
                {tips.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    disabled={!link.url}
                    className={`px-4 py-2 rounded-lg transition-colors ${link.active
                      ? 'bg-purple-600 text-white'
                      : link.url
                        ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {tips.data.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <GraduationCap className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No tips found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Tip Card Component with Fixed Height
function TipCard({ tip, index }: { tip: DrivingTip; index: number }) {
  const categoryColorClass =
    categoryColors[tip.category_color as keyof typeof categoryColors] || categoryColors.gray;
  const difficultyColorClass =
    difficultyColors[tip.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link
        href={route('driving-tips.show', tip.slug)}
        className="flex flex-col h-[320px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all overflow-hidden group"
      >
        {/* Header - Fixed height section */}
        <div className="flex-1 p-6 overflow-hidden">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColorClass}`}>
              {tip.category_label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColorClass}`}>
              {tip.difficulty_label}
            </span>
            {tip.is_popular && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Popular
              </span>
            )}
          </div>

          {/* Title - Fixed 2 lines */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 min-h-[3.5rem]">
            {tip.title}
          </h3>

          {/* Excerpt - Fixed 3 lines */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 min-h-[4.5rem]">
            {tip.excerpt}
          </p>

          {/* Meta Info - Fixed height */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1" title="Reading time">
              <Clock className="w-4 h-4" />
              <span>{tip.reading_time_minutes} min</span>
            </div>
            <div className="flex items-center gap-1" title="Views">
              <Eye className="w-4 h-4" />
              <span>{tip.view_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1" title="People found this helpful">
              <ThumbsUp className="w-4 h-4" />
              <span>{tip.helpful_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer - Fixed height */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              Read Article
            </span>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-2 transition-all" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}