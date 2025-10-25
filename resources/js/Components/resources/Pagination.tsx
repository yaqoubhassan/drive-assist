import { router } from '@inertiajs/react';

interface PaginationProps {
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  currentPage: number;
  lastPage: number;
}

export default function Pagination({ links, currentPage, lastPage }: PaginationProps) {
  if (lastPage <= 1) return null;

  const handlePageChange = (url: string | null) => {
    if (url) {
      router.visit(url);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <nav className="flex items-center space-x-2" aria-label="Pagination">
        {links.map((link, index) => {
          const isActive = link.active;
          const isDisabled = !link.url;

          return (
            <button
              key={index}
              onClick={() => handlePageChange(link.url)}
              disabled={isDisabled}
              className={`min-w-[44px] px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : isDisabled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md'
                }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </nav>
    </div>
  );
}