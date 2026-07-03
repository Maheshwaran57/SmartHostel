import React from 'react';

export const Card = ({
  title,
  subtitle,
  children,
  footer,
  className = '',
  hoverable = false
}) => {
  return (
    <div className={`card ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="text-gray-600 dark:text-gray-300 text-sm">
        {children}
      </div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
          {footer}
        </div>
      )}
    </div>
  );
};