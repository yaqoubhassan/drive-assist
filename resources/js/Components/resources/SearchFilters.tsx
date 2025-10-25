import { useState, useEffect, useRef, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  X,
  ChevronDown,
  AlertCircle,
  Wrench,
  Zap,
  Cog,
  Disc,
  Move,
  Droplets,
  Fuel,
  Wind,
} from 'lucide-react';

interface SearchFiltersProps {
  searchQuery: string;
  categories: Record<string, string>;
  currentCategory: string;
  currentSort: string;
  onSearch: (query: string) => void;
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

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'helpful', label: 'Most Helpful' },
  { value: 'views', label: 'Most Viewed' },
];

export default function SearchFilters({
  searchQuery,
  categories,
  currentCategory,
  currentSort,
  onSearch,
}: SearchFiltersProps) {
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

  const handleSearch = (e: FormEvent) => {
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

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || 'Most Popular';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-12">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Search Input without icon */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by symptoms, issue name, or keywords..."
            className="block w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">

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

        {/* Sort and Clear Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative" ref={sortMenuRef}>
            <button
              type="button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              <span className="text-sm">Sort by:</span>
              <span className="font-semibold">{currentSortLabel}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Sort Dropdown */}
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
  );
}