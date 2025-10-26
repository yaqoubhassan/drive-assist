import { motion } from 'framer-motion';
import { Info, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: 'info' | 'caution' | 'warning' | 'critical';
  className?: string;
  showIcon?: boolean;
}

const severityConfig = {
  info: {
    label: 'Info',
    icon: Info,
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
  },
  caution: {
    label: 'Caution',
    icon: AlertCircle,
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
  },
  critical: {
    label: 'Critical',
    icon: XCircle,
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
  },
};

export default function SeverityBadge({
  severity,
  className = '',
  showIcon = true
}: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </motion.span>
  );
}