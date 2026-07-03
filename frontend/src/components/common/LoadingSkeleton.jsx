import React from 'react';

export const LoadingSkeleton = ({
  variant = 'card',
  count = 1
}) => {
  const items = Array.from({ length: count });

  const skeletons = {
    card: (
      <div className="card space-y-4">
        <div className="h-6 w-2/3 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-5/6 skeleton rounded" />
        <div className="h-10 w-1/3 skeleton rounded mt-4" />
      </div>
    ),
    'table-row': (
      <div className="flex items-center justify-between py-4 border-b border-surface-200 dark:border-surface-750 gap-4">
        <div className="h-4 w-1/4 skeleton rounded" />
        <div className="h-4 w-1/5 skeleton rounded" />
        <div className="h-4 w-1/6 skeleton rounded" />
        <div className="h-6 w-12 skeleton rounded-full" />
      </div>
    ),
    text: (
      <div className="space-y-2">
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-5/6 skeleton rounded" />
      </div>
    ),
    circle: (
      <div className="h-12 w-12 skeleton rounded-full" />
    )
  };

  return (
    <div className="space-y-4">
      {items.map((_, idx) => (
        <div key={idx}>{skeletons[variant]}</div>
      ))}
    </div>
  );
};