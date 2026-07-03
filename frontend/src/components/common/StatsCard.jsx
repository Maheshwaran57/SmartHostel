import React from 'react';
import { Card } from './Card';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'up',
  color = 'primary'
}) => {
  const textColors = {
    primary: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20',
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    danger: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20'
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${textColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            changeType === 'up'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
          }`}>
            {changeType === 'up' ? '+' : '-'}{change}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </Card>
  );
};