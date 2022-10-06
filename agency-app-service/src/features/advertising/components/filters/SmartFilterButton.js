import { AdjustmentsIcon } from '@heroicons/react/outline';

const SmartFilterButton = ({ display, count, onClick }) => {
  return (
    <button
      className="w-full relative flex justify-between items-center py-2 px-4 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white focus:outline-none"
      onClick={onClick}
    >
      {display}
      <AdjustmentsIcon className="ml-2 h-4 w-4" />
      {count > 0 && (
        <div className="flex items-center justify-center h-6 w-6 absolute text-white rounded-full border-2 border-white -right-3 -top-3 bg-red-600">
          <span className="text-xs">{count}</span>
        </div>
      )}
    </button>
  );
};

export default SmartFilterButton;
