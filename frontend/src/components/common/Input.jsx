import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  name,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500 dark:border-rose-500' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';