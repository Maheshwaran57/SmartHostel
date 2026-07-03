import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  icon: Icon,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:focus:ring-offset-surface-900',
    secondary: 'bg-surface-200 text-gray-700 hover:bg-surface-300 dark:bg-surface-700 dark:text-gray-200 dark:hover:bg-surface-600 focus:ring-surface-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-surface-100 dark:hover:bg-surface-800'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};