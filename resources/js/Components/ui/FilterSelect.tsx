import { ChevronDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label?: string;
  value: string;
  options: FilterOption[] | Record<string, string>;
  onChange: (value: string) => void;
  placeholder?: string;
  showLabel?: boolean;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Reusable Filter Select Component
 * 
 * Features:
 * - Consistent styling across light/dark modes
 * - Supports both array and object options
 * - Optional label
 * - Accessible keyboard navigation
 * 
 * Usage:
 * <FilterSelect
 *   label="Category"
 *   value={category}
 *   options={categories}
 *   onChange={setCategory}
 *   placeholder="All Categories"
 * />
 */
export default function FilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  showLabel = true,
  className = '',
  fullWidth = false,
}: FilterSelectProps) {
  // Convert options to array format if it's an object
  const optionsArray = Array.isArray(options)
    ? options
    : Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
    }));

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {showLabel && label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none px-4 py-3 pr-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {optionsArray.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
  );
}