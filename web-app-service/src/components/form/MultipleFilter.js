import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { isObject, upperFirst } from 'lodash';

import classNames from 'utils/classNames';
import { Checkbox } from 'components';

const MultipleFilter = ({
  label,
  noSelectedText,
  selected,
  setSelected,
  options = {},
  className,
}) => {
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    let count = 0;

    Object.keys(selected).forEach((key) => {
      count = count + selected[key].length;
    });

    setSelectedCount(count);
  }, [selected]);

  const onSelect = (e) => {
    const { id, value } = e.target;
    const key = id.split('-')[0];
    let selectedCopy = { ...selected };

    if (selectedCopy[key]) {
      const index = selectedCopy[key].indexOf(value);

      index >= 0
        ? selectedCopy[key].splice(index, 1)
        : selectedCopy[key].push(value);

      setSelected(selectedCopy);
    }
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <p className="block text-sm font-medium text-gray-700 pb-1">{label}</p>
        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
          {selectedCount
            ? `${selectedCount} Filter(s) Selected`
            : noSelectedText}
          <ChevronDownIcon
            className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>{' '}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul>
            {Object.keys(options).map((optionKey, optionIndex) => {
              return options[optionKey].map((option, i) => {
                const isNotLastOption =
                  Object.keys(options).length !== optionIndex + 1;
                const isLastOptionChoice =
                  Object.keys(options[optionKey]).length === i + 1;
                const value = isObject(option) ? option.value : option;
                const display = isObject(option) ? option.display : option;

                return (
                  <div key={`${optionKey}-${i}`}>
                    <li
                      className={classNames(
                        isLastOptionChoice &&
                          isNotLastOption &&
                          'my-1 border-b',
                        'flex justify-between'
                      )}
                    >
                      <label className="text-sm font-medium text-gray-700 ml-3 w-full mt-2 cursor-pointer">
                        {upperFirst(display)}
                      </label>
                      <Checkbox
                        id={`${optionKey}-${i}`}
                        value={value}
                        className="my-2 mx-3"
                        onChange={onSelect}
                        checked={
                          optionKey in selected
                            ? selected[optionKey].includes(value)
                            : false
                        }
                      />
                    </li>
                  </div>
                );
              });
            })}
          </ul>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default MultipleFilter;
