import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Search, Filter, BookOpen, Trophy } from 'lucide-react';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('road-signs.index'), { search, category: currentCategory }, {
      preserveState: true,
    });
  };

  const handleCategoryChange = (category: string) => {
    router.get(route('road-signs.index'), { category, search }, {
      preserveState: true,
    });
  };

  return (
    <ThemeProvider>
      <Head title="Road Signs Guide - DriveAssist" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Road Signs Guide
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              >
                Learn the meaning of road signs to stay safe and informed on the road
              </motion.p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href={route('road-signs.quiz.index')}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Take Knowledge Quiz
              </Link>

              <a
                href="#browse"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Signs
              </a>
            </div>

            {/* Popular Signs */}
            {popularSigns.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Most Popular Signs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {popularSigns.map((sign) => (
                    <Link
                      key={sign.id}
                      href={route('road-signs.show', sign.slug)}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow group"
                    >
                      <div className="flex items-center justify-center h-24 mb-2">
                        <span className="text-5xl group-hover:scale-110 transition-transform">
                          {sign.image_url}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white text-center line-clamp-2">
                        {sign.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Search & Filter Section */}
            <div id="browse" className="mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search road signs..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>

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
            </div>

            {/* Signs Grid */}
            {signs.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {signs.data.map((sign, index) => (
                    <SignCard key={sign.id} sign={sign} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {signs.last_page > 1 && (
                  <div className="flex justify-center space-x-2">
                    {signs.links.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        preserveState
                        className={`px-4 py-2 rounded-lg ${link.active
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No road signs found. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

function SignCard({ sign, index }: { sign: RoadSign; index: number }) {
  const categoryColors: Record<string, string> = {
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    regulatory: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    information: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    guide: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
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
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {sign.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[sign.category] || 'bg-gray-100 text-gray-800'
                  }`}
              >
                {sign.category}
              </span>
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