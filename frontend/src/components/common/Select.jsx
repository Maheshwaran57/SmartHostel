import React from 'react';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
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
      <select
        ref={ref}
        name={name}
        disabled={disabled}
        className={`input-field bg-no-repeat bg-right pr-10 appearance-none ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';