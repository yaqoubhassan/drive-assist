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
  Zap,
  Eye,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ThumbsUp,
  BookOpen,
  Award,
  Battery,
  PlugZap,
  DollarSign,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import type { ElectricVehicleIndexProps, ElectricVehicle } from '@/types/electric-vehicle';

// Category icon mapping
const categoryIcons: Record<string, any> = {
  buying_guide: BookOpen,
  charging: PlugZap,
  battery_maintenance: Battery,
  cost_comparison: DollarSign,
  tax_incentives: Award,
  model_reviews: Star,
  technology: Zap,
  environmental: Leaf,
  infrastructure: '🏗️',
  general: Sparkles,
};

// Category badge colors
const categoryColors: Record<string, string> = {
  buying_guide: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  charging: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  battery_maintenance: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  cost_comparison: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  tax_incentives: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  model_reviews: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  technology: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  environmental: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  infrastructure: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  general: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
};

export default function ElectricVehiclesIndex({
  articles,
  categories,
  stats,
  featuredArticles,
  filters,
}: ElectricVehicleIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('electric-vehicles.index'),
      { search, category: filters.category, sort: filters.sort },
      { preserveState: true }
    );
  };

  // Handle filter changes
  const handleCategoryChange = (category: string | null) => {
    router.get(
      route('electric-vehicles.index'),
      { search, category, sort: filters.sort },
      { preserveState: true }
    );
  };

  const handleSortChange = (sort: string) => {
    router.get(
      route('electric-vehicles.index'),
      { search, category: filters.category, sort },
      { preserveState: true }
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    router.get(route('electric-vehicles.index'), {}, { preserveState: true });
  };

  const hasActiveFilters = filters.search || filters.category || (filters.sort && filters.sort !== 'recent');

  return (
    <ThemeProvider>
      <Head title="Electric Vehicles Guide - DriveAssist" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <BackButton href="/resources" className="mb-6" />

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Electric Vehicles Guide
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to know about electric vehicles - from buying guides to charging infrastructure
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">{stats.total_articles}</span>
                  <span>Articles</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Filter className="w-5 h-5" />
                  <span className="font-semibold">{stats.categories_count}</span>
                  <span>Categories</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">{stats.total_views.toLocaleString()}</span>
                  <span>Views</span>
                </div>
              </div>
            </motion.div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    Featured Articles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.map((article, index) => (
                    <FeaturedArticleCard key={article.id} article={article} index={index} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
            >
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles... (e.g., 'buying guide', 'charging')"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    Active
                  </span>
                )}
              </button>

              {/* Filter Options */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4"
                >
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!filters.category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        All
                      </button>
                      {Object.entries(categories).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => handleCategoryChange(value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.category === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'recent', label: 'Most Recent' },
                        { value: 'helpful', label: 'Most Helpful' },
                        { value: 'views', label: 'Most Viewed' },
                        { value: 'popular', label: 'Popular' },
                        { value: 'featured', label: 'Featured' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => handleSortChange(value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.sort === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Articles Grid or Empty State */}
            {articles.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {articles.data.map((article, index) => (
                    <ArticleCard key={article.id} article={article} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {articles.last_page > 1 && (
                  <Pagination links={articles.links} />
                )}
              </>
            ) : (
              <EmptyState
                title="No articles found"
                description="Try adjusting your search or filters to find what you're looking for."
                icon={Zap}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Featured Article Card Component
function FeaturedArticleCard({ article, index }: { article: ElectricVehicle; index: number }) {
  const CategoryIcon = categoryIcons[article.category];
  const isIconComponent = typeof CategoryIcon !== 'string';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={route('electric-vehicles.show', article.slug)}>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden h-[280px] relative">
          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          </div>

          {/* Content */}
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div>
              {/* Category Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                {isIconComponent ? (
                  <CategoryIcon className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-sm">{CategoryIcon}</span>
                )}
                <span className="text-sm font-medium text-white">{article.category_label}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:underline">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-white/90 text-sm line-clamp-2">{article.description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-white/80 text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.reading_time_minutes} min
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.view_count.toLocaleString()}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}

// Regular Article Card Component
function ArticleCard({ article, index }: { article: ElectricVehicle; index: number }) {
  const CategoryIcon = categoryIcons[article.category];
  const isIconComponent = typeof CategoryIcon !== 'string';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link href={route('electric-vehicles.show', article.slug)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-[360px] flex flex-col hover:shadow-lg transition-shadow duration-300">
          {/* Header */}
          <div className="p-6 flex-1">
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
                {isIconComponent ? (
                  <CategoryIcon className="w-3 h-3" />
                ) : (
                  <span>{CategoryIcon}</span>
                )}
                <span>{article.category_label}</span>
              </span>

              {article.is_popular && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
              {article.description}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.reading_time_minutes} min
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.view_count.toLocaleString()}
                </span>
              </div>

              {article.helpful_count > 0 && (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {article.helpful_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Pagination Component
function Pagination({ links }: { links: any[] }) {
  return (
    <nav className="flex items-center justify-center space-x-2">
      {links.map((link, index) => {
        if (!link.url) {
          return (
            <span
              key={index}
              className="px-4 py-2 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        }

        return (
          <Link
            key={index}
            href={link.url}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        );
      })}
    </nav>
  );
}

// Empty State Component
function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">{description}</p>
    </motion.div>
  );
}