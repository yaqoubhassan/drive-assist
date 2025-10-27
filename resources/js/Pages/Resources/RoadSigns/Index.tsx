import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { BackButton } from '@/Components/ui/BackButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Filter, Trophy } from 'lucide-react';
import { useState } from 'react';

// Import new UI components
import {
  Badge,
  EmptyState,
  Pagination,
  SearchInput,
} from '@/Components/ui';

interface RoadSign {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
}

interface Props {
  signs: {
    data: RoadSign[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  categories: Record<string, string>;
  currentCategory: string;
  searchQuery: string;
  popularSigns: RoadSign[];
}

export default function RoadSignsIndex({
  signs,
  categories,
  currentCategory,
  searchQuery,
  popularSigns,
}: Props) {
  const [search, setSearch] = useState(searchQuery);

  // Handle search submission
  const handleSearch = (value: string) => {
    router.get(
      route('road-signs.index'),
      { search: value, category: currentCategory },
      { preserveState: true }
    );
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    router.get(
      route('road-signs.index'),
      { category, search },
      { preserveState: true }
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    router.get(route('road-signs.index'), {}, { preserveState: true });
  };

  return (
    <ThemeProvider>
      <Head title="Road Signs Guide - DriveAssist" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <BackButton href="/resources" label="Back to Resources" className="mb-6" />

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Road Signs Guide
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Learn the meaning of road signs and improve your driving knowledge
              </p>
            </motion.div>

            {/* Popular Signs Section */}
            {popularSigns && popularSigns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Most Searched Signs
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {popularSigns.map((sign) => (
                    <Link
                      key={sign.id}
                      href={route('road-signs.show', sign.slug)}
                      className="flex flex-col items-center p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-all group"
                    >
                      <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {sign.image_url}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {sign.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search and Filters Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                {/* Search Bar - Using new SearchInput component */}
                <div className="mb-6">
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    onSubmit={handleSearch}
                    placeholder="Search road signs..."
                    debounceMs={500}
                    showClearButton
                    className="w-full"
                  />
                </div>

                {/* Category Filters */}
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Filter by category:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categories).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryChange(key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentCategory === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Signs Grid or Empty State */}
            {signs.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {signs.data.map((sign, index) => (
                    <SignCard key={sign.id} sign={sign} index={index} />
                  ))}
                </div>

                {/* Pagination - Using new Pagination component */}
                <Pagination
                  links={signs.links}
                  currentPage={signs.current_page}
                  lastPage={signs.last_page}
                  className="mt-8"
                />
              </>
            ) : (
              /* Empty State - Using new EmptyState component */
              <EmptyState
                variant="search"
                title="No road signs found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{
                  label: 'Clear Filters',
                  onClick: handleClearFilters,
                }}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Refactored SignCard component using new Badge component
function SignCard({ sign, index }: { sign: RoadSign; index: number }) {
  // Category variant mapping for Badge component
  const categoryVariants: Record<
    string,
    'warning' | 'error' | 'info' | 'success'
  > = {
    warning: 'warning',
    regulatory: 'error',
    information: 'info',
    guide: 'success',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={route('road-signs.show', sign.slug)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden h-full group">
          {/* Emoji Icon Container */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 flex items-center justify-center h-48">
            <span className="text-8xl group-hover:scale-110 transition-transform duration-200">
              {sign.image_url}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {sign.name}
              </h3>
              {/* Using new Badge component instead of custom span */}
              <Badge
                variant={categoryVariants[sign.category] || 'info'}
                size="sm"
                className="flex-shrink-0"
              >
                {sign.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {sign.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}