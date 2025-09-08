
import React from 'react';

type SortOrder = 'date' | 'name';

interface SortControlsProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortOrder, setSortOrder }) => {
  const commonButtonStyles = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-150 ease-in-out";
  const activeButtonStyles = "bg-amber-500 text-white shadow-sm";
  const inactiveButtonStyles = "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300";

  return (
    <div className="flex items-center space-x-2 flex-shrink-0">
      <button
        onClick={() => setSortOrder('date')}
        aria-pressed={sortOrder === 'date'}
        className={`${commonButtonStyles} ${sortOrder === 'date' ? activeButtonStyles : inactiveButtonStyles}`}
      >
        Most Recent
      </button>
      <button
        onClick={() => setSortOrder('name')}
        aria-pressed={sortOrder === 'name'}
        className={`${commonButtonStyles} ${sortOrder === 'name' ? activeButtonStyles : inactiveButtonStyles}`}
      >
        A-Z
      </button>
    </div>
  );
};

export default SortControls;
