import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  animated?: boolean;
}

/**
 * Universal Button Component
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger, success)
 * - Sizes (sm, md, lg)
 * - Icon support
 * - Loading states
 * - Link or button behavior
 * - Hover animations
 * - Dark mode support
 * 
 * Usage:
 * <Button variant="primary" icon={Sparkles}>Diagnose Now</Button>
 * <Button variant="outline" href="/experts">Find Expert</Button>
 * <Button variant="danger" onClick={handleDelete} loading={isDeleting}>Delete</Button>
 */

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-blue-600 hover:bg-blue-700 
    text-white 
    shadow-md hover:shadow-lg
    dark:bg-blue-500 dark:hover:bg-blue-600
  `,
  secondary: `
    bg-gray-200 hover:bg-gray-300 
    text-gray-900 
    dark:bg-gray-700 dark:hover:bg-gray-600 
    dark:text-white
  `,
  outline: `
    bg-transparent hover:bg-gray-50 
    text-gray-700 
    border-2 border-gray-300 hover:border-gray-400
    dark:hover:bg-gray-800 
    dark:text-gray-300 
    dark:border-gray-600 dark:hover:border-gray-500
  `,
  ghost: `
    bg-transparent hover:bg-gray-100 
    text-gray-700 
    dark:hover:bg-gray-800 
    dark:text-gray-300
  `,
  danger: `
    bg-red-600 hover:bg-red-700 
    text-white 
    shadow-md hover:shadow-lg
    dark:bg-red-500 dark:hover:bg-red-600
  `,
  success: `
    bg-green-600 hover:bg-green-700 
    text-white 
    shadow-md hover:shadow-lg
    dark:bg-green-500 dark:hover:bg-green-600
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  animated = true,
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className={`border-2 border-current border-t-transparent rounded-full ${iconSizeClasses[size]}`} />
        </motion.div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconSizeClasses[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className={iconSizeClasses[size]} />}
        </>
      )}
    </>
  );

  const buttonElement = href ? (
    <Link
      href={href}
      className={baseClasses}
      aria-disabled={disabled || loading}
    >
      {content}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
    >
      {content}
    </button>
  );

  if (animated && !disabled && !loading) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={fullWidth ? 'w-full' : 'inline-flex'}
      >
        {buttonElement}
      </motion.div>
    );
  }

  return buttonElement;
}

// Icon Button variant
export function IconButton({
  icon: Icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}: {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  'aria-label': string;
}) {
  const sizeMap = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      className={`
        ${sizeMap[size]}
        rounded-lg
        transition-colors
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      <Icon className={iconSizeClasses[size]} />
    </motion.button>
  );
}

// Button Group
export function ButtonGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
      {children}
    </div>
  );
}