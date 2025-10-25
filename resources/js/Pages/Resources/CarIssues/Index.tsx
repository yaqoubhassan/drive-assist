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
  Filter,
  ChevronDown,
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

const categoryColors: Record<string, string> = {
  engine: 'from-orange-500 to-red-500',
  brakes: 'from-red-500 to-pink-500',
  electrical: 'from-yellow-400 to-orange-500',
  transmission: 'from-purple-500 to-indigo-500',
  tires: 'from-gray-600 to-gray-800',
  suspension: 'from-blue-500 to-cyan-500',
  cooling: 'from-cyan-400 to-blue-500',
  fuel: 'from-green-500 to-emerald-500',
  exhaust: 'from-gray-500 to-slate-600',
  steering: 'from-indigo-500 to-purple-500',
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
  const [showFilters, setShowFilters] = useState(false);

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

  const getSeverityInfo = (severity: string) => {
    const severityMap = {
      low: {
        label: 'Minor',
        icon: '🟢',
        bgClass: 'bg-green-50 dark:bg-green-900/20',
        textClass: 'text-green-700 dark:text-green-300',
        borderClass: 'border-green-200 dark:border-green-800',
      },
      medium: {
        label: 'Moderate',
        icon: '🟡',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
        textClass: 'text-yellow-700 dark:text-yellow-300',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
      },
      high: {
        label: 'Serious',
        icon: '🟠',
        bgClass: 'bg-orange-50 dark:bg-orange-900/20',
        textClass: 'text-orange-700 dark:text-orange-300',
        borderClass: 'border-orange-200 dark:border-orange-800',
      },
      critical: {
        label: 'Critical',
        icon: '🔴',
        bgClass: 'bg-red-50 dark:bg-red-900/20',
        textClass: 'text-red-700 dark:text-red-300',
        borderClass: 'border-red-200 dark:border-red-800',
      },
    };
    return severityMap[severity as keyof typeof severityMap] || severityMap.low;
  };

  return (
    <ThemeProvider>
      <Head title="Common Car Issues Library - DriveAssist" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-semibold text-sm mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Knowledge Base
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
                Common Car Issues
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Library
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Comprehensive database of vehicle problems with symptoms, solutions, and cost estimates
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {issues.total || 0}+
                  </span>
                  <span>Issues Documented</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Object.keys(categories).length}
                  </span>
                  <span>Categories</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-gray-900 dark:text-white">24/7</span>
                  <span>Available</span>
                </div>
              </div>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by symptoms, issue name, or keywords..."
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-lg shadow-gray-200/50 dark:shadow-none transition-all text-lg"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              </form>

              {/* Active Filters */}
              {(currentCategory || search) && (
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {currentCategory && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {categories[currentCategory]}
                      <button
                        onClick={() => handleCategoryChange('')}
                        className="ml-2 hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      Search: "{search}"
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Popular Issues Section */}
          {popularIssues.length > 0 && !search && !currentCategory && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Most Common Issues
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularIssues.slice(0, 3).map((issue, index) => {
                  const Icon = categoryIcons[issue.category] || AlertCircle;
                  const severityInfo = getSeverityInfo(issue.severity);
                  const gradient = categoryColors[issue.category] || 'from-gray-500 to-gray-700';

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Link href={route('car-issues.show', issue.slug)}>
                        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 h-full">
                          {/* Gradient Header */}
                          <div className={`bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                            <div className="relative flex items-start justify-between">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                                {severityInfo.icon} {severityInfo.label}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                              {issue.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                              {issue.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {issue.view_count}
                                </span>
                                <span className="flex items-center">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {issue.helpful_count}
                                </span>
                              </div>

                              {issue.cost_range && (
                                <span className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  {issue.cost_range}
                                </span>
                              )}
                            </div>

                            {/* Read More */}
                            <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                              <span>Learn More</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Browse by Category
              </h2>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={currentSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Added</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="views">Most Viewed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${!currentCategory
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
              >
                All Issues
              </button>
              {Object.entries(categories).map(([key, label]) => {
                const Icon = categoryIcons[key] || AlertCircle;
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${currentCategory === key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* All Issues Grid */}
          {issues.data.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
              >
                {issues.data.map((issue, index) => {
                  const Icon = categoryIcons[issue.category] || AlertCircle;
                  const severityInfo = getSeverityInfo(issue.severity);

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Link href={route('car-issues.show', issue.slug)}>
                        <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 h-full">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                  {issue.title}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${severityInfo.bgClass} ${severityInfo.textClass} border ${severityInfo.borderClass}`}>
                                    {severityInfo.icon} {severityInfo.label}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {categories[issue.category]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {issue.description}
                          </p>

                          {/* Symptoms Preview */}
                          {issue.symptoms && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">
                                Common Symptoms:
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                                {issue.symptoms}
                              </p>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1.5" />
                                {issue.view_count}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="w-4 h-4 mr-1.5" />
                                {issue.helpful_count}
                              </span>
                            </div>

                            {issue.cost_range && (
                              <span className="flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {issue.cost_range}
                              </span>
                            )}
                          </div>

                          {/* Read More */}
                          <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                            <span>View Details</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pagination */}
              {issues.last_page > 1 && (
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {issues.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        preserveState
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${link.active
                          ? 'bg-blue-600 text-white shadow-lg'
                          : link.url
                            ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No issues found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                We couldn't find any issues matching your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Can't Find Your Issue?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Get instant AI-powered diagnosis or connect with verified local experts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/diagnose"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
                >
                  Diagnose My Issue
                </Link>
                <Link
                  href="/experts"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Find Expert
                </Link>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}