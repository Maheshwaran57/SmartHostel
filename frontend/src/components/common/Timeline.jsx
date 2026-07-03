import React from 'react';
import { format } from 'date-fns';

export const Timeline = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <div className="relative border-l border-surface-200 dark:border-surface-700 ml-4 py-2">
      {items.map((item, idx) => (
        <div key={idx} className="mb-8 last:mb-0 ml-6 relative">
          {/* dot */}
          <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 ring-4 ring-white dark:ring-surface-800" />
          
          <div className="bg-surface-50 dark:bg-surface-900/40 rounded-xl border border-surface-200 dark:border-surface-800 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                Status: {item.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(item.timestamp), 'MMM dd, yyyy hh:mm a')}
              </span>
            </div>
            {item.notes && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.notes}
              </p>
            )}
            {item.updatedBy && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                Updated by: {item.updatedBy.name || 'System'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};