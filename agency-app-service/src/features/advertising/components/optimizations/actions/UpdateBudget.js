import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { currencyFormatter } from 'utils/formatters';

const UpdateBudget = ({ item, optimization, onChangeData, attribute }) => {
  const onChange = (e) => {
    const { value } = e.target;
    onChangeData({ [attribute]: value !== '' ? parseFloat(value) : '' });
  };

  return (
    <div className="mt-1 flex rounded-md shadow-sm w-64">
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
        Current Budget {currencyFormatter(item[attribute])}
        <ArrowNarrowRightIcon className="ml-4 h-4 w-4" />
      </span>
      <input
        type="number"
        value={optimization.data[attribute]}
        onChange={onChange}
        className="flex-1 min-w-0 block px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 text-xs border-gray-300"
      />
    </div>
  );
};

export default UpdateBudget;
