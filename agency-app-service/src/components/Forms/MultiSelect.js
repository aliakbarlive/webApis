import { CheckCircleIcon } from '@heroicons/react/solid';

import { Menu as Smenu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

const MultiSelect = ({ options, placeholder, selected, setSelected }) => {
  const onSelectOption = (value) => {
    let selectedCopy = [...selected];

    const index = selected.findIndex((sValue) => sValue === value);
    selectedCopy =
      index >= 0
        ? selectedCopy.filter((sValue) => sValue !== value)
        : [...selectedCopy, value];

    setSelected(selectedCopy);
  };
  return (
    <Smenu
      transition
      menuStyles={{ width: '100%' }}
      menuButton={
        <MenuButton className="inline-flex justify-start w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
          {placeholder}
        </MenuButton>
      }
    >
      <div className="h-36 overflow-y-scroll w-full">
        {options.map((option) => (
          <MenuItem
            key={option.value}
            className="text-left w-full px-1 text-xs text-gray-700 hover:bg-gray-100"
          >
            {() => (
              <button
                className="flex w-full text-left pl-0 pr-2 py-1 text-sm"
                onClick={() => onSelectOption(option.value)}
              >
                {selected.includes(option.value) && (
                  <CheckCircleIcon className="h-5 w-5 text-red-500" />
                )}
                <span className="ml-2">{option.display}</span>
              </button>
            )}
          </MenuItem>
        ))}
      </div>
    </Smenu>
  );
};

export default MultiSelect;
