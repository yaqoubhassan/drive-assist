import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import {
  Info,
  AlertCircle,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'caution'
  | 'critical'
  // Difficulty levels
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  // Custom
  | 'popular'
  | 'common';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  icon?: LucideIcon;
  size?: BadgeSize;
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
}

/**
 * Universal Badge Component
 * 
 * Replaces: DifficultyBadge, SeverityBadge, StatusBadge, etc.
 * 
 * Features:
 * - Multiple variants (success, warning, error, info, etc.)
 * - Difficulty levels (beginner, intermediate, advanced)
 * - Customizable icons
 * - Consistent styling with dark mode
 * - Optional animations
 * 
 * Usage:
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="warning" icon={AlertTriangle}>Caution</Badge>
 * <Badge variant="beginner">Beginner Friendly</Badge>
 */
const badgeConfig: Record<
  BadgeVariant,
  {
    color: string;
    bg: string;
    border: string;
    icon?: LucideIcon;
  }
> = {
  // Status variants
  success: {
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    icon: CheckCircle,
  },
  warning: {
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: AlertTriangle,
  },
  error: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    icon: XCircle,
  },
  info: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    icon: Info,
  },
  primary: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
  },
  secondary: {
    color: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-gray-300 dark:border-gray-700',
  },
  caution: {
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    icon: AlertCircle,
  },
  critical: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    icon: AlertTriangle,
  },

  // Difficulty variants
  beginner: {
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
  },
  intermediate: {
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  advanced: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
  },

  // Custom variants
  popular: {
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
    icon: TrendingUp,
  },
  common: {
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
    icon: TrendingUp,
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export default function Badge({
  variant,
  children,
  icon,
  size = 'md',
  className = '',
  animated = true,
  showIcon = true,
}: BadgeProps) {
  const config = badgeConfig[variant];
  const Icon = icon || config.icon;

  const BadgeContent = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bg} ${config.color} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && Icon && <Icon className={iconSizeClasses[size]} />}
      {children}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex"
      >
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
}

// Convenience exports for common use cases
export const DifficultyBadge = ({
  difficulty,
  className,
}: {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}) => (
  <Badge variant={difficulty} className={className}>
    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
  </Badge>
);

export const SeverityBadge = ({
  severity,
  className,
  showIcon = true,
}: {
  severity: 'info' | 'caution' | 'warning' | 'critical';
  className?: string;
  showIcon?: boolean;
}) => (
  <Badge variant={severity} className={className} showIcon={showIcon}>
    {severity.charAt(0).toUpperCase() + severity.slice(1)}
  </Badge>
);

export const StatusBadge = ({
  status,
  className,
}: {
  status: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}) => (
  <Badge variant={status} className={className}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);