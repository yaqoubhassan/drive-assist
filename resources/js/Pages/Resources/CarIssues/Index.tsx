import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import {
  Search,
  Filter,
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  ArrowRight,
  DollarSign,
  X,
  Sparkles,
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
  category_icon: string;
  severity_color: string;
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

  const getSeverityBadgeClass = (severity: string) => {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (severity) {
      case 'low':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case 'medium':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'high':
        return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`;
      case 'critical':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  return (
    <ThemeProvider>
      <Head title="Common Car Issues - DriveAssist" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Common Car Issues Library
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Comprehensive database of vehicle problems, symptoms, solutions, and cost estimates
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="mb-8"
            >
              <div className="max-w-2xl mx-auto relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by symptoms, issue name, or keywords..."
                  className="w-full px-6 py-4 pl-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </motion.form>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Categories & Filters */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(categories).map(([key, name]) => {
                      const Icon = categoryIcons[key] || AlertCircle;
                      const isActive = currentCategory === key;

                      return (
                        <button
                          key={key}
                          onClick={() => handleCategoryChange(key)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="flex-1 text-left text-sm">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { key: 'popular', label: 'Most Popular', icon: TrendingUp },
                      { key: 'recent', label: 'Recently Added', icon: Clock },
                      { key: 'views', label: 'Most Viewed', icon: Eye },
                      { key: 'title', label: 'Alphabetical', icon: Filter },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => handleSortChange(key)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentSort === key
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1 text-left text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Issues */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Popular Issues
                  </h3>
                  <div className="space-y-3">
                    {popularIssues.map((issue) => {
                      const Icon = categoryIcons[issue.category] || AlertCircle;
                      return (
                        <Link
                          key={issue.id}
                          href={route('car-issues.show', issue.slug)}
                          className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                                {issue.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {issue.view_count} views
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>

              {/* Main Content - Issues Grid */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Results Count */}
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">
                      Showing {issues.data.length} of {issues.total || issues.data.length} issues
                    </p>
                  </div>

                  {/* Issues Grid */}
                  {issues.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {issues.data.map((issue, index) => {
                        const Icon = categoryIcons[issue.category] || AlertCircle;

                        return (
                          <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={route('car-issues.show', issue.slug)}
                              className="block h-full"
                            >
                              <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                        {issue.title}
                                      </h3>
                                      <span className={getSeverityBadgeClass(issue.severity)}>
                                        {issue.severity}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                                  {issue.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
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
                                    <span className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                                      <DollarSign className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                                      {issue.cost_range}
                                    </span>
                                  )}
                                </div>

                                {/* Read More Arrow */}
                                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                  Read More
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No issues found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Try adjusting your search or filters
                      </p>
                      <button
                        onClick={() => {
                          setSearch('');
                          handleCategoryChange('all');
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {issues.links && issues.links.length > 3 && (
                    <div className="mt-8 flex items-center justify-center space-x-2">
                      {issues.links.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url || '#'}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${link.active
                            ? 'bg-blue-600 text-white'
                            : link.url
                              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white"
            >
              <h2 className="text-3xl font-bold mb-4">
                Experiencing One of These Issues?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Get instant AI-powered diagnosis or connect with verified local experts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/diagnose"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Diagnose My Issue
                </Link>
                <Link
                  href="/experts"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Find Expert
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}