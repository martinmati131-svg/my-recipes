
import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="search"
        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition duration-150 ease-in-out"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
