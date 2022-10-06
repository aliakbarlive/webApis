import classNames from 'utils/classNames';

const InventoryPagination = ({
  count,
  prevPage,
  nextPage,
  from,
  to,
  onNext,
  onPrevious,
}) => {
  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t text-xs rounded-b-md"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-xs text-gray-700">
          Showing <span className="font-medium">{from}</span> to{' '}
          <span className="font-medium">{to}</span> of{' '}
          <span className="font-medium">{count}</span> results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          disabled={!prevPage}
          className={classNames(
            !prevPage ? 'cursor-not-allowed' : 'cursor-pointer',
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
          )}
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          disabled={!nextPage}
          className={classNames(
            !nextPage ? 'cursor-not-allowed' : 'cursor-pointer',
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
          )}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </nav>
  );
};
export default InventoryPagination;
