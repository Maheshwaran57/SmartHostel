import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No matching data available',
  onSort,
  sortBy,
  sortOrder
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-700">
      <table className="w-full text-left border-collapse bg-white dark:bg-surface-800">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.sortable ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white select-none' : ''} ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                <div className={`flex items-center gap-1.5 ${
                  col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'
                }`}>
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8">
                <LoadingSkeleton variant="table-row" count={5} />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12">
                <EmptyState description={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                className="hover:bg-surface-50/50 dark:hover:bg-surface-750/30 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-6 py-4.5 text-sm text-gray-700 dark:text-gray-300 ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};