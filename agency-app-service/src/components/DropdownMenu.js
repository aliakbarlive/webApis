import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';

const DropdownMenu = ({
  children,
  title,
  classes,
  buttonBg = 'bg-red-600',
  buttonRounded = 'rounded-md',
  buttonFontWeight = 'font-medium',
  hoverClasses = 'bg-red-700',
  hoverText = '',
  textColor = 'text-white',
  titleClasses = 'mr-2 flex',
  hideArrow = false,
  dropdownWidth = 'w-56',
}) => {
  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${classes ?? ''}`}
    >
      <div>
        <Menu.Button
          className={`inline-flex justify-center w-full px-4 py-2 text-sm ${buttonFontWeight} ${textColor} ${buttonBg} ${buttonRounded} hover:${hoverClasses} ${hoverText} focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          {title ? <span className={titleClasses}>{title}</span> : ''}
          {!hideArrow && (
            <ChevronDownIcon
              className="w-5 h-5 -mr-1 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 sm:left-0 ${dropdownWidth} mt-0 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
