import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  animated?: boolean;
  animationDelay?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  noBorder?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  icon?: LucideIcon | React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

/**
 * Universal Card Component System
 * 
 * Features:
 * - Clickable/linkable cards
 * - Hover effects
 * - Optional animations
 * - Composable with Header, Body, Footer
 * - Dark mode support
 * 
 * Usage:
 * <Card href="/issues/123" hoverable animated>
 *   <Card.Header icon={Wrench} badge={<Badge variant="warning">High</Badge>}>
 *     Engine Problems
 *   </Card.Header>
 *   <Card.Body>
 *     Description of the issue...
 *   </Card.Body>
 *   <Card.Footer showArrow>
 *     View Details
 *   </Card.Footer>
 * </Card>
 */

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

function Card({
  children,
  href,
  onClick,
  className = '',
  hoverable = true,
  animated = true,
  animationDelay = 0,
  padding = 'md',
  noBorder = false,
}: CardProps) {
  const baseClasses = `
    bg-white dark:bg-gray-800 
    rounded-xl 
    ${!noBorder ? 'border border-gray-200 dark:border-gray-700' : ''} 
    ${paddingClasses[padding]}
    ${hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : 'transition-shadow'}
    ${onClick || href ? 'cursor-pointer' : ''}
    ${className}
  `;

  const content = <div className={baseClasses.trim()}>{children}</div>;

  if (animated) {
    const motionDiv = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: animationDelay }}
      >
        {content}
      </motion.div>
    );

    if (href) {
      return (
        <Link href={href} className="block group">
          {motionDiv}
        </Link>
      );
    }

    if (onClick) {
      return <div onClick={onClick}>{motionDiv}</div>;
    }

    return motionDiv;
  }

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}

function CardHeader({ children, icon, badge, className = '' }: CardHeaderProps) {
  const Icon = icon;

  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="flex-shrink-0">
            {typeof Icon === 'function' ? (
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            ) : (
              Icon
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {typeof children === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {children}
            </h3>
          ) : (
            children
          )}
        </div>
      </div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
    </div>
  );
}

function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`text-gray-600 dark:text-gray-400 ${className}`}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', showArrow = false }: CardFooterProps) {
  return (
    <div
      className={`flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
    >
      <div className="flex-1">{children}</div>
      {showArrow && (
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </motion.div>
      )}
    </div>
  );
}

// Compose Card with sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

// Convenience component for simple cards
export function SimpleCard({
  title,
  description,
  icon,
  badge,
  footer,
  href,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <Card href={href} hoverable animated className={className}>
      <Card.Header icon={icon} badge={badge}>
        {title}
      </Card.Header>
      {description && <Card.Body>{description}</Card.Body>}
      {footer && <Card.Footer showArrow>{footer}</Card.Footer>}
    </Card>
  );
}