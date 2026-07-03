import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search here...'
}) => {
  return (
    <div className="relative rounded-lg max-w-xs w-full shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <HiOutlineSearch className="h-5 w-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field pl-10 pr-4 py-2"
      />
    </div>
  );
};