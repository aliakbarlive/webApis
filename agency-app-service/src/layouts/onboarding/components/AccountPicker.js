import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'utils/classNames';
import {
  selectAccounts,
  selectCurrentAccount,
  setCurrentAccount,
  setCurrentMarketplace,
} from 'features/accounts/accountsSlice';

const AccountPicker = () => {
  const accounts = useSelector(selectAccounts);
  const currentAccount = useSelector(selectCurrentAccount);

  const dispatch = useDispatch();

  const onAccountSelect = (account) => {
    if (currentAccount.accountId !== account.accountId) {
      dispatch(setCurrentAccount(account));
      dispatch(setCurrentMarketplace(account.marketplaces[0]));
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
              {currentAccount ? (
                <>
                  {currentAccount.name}
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </>
              ) : (
                'No accounts'
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
                    <Menu.Item>
                      {() => (
                        <button
                          className="text-gray-700 text-sm"
                          onClick={() => onAccountSelect(account)}
                        >
                          {account.name}
                        </button>
                      )}
                    </Menu.Item>
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

export default AccountPicker;
