import { motion } from 'framer-motion';
import { LucideIcon, SearchX, FileX, FolderX, AlertCircle } from 'lucide-react';
import Button from './Button';

type EmptyStateVariant = 'search' | 'no-data' | 'error' | 'custom';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

/**
 * Reusable Empty State Component
 * 
 * Features:
 * - Multiple variants (search, no-data, error, custom)
 * - Optional icon
 * - Title and description
 * - Optional action button
 * - Centered layout with animations
 * 
 * Usage:
 * <EmptyState
 *   variant="search"
 *   title="No issues found"
 *   description="Try adjusting your search or filters"
 *   action={{ label: "Clear Filters", onClick: clearFilters }}
 * />
 */

const variantConfig: Record<
  Exclude<EmptyStateVariant, 'custom'>,
  {
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
  }
> = {
  search: {
    icon: SearchX,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  'no-data': {
    icon: FolderX,
    iconColor: 'text-gray-600 dark:text-gray-400',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
  },
};

export default function EmptyState({
  variant = 'no-data',
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  const config = variant !== 'custom' ? variantConfig[variant] : null;
  const Icon = icon || (config?.icon ?? FileX);
  const iconColor = config?.iconColor ?? 'text-gray-600 dark:text-gray-400';
  const iconBg = config?.iconBg ?? 'bg-gray-100 dark:bg-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Icon */}
      <div
        className={`flex items-center justify-center w-20 h-20 ${iconBg} rounded-full mb-6`}
      >
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          href={action.href}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Specific empty state variants as convenience components
export function SearchEmptyState({
  searchQuery,
  onClearSearch,
}: {
  searchQuery: string;
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      variant="search"
      title="No results found"
      description={`We couldn't find any results for "${searchQuery}". Try adjusting your search or filters.`}
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
      }}
    />
  );
}

export function NoDataEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      variant="no-data"
      title={title}
      description={description}
      action={
        actionLabel && onAction
          ? { label: actionLabel, onClick: onAction }
          : undefined
      }
    />
  );
}

export function ErrorEmptyState({
  title = 'Something went wrong',
  description = 'We encountered an error loading this content. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={description}
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
}