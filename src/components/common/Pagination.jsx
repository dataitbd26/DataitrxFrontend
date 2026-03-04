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
    <div className="p-4 border-t border-casual-black/10 dark:border-white/10 flex items-center justify-center bg-concrete dark:bg-transparent transition-colors font-primary">
      <nav>
        <ul className="inline-flex items-center -space-x-px text-sm shadow-sm">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-casual-black/70 dark:text-concrete/70 bg-white dark:bg-casual-black border border-casual-black/20 dark:border-white/20 rounded-l-lg hover:bg-casual-black/5 dark:hover:bg-white/10 hover:text-casual-black dark:hover:text-concrete disabled:bg-casual-black/5 dark:disabled:bg-white/5 disabled:text-casual-black/40 dark:disabled:text-concrete/40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
          </li>
          
          {pageNumbers.map((number, index) => (
            <li key={index}>
              {number === '...' ? (
                <span className="flex items-center justify-center px-3 h-8 leading-tight text-casual-black/70 dark:text-concrete/70 bg-white dark:bg-casual-black border border-casual-black/20 dark:border-white/20 transition-colors">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(number)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-casual-black/20 dark:border-white/20 transition-colors ${
                    currentPage === number
                      ? 'text-concrete bg-sporty-blue border-sporty-blue dark:bg-sporty-blue dark:border-sporty-blue font-semibold'
                      : 'text-casual-black/70 dark:text-concrete/70 bg-white dark:bg-casual-black hover:bg-casual-black/5 dark:hover:bg-white/10 hover:text-casual-black dark:hover:text-concrete'
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
              className="flex items-center justify-center px-3 h-8 leading-tight text-casual-black/70 dark:text-concrete/70 bg-white dark:bg-casual-black border border-casual-black/20 dark:border-white/20 rounded-r-lg hover:bg-casual-black/5 dark:hover:bg-white/10 hover:text-casual-black dark:hover:text-concrete disabled:bg-casual-black/5 dark:disabled:bg-white/5 disabled:text-casual-black/40 dark:disabled:text-concrete/40 disabled:cursor-not-allowed transition-colors"
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