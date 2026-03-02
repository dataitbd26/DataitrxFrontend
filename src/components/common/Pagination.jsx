import React from 'react';

/**
 * A reusable pagination component with ellipsis.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Function to generate page numbers with '...'
  const getPageNumbers = () => {
    // If 7 or fewer pages, just show all of them
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If close to the beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // If close to the end
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // If somewhere in the middle
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="p-4 border-t border-gray-200 flex items-center justify-center bg-gray-50">
      <nav>
        <ul className="inline-flex items-center -space-x-px text-sm shadow-sm">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
          </li>
          
          {pageNumbers.map((number, index) => (
            <li key={index}>
              {number === '...' ? (
                <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(number)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 transition ${
                    currentPage === number
                      ? 'text-white bg-red-500 border-red-500 font-semibold'
                      : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {number}
                </button>
              )}
            </li>
          ))}
          
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;