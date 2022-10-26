import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/solid';

import { setCurrentMarketplace } from 'features/accounts/accountsSlice';

import classNames from 'utils/classNames';
import { countryCodeToFlag } from 'utils/formatters';

const MarketplacePicker = ({ accountName, options, selected, history }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onSelectMarketplace = (marketplace) => {
    if (selected && selected.marketplaceId === marketplace.marketplaceId)
      return;

    const { search, pathname } = history.location;

    const searchParams = new URLSearchParams(search);
    searchParams.set('marketplace', marketplace.details.countryCode);

    dispatch(setCurrentMarketplace(marketplace));

    history.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
              {accountName ? (
                <>
                  <img
                    className="mr-2 h-5 w-5 object-contain"
                    src={countryCodeToFlag(selected.details.countryCode)}
                    alt={selected.details.name}
                  />
                  {accountName}
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </>
              ) : (
                t('Account.NoSelected')
              )}
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
            >
              <div className="px-4 py-3">
                {options &&
                  options.map((option) => (
                    <Menu.Item key={`${option.marketplaceId}`}>
                      {() => (
                        <button
                          className={classNames(
                            selected &&
                              option.marketplaceId === selected.marketplaceId
                              ? 'bg-red-50 text-red-600'
                              : 'text-gray-700',
                            'flex w-full text-left px-4 py-2 text-sm'
                          )}
                          onClick={() => onSelectMarketplace(option)}
                        >
                          <img
                            className="mr-2 h-5 w-5 object-contain"
                            src={countryCodeToFlag(option.details.countryCode)}
                            alt={option.details.name}
                          />
                          {option.details.name}
                          {selected &&
                            option.marketplaceId === selected.marketplaceId && (
                              <CheckCircleIcon className="-mr-1 ml-2 h-5 w-5" />
                            )}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default MarketplacePicker;
