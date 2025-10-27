import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  currentPage?: number;
  lastPage?: number;
  className?: string;
}

/**
 * Reusable Pagination Component
 * 
 * Features:
 * - Works with Laravel pagination
 * - Responsive design
 * - Active state styling
 * - Previous/Next navigation with icons
 * - Disabled state for unavailable links
 * 
 * Usage:
 * <Pagination
 *   links={issues.links}
 *   currentPage={issues.current_page}
 *   lastPage={issues.last_page}
 * />
 */
export default function Pagination({
  links,
  currentPage,
  lastPage,
  className = '',
}: PaginationProps) {
  if (links.length <= 3) {
    // Don't show pagination if there's only one page
    return null;
  }

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      {links.map((link, index) => {
        // Check if this is a previous or next link by label
        const isPrevious = link.label.includes('Previous') || link.label === '&laquo; Previous';
        const isNext = link.label.includes('Next') || link.label === 'Next &raquo;';

        // Render Previous button with icon
        if (isPrevious) {
          return (
            <PaginationButton
              key="prev"
              href={link.url}
              disabled={!link.url}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </PaginationButton>
          );
        }

        // Render Next button with icon
        if (isNext) {
          return (
            <PaginationButton
              key="next"
              href={link.url}
              disabled={!link.url}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </PaginationButton>
          );
        }

        // Render page number buttons
        return (
          <PaginationButton
            key={index}
            href={link.url}
            active={link.active}
            disabled={!link.url}
          >
            {link.label}
          </PaginationButton>
        );
      })}
    </nav>
  );
}

function PaginationButton({
  children,
  href,
  active = false,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  href: string | null;
  active?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}) {
  const baseClasses = `
    flex items-center justify-center
    min-w-[40px] h-10 px-3
    text-sm font-medium
    rounded-lg
    transition-all duration-200
  `;

  const activeClasses = active
    ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:shadow-md';

  const classes = `${baseClasses} ${activeClasses} ${disabledClasses}`.trim();

  if (disabled || !href) {
    return (
      <span className={classes} aria-disabled="true" aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      preserveState
      preserveScroll
      className={classes}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

// Compact pagination for mobile
export function CompactPagination({
  currentPage,
  lastPage,
  onPageChange,
  className = '',
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < lastPage;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-gray-700 dark:text-gray-300">
        Page <span className="font-semibold">{currentPage}</span> of{' '}
        <span className="font-semibold">{lastPage}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}