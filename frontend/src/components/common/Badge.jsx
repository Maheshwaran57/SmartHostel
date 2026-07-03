import React from 'react';

export const Badge = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-800 dark:bg-surface-850 dark:text-surface-300',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};