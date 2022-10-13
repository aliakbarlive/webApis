import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/solid';
import classNames from 'utils/classNames';
import {
  selectAccounts,
  selectCurrentAccount,
  selectCurrentMarketplace,
  setCurrentAccount,
  setCurrentMarketplace,
} from 'features/accounts/accountsSlice';
import usFlag from 'assets/flags/us.png';
import mxFlag from 'assets/flags/mx.png';
import caFlag from 'assets/flags/ca.png';

const MarketplacePicker = () => {
  const accounts = useSelector(selectAccounts);
  const currentAccount = useSelector(selectCurrentAccount);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const dispatch = useDispatch();

  const flag = (countryCode) => {
    switch (countryCode) {
      case 'US':
        return usFlag;
      case 'CA':
        return caFlag;
      case 'MX':
        return mxFlag;

      default:
        break;
    }
  };

  const onSelectMarketplace = (account, marketplace) => {
    if (currentAccount.accountId !== account.accountId) {
      dispatch(setCurrentAccount(account));
    }

    if (currentMarketplace.marketplaceId !== marketplace.marketplaceId) {
      dispatch(setCurrentMarketplace(marketplace));
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
              {currentMarketplace ? (
                <>
                  <img
                    className="mr-2 h-5 w-5 object-contain"
                    src={flag(currentMarketplace.countryCode)}
                    alt={currentMarketplace.name}
                  />
                  {currentAccount.name}
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </>
              ) : (
                'No accounts synced'
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
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
            >
              {accounts &&
                accounts.map((account) => (
                  <div className="px-4 py-3" key={account.accountId}>
                    <p className="mb-2 text-sm font-medium text-gray-900 truncate">
                      {account.name}
                    </p>

                    {account.marketplaces.map((marketplace) => (
                      <Menu.Item
                        key={`${account.accountId}-${marketplace.marketplaceId}`}
                      >
                        {() => (
                          <button
                            href="#"
                            className={classNames(
                              marketplace === currentMarketplace &&
                                account === currentAccount
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-700',
                              'flex w-full text-left px-4 py-2 text-sm'
                            )}
                            onClick={() =>
                              onSelectMarketplace(account, marketplace)
                            }
                          >
                            <img
                              className="mr-2 h-5 w-5 object-contain"
                              src={flag(marketplace.countryCode)}
                              alt={marketplace.name}
                            />
                            {marketplace.name}
                            {marketplace === currentMarketplace &&
                              account === currentAccount && (
                                <CheckCircleIcon className="-mr-1 ml-2 h-5 w-5" />
                              )}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                ))}

              <div className="py-1">
                <form method="POST" action="#">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="submit"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block w-full text-left px-4 py-2 text-sm'
                        )}
                      >
                        Manage Accounts
                      </button>
                    )}
                  </Menu.Item>
                </form>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default MarketplacePicker;
