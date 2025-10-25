import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Search,
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
  Eye,
  ThumbsUp,
  ArrowRight,
  DollarSign,
  X,
  TrendingUp,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface CarIssue {
  id: number;
  title: string;
  slug: string;
  category: string;
  severity: string;
  symptoms: string;
  description: string;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  view_count: number;
  helpful_count: number;
  is_popular: boolean;
  cost_range: string;
}

interface Props {
  issues: {
    data: CarIssue[];
    links: any[];
    current_page: number;
    last_page: number;
    total?: number;
  };
  popularIssues: CarIssue[];
  categories: Record<string, string>;
  currentCategory: string;
  searchQuery: string;
  currentSort: string;
}

const categoryIcons: Record<string, any> = {
  engine: Wrench,
  brakes: AlertCircle,
  electrical: Zap,
  transmission: Cog,
  tires: Disc,
  suspension: Move,
  cooling: Droplets,
  fuel: Fuel,
  exhaust: Wind,
  steering: Cog,
};

export default function CarIssuesIndex({
  issues,
  popularIssues,
  categories,
  currentCategory,
  searchQuery,
  currentSort,
}: Props) {
  const [search, setSearch] = useState(searchQuery);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    if (showSortMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSortMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('car-issues.index'),
      { search, category: currentCategory, sort: currentSort },
      { preserveState: true }
    );
  };

  const handleCategoryChange = (category: string) => {
    router.get(
      route('car-issues.index'),
      { category, search, sort: currentSort },
      { preserveState: true }
    );
  };

  const handleSortChange = (sort: string) => {
    setShowSortMenu(false);
    router.get(
      route('car-issues.index'),
      { sort, category: currentCategory, search },
      { preserveState: true }
    );
  };

  const clearFilters = () => {
    setSearch('');
    router.get(route('car-issues.index'));
  };

  const getSeverityConfig = (severity: string) => {
    const configs = {
      low: {
        label: 'Minor Issue',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: CheckCircle2,
      },
      medium: {
        label: 'Moderate',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: Clock,
      },
      high: {
        label: 'Serious',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        icon: AlertTriangle,
      },
      critical: {
        label: 'Critical',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: AlertCircle,
      },
    };
    return configs[severity as keyof typeof configs] || configs.medium;
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'helpful', label: 'Most Helpful' },
    { value: 'views', label: 'Most Viewed' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Most Popular';

  return (
    <ThemeProvider>
      <Head title="Common Car Issues Library - DriveAssist" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        {/* FIXED: Proper padding-top for navbar (80px desktop, 64px mobile + extra space) */}
        <main className="pt-20 md:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* IMPROVED: Hero Section with better spacing */}
            <div className="text-center mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    AI-Powered Diagnosis Library
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                  Common Car Issues
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mt-2">
                    Solved & Explained
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 px-4">
                  Search our comprehensive database of vehicle problems with detailed solutions, cost estimates, and expert advice.
                </p>
              </motion.div>
            </div>

            {/* IMPROVED: Search and Filter Section with better mobile layout */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-12">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by symptoms, issue name, or keywords..."
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Category Pills - IMPROVED: Better mobile wrapping */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base ${!currentCategory
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      All Issues
                    </button>
                    {Object.entries(categories).map(([key, value]) => {
                      const Icon = categoryIcons[key] || AlertCircle;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleCategoryChange(key)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-sm md:text-base ${currentCategory === key
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{value}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FIXED: Sort Dropdown with proper positioning */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="relative" ref={sortMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      <span className="text-sm">Sort by:</span>
                      <span className="font-semibold">{currentSortLabel}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* FIXED: Dropdown menu with proper z-index and positioning */}
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full px-4 py-3 text-left transition-colors text-sm ${currentSort === option.value
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {(search || currentCategory) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Clear Filters</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* IMPROVED: Popular Issues Section */}
            {popularIssues.length > 0 && !search && !currentCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Most Common Issues
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      The top issues drivers search for most
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {popularIssues.slice(0, 6).map((issue, index) => {
                    const Icon = categoryIcons[issue.category] || Wrench;
                    const severityConfig = getSeverityConfig(issue.severity);
                    const SeverityIcon = severityConfig.icon;

                    return (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.4 }}
                      >
                        <Link
                          href={route('car-issues.show', issue.slug)}
                          className="block group h-full"
                        >
                          <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                            {/* Popular Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Popular
                              </div>
                            </div>

                            {/* Header Section */}
                            <div className="p-6 pb-4">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="w-7 h-7 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${severityConfig.bg} ${severityConfig.color}`}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {severityConfig.label}
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {issue.title}
                                  </h3>
                                </div>
                              </div>

                              {/* Symptoms Preview */}
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                {issue.symptoms}
                              </p>

                              {/* Cost Range */}
                              {issue.estimated_cost_min && issue.estimated_cost_max && (
                                <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {issue.cost_range}
                                </div>
                              )}
                            </div>

                            {/* Footer Stats */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Eye className="w-4 h-4 mr-1.5" />
                                  {issue.view_count.toLocaleString()}
                                </span>
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <ThumbsUp className="w-4 h-4 mr-1.5" />
                                  {issue.helpful_count.toLocaleString()}
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* All Issues Section */}
            {issues.data.length > 0 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentCategory ? `${categories[currentCategory]} Issues` : 'All Issues'}
                    {search && ` matching "${search}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {issues.data.length} of {issues.total || 0} issues
                  </p>
                </div>

                {/* IMPROVED: Issue Cards Grid with optimized animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {issues.data.map((issue, index) => {
                    const Icon = categoryIcons[issue.category] || Wrench;
                    const severityConfig = getSeverityConfig(issue.severity);
                    const SeverityIcon = severityConfig.icon;

                    return (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        // FIXED: Reduced animation delay for better performance
                        transition={{ delay: Math.min(0.03 * index, 0.4), duration: 0.3 }}
                      >
                        <Link
                          href={route('car-issues.show', issue.slug)}
                          className="block group h-full"
                        >
                          <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                            {/* Header Section */}
                            <div className="p-6 pb-4">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                  <Icon className="w-6 h-6 text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold mb-2 ${severityConfig.bg} ${severityConfig.color}`}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {severityConfig.label}
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {issue.title}
                                  </h3>
                                </div>
                              </div>

                              {/* Symptoms Preview */}
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                {issue.symptoms}
                              </p>

                              {/* Cost Range */}
                              {issue.estimated_cost_min && issue.estimated_cost_max && (
                                <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {issue.cost_range}
                                </div>
                              )}
                            </div>

                            {/* Footer Stats */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <Eye className="w-4 h-4 mr-1.5" />
                                  {issue.view_count.toLocaleString()}
                                </span>
                                <span className="flex items-center text-gray-600 dark:text-gray-400">
                                  <ThumbsUp className="w-4 h-4 mr-1.5" />
                                  {issue.helpful_count.toLocaleString()}
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SIMPLIFIED: Pagination with cleaner button styles */}
                {issues.last_page > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2" aria-label="Pagination">
                      {issues.links.map((link, index) => {
                        const isActive = link.active;
                        const isDisabled = !link.url;

                        return (
                          <button
                            key={index}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={isDisabled}
                            className={`min-w-[44px] px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : isDisabled
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md'
                              }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      })}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              // IMPROVED: Empty State with better spacing
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 md:py-20"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No issues found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-base md:text-lg px-4">
                  We couldn't find any issues matching your search. Try different keywords or clear your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Clear All Filters
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