import { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Checkbox from './Checkbox';

const MultipleSelect = ({
  label,
  noSelectedText,
  selected,
  setSelected,
  options = {},
  className,
  menuClass = '',
  containerClass = '',
  itemClass = '',
}) => {
  const [selectedString, setSelectedString] = useState('');

  useEffect(() => {
    let text = '';

    Object.keys(selected).forEach((key) => {
      text = text + selected[key].join(', ');
    });

    setSelectedString(text);
  }, [selected]);

  const onSelect = (e, key, value) => {
    if (e !== '') {
      value = e.target.value;
      key = e.target.id.split('-')[0];
    }

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
        <Menu.Button className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
          <span className="text-left">
            {selectedString === '' ? noSelectedText : selectedString}
          </span>
          <ChevronDownIcon
            className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Menu.Items
        className={`mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          menuClass ?? ''
        }`}
      >
        <div className={containerClass ?? ''}>
          {Object.keys(options).map((optionKey) => {
            return options[optionKey].map((option, i) => {
              return (
                <label
                  className={`flex items-center text-sm font-normal text-gray-700 w-full cursor-pointer ${
                    itemClass ?? ''
                  }`}
                  key={`${optionKey}-${i}`}
                >
                  <Checkbox
                    id={`${optionKey}-${i}`}
                    value={option.value}
                    classes="mr-2"
                    onChange={onSelect}
                    checked={
                      optionKey in selected
                        ? selected[optionKey].includes(option.value)
                        : false
                    }
                  />
                  <span className="capitalize">
                    {option.display ?? option.value}
                  </span>
                </label>
              );
            });
          })}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default MultipleSelect;
