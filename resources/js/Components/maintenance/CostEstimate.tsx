import { DollarSign } from 'lucide-react';

interface CostEstimateProps {
  costRange: string;
  className?: string;
}

export default function CostEstimate({ costRange, className = '' }: CostEstimateProps) {
  return (
    <div className={`flex items-center gap-2 text-gray-700 dark:text-gray-300 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30">
        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Cost</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {costRange}
        </p>
      </div>
    </div>
  );
}