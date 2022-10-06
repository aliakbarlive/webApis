import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import SpinnerGrow from './SpinnerGrow';

const ButtonDropdown = ({
  children,
  classes,
  buttonTitle,
  buttonColor = 'red',
  textColor = 'white',
  loading,
  showLoading,
  buttonClick,
  itemsClasses = 'right-0 w-40 mt-1',
  buttonType = 'button',
}) => {
  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${classes ?? ''}`}
      style={{ zIndex: 1 }}
    >
      <div className="flex">
        <button
          type={buttonType}
          className={`${
            loading ? 'pointer-events-none' : ''
          } inline-flex items-center pl-4 pr-3 py-2 border border-transparent rounded-md rounded-r-none shadow-sm text-sm font-medium text-${textColor} bg-${buttonColor}-600 hover:bg-${buttonColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${buttonColor}-500`}
          onClick={buttonClick}
        >
          {buttonTitle}
          &nbsp;{showLoading && loading ? <SpinnerGrow color="white" /> : ''}
        </button>
        <Menu.Button
          className={`inline-flex justify-center pl-2 pr-3 py-2 border-l text-sm font-medium text-${textColor} bg-${buttonColor}-600 rounded-md rounded-l-none hover:bg-${buttonColor}-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <ChevronDownIcon className="w-5 h-5 -mr-1" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Menu.Items
        className={`${itemsClasses} absolute origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
      >
        {children}
      </Menu.Items>
    </Menu>
  );
};

export default ButtonDropdown;
