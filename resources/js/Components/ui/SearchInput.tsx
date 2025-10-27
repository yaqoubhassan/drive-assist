import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Reusable Search Input Component
 * 
 * Features:
 * - Consistent styling across light/dark modes
 * - Optional debouncing
 * - Clear button
 * - Keyboard shortcuts (Escape to clear)
 * - Animated transitions
 * 
 * Usage:
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search issues..."
 *   debounceMs={500}
 * />
 */
export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  debounceMs = 0,
  showClearButton = true,
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce logic
  useEffect(() => {
    if (debounceMs === 0) {
      onChange(internalValue);
      return;
    }

    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(internalValue);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {showClearButton && internalValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}