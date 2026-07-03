import React from 'react';
import { Button } from './Button';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10
}) => {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-surface-200 dark:border-surface-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{startIdx}</span> to{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{endIdx}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> entries
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${isCurrent ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};