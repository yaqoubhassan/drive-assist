import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Sparkles } from 'lucide-react';
import IssueCard from '@/Components/resources/IssueCard';
import SearchFilters from '@/Components/resources/SearchFilters';
import PopularIssuesSection from '@/Components/resources/PopularIssuesSection';
import EmptyState from '@/Components/resources/EmptyState';
import Pagination from '@/Components/resources/Pagination';

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

export default function CarIssuesIndex({
  issues,
  popularIssues,
  categories,
  currentCategory,
  searchQuery,
  currentSort,
}: Props) {
  const clearFilters = () => {
    router.get(route('car-issues.index'));
  };

  const handleSearch = (query: string) => {
    router.get(
      route('car-issues.index'),
      { search: query, category: currentCategory, sort: currentSort },
      { preserveState: true }
    );
  };

  return (
    <ThemeProvider>
      <Head title="Common Car Issues Library - DriveAssist" />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-8 transition-colors mb-8">
        <Navbar />

        <main className="pt-20 md:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
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
                  Search our comprehensive database of vehicle problems with detailed solutions,
                  cost estimates, and expert advice.
                </p>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <SearchFilters
              searchQuery={searchQuery}
              categories={categories}
              currentCategory={currentCategory}
              currentSort={currentSort}
              onSearch={handleSearch}
            />

            {/* Popular Issues Section */}
            {!searchQuery && !currentCategory && (
              <PopularIssuesSection issues={popularIssues} />
            )}

            {/* All Issues Section */}
            {issues.data.length > 0 ? (
              <>
                {/* Section Header */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentCategory
                      ? `${categories[currentCategory]} Issues`
                      : 'All Issues'}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {issues.data.length} of {issues.total || 0} issues
                  </p>
                </div>

                {/* Issue Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  {issues.data.map((issue, index) => (
                    <IssueCard key={issue.id} issue={issue} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  links={issues.links}
                  currentPage={issues.current_page}
                  lastPage={issues.last_page}
                />
              </>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                currentCategory={currentCategory}
                onClearFilters={clearFilters}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}