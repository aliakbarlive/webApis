import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const ZohoTablePagination = ({
  paginationProps,
  handlePrevPage,
  handleNextPage,
  handleSizePerPage,
  data,
}) => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-start md:justify-between border-t border-gray-200 sm:px-6">
      <div>
        <select
          id="location"
          name="location"
          value={paginationProps.sizePerPage}
          onChange={(e) => handleSizePerPage(paginationProps, e.target.value)}
          className="mt-1 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-300 focus:border-red-300 sm:text-sm rounded-md"
        >
          {paginationProps.sizePerPageList.map((num, i) => (
            <option key={i} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700 mx-5">
          Page {paginationProps.page}
        </span>
      </div>
      <div className="flex items-center">
        <div className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-red-300 focus:border-red-300"
            onClick={handlePrevPage(paginationProps)}
            disabled={paginationProps.page <= 1}
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> Prev
          </button>

          <button
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-red-300 focus:border-red-300"
            onClick={handleNextPage(paginationProps)}
            disabled={!data.has_more_page}
          >
            Next <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZohoTablePagination;
