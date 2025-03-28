interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  disabled = false
}: PaginationProps) {
  
  const renderPageButtons = () => {
    const buttons = [];
    
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    
    if (endPage - startPage + 1 < 3 && startPage > 1) {
      startPage = Math.max(1, endPage - 2);
    }
    
    buttons.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || disabled}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">First Page</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Previous</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={disabled}
          className={`relative inline-flex items-center px-3 sm:px-4 py-2 border ${
            currentPage === page
              ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
          } text-sm font-medium`}
        >
          {page}
        </button>
      );
    }
    
    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Next</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    buttons.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || disabled}
        className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="sr-only">Last Page</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
        </svg>
      </button>
    );
    
    return buttons;
  };

  return (
    <nav className="flex justify-center">
      <div className="flex flex-1 justify-center">
        <div className="inline-flex shadow-sm -space-x-px">
          {renderPageButtons()}
        </div>
      </div>
    </nav>
  );
}