import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'Add some items or change your search filters.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-surface-800 rounded-xl border border-dashed border-surface-300 dark:border-surface-700 min-h-[300px]">
      {Icon && (
        <div className="p-4 bg-primary-50 dark:bg-surface-700/50 text-primary-600 dark:text-primary-400 rounded-full mb-4">
          <Icon className="h-10 w-10" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};