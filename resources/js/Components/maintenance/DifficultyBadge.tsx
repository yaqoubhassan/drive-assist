import { motion } from 'framer-motion';

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  advanced: {
    label: 'Advanced',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
  },
};

export default function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border} ${className}`}
    >
      {config.label}
    </motion.span>
  );
}