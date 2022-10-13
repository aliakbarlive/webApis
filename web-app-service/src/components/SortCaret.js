import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

const SortCaret = (order, column) => {
  if (!order)
    return (
      <span className="cursor-pointer ml-1">
        <ChevronDownIcon className="h-4 w-4 text-gray-500 inline" />
        <ChevronUpIcon className="-m-1.5 h-4 w-4 text-gray-500 inline" />
      </span>
    );
  else if (order === 'asc')
    return (
      <span className="cursor-pointer ml-1">
        <ChevronDownIcon className="h-4 w-4 text-gray-500 inline" />
        <ChevronUpIcon className="-m-1.5 h-4 w-4 text-red-500 inline" />
      </span>
    );
  else if (order === 'desc')
    return (
      <span className="cursor-pointer ml-1">
        <ChevronDownIcon className="h-4 w-4 text-red-500 inline" />
        <ChevronUpIcon className="-m-1.5 h-4 w-4 text-gray-500 inline" />
      </span>
    );
  return null;
};

export default SortCaret;
