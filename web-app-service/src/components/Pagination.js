import React from 'react';
import _ from 'lodash';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

const Pagination = ({
  page: currentPage,
  sizePerPage,
  dataSize,
  onPageChange,
}) => {
  // Create an array of pages based on data size and page size
  const pages = _.range(1, Math.ceil(dataSize / sizePerPage) + 1);

  // Calculate results being shown on current page
  const from = currentPage * sizePerPage - sizePerPage + 1;
  const to =
    currentPage * sizePerPage > dataSize ? dataSize : currentPage * sizePerPage;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          disabled={currentPage === 1 ? true : false}
          onClick={() => {
            onPageChange(currentPage - 1);
          }}
        >
          Previous
        </button>
        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{from}</span> to{' '}
            <span className="font-medium">{to}</span> of{' '}
            <span className="font-medium">{dataSize}</span> results
          </p>
        </div>
        <div>
          <div
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled={currentPage === 1 ? true : false}
              onClick={() => {
                onPageChange(currentPage - 1);
              }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <div
              aria-current="page"
              className="bg-white border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {currentPage} of {pages.length}
            </div>

            <button
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled={currentPage === pages.length ? true : false}
              onClick={() => {
                onPageChange(currentPage + 1);
              }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
