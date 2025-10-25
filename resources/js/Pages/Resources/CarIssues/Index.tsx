import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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

  return (
    <ThemeProvider>
      <Head title="Common Car Issues Library - DriveAssist" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
                  <Sparkles className="w-4 h-4 text-white mr-2" />
                  <span className="text-sm font-semibold text-white">
                    {issues.total || 0}+ Issues Documented
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Common Car Issues
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Comprehensive database of vehicle problems with symptoms, DIY solutions, and cost estimates
                </p>
              </motion.div>

              {/* Search Bar - More Prominent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl mx-auto mb-8"
              >
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search symptoms or issue name (e.g., 'engine won't start', 'brake squealing')..."
                      className="block w-full pl-16 pr-32 py-6 text-lg border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xl"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5 text-gray-400" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Category Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3 mb-6"
              >
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${currentCategory === ''
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                >
                  All Categories
                </button>
                {Object.entries(categories).map(([key, label]) => {
                  const Icon = categoryIcons[key] || Wrench;
                  return (
                    <button
                      key={key}
                      onClick={() => handleCategoryChange(key)}
                      className={`px-6 py-2.5 rounded-full font-semibold transition-all inline-flex items-center ${currentCategory === key
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Active Filters & Sort */}
              <div className="flex items-center justify-center gap-4">
                {(currentCategory || search) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-sm font-medium"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort by'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 py-2 z-10">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentSort === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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

            {/* Popular Issues - Featured Cards */}
            {popularIssues.length > 0 && !search && !currentCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Most Common Issues
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {popularIssues.slice(0, 6).map((issue, index) => {
                    const Icon = categoryIcons[issue.category] || Wrench;
                    const severityConfig = getSeverityConfig(issue.severity);
                    const SeverityIcon = severityConfig.icon;

                    return (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.4 }}
                      >
                        <Link
                          href={route('car-issues.show', issue.slug)}
                          className="block group h-full"
                        >
                          <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                            {/* Popular Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Popular
                              </div>
                            </div>

                            {/* Header Section with Icon */}
                            <div className="p-6 pb-4">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {issue.title}
                                  </h3>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.bg} ${severityConfig.color} border ${severityConfig.border}`}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {severityConfig.label}
                                  </div>
                                </div>
                              </div>

                              {/* Symptoms */}
                              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                {issue.symptoms}
                              </p>

                              {/* Cost Estimate */}
                              {issue.cost_range && (
                                <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {issue.cost_range}
                                  </span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                    estimated cost
                                  </span>
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
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentCategory ? `${categories[currentCategory]} Issues` : 'All Issues'}
                    {search && ` matching "${search}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {issues.data.length} of {issues.total || 0} issues
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {issues.data.map((issue, index) => {
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
                            {/* Header Section with Icon */}
                            <div className="p-6 pb-4">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {issue.title}
                                  </h3>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.bg} ${severityConfig.color} border ${severityConfig.border}`}>
                                    <SeverityIcon className="w-3 h-3 mr-1" />
                                    {severityConfig.label}
                                  </div>
                                </div>
                              </div>

                              {/* Symptoms */}
                              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                {issue.symptoms}
                              </p>

                              {/* Cost Estimate */}
                              {issue.cost_range && (
                                <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {issue.cost_range}
                                  </span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                    estimated cost
                                  </span>
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

                {/* Pagination */}
                {issues.last_page > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      {issues.links.map((link, index) => (
                        <button
                          key={index}
                          onClick={() => link.url && router.visit(link.url)}
                          disabled={!link.url}
                          className={`min-w-[44px] px-4 py-2.5 rounded-xl font-semibold transition-all ${link.active
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                            : link.url
                              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ))}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  No issues found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                  We couldn't find any issues matching your search. Try different keywords or clear your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-20 relative"
            >
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-48 -mb-48" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Can't Find Your Issue?
                  </h2>
                  <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                    Get instant AI-powered diagnosis or connect with verified local mechanics
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/diagnose"
                      className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
                    >
                      <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Diagnose My Issue
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/experts"
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all inline-flex items-center justify-center"
                    >
                      Find Local Expert
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
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