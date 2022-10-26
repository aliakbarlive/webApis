import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Input from 'components/Forms/Input';
import {
  Menu as Smenu,
  MenuItem,
  FocusableItem,
  MenuButton,
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import {
  selectLoading,
  selectCurrentAccount,
  selectCurrentMarketplace,
  setCurrentMarketplace,
  selectAccountList,
  getAccountsAsync,
  setCurrentAccount,
} from 'features/accounts/accountsSlice';
import classNames from 'utils/classNames';
import { countryCodeToFlag } from 'utils/formatters';

const AccountPicker = ({ marketplaceClass, accountClass }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const loading = useSelector(selectLoading);
  const accountList = useSelector(selectAccountList);
  const [filter, setFilter] = useState('');
  const history = useHistory();

  const onSelectMarketplace = (targetMarketplace) => {
    if (
      marketplace &&
      marketplace.marketplaceId === targetMarketplace.marketplaceId
    ) {
      return;
    }

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.set('marketplace', targetMarketplace.details.countryCode);

    dispatch(setCurrentMarketplace(targetMarketplace));
    history.replace({ search: searchParams.toString() });
  };

  const onSelectAccount = (targetAccount) => {
    if (account && account.accountId === targetAccount.accountId) return;
    const pathname = history.location.pathname.replace(
      account.accountId,
      targetAccount.accountId
    );

    const searchParams = new URLSearchParams(history.location.search);
    dispatch(setCurrentAccount(targetAccount));

    if (
      !!!targetAccount.marketplaces.find(
        (m) => m.details.countryCode === searchParams.get('marketplace')
      )
    ) {
      const targetMarketplace = targetAccount.marketplaces[0];
      searchParams.set('marketplace', targetMarketplace.details.countryCode);

      dispatch(setCurrentMarketplace(targetMarketplace));
    }

    history.replace({ pathname, search: searchParams.toString() });
  };

  const handleSearchWithDebounce = debounce(async (e) => {
    dispatch(getAccountsAsync({ search: e.target.value }));
  }, 500);

  const onChangeFilter = (e) => {
    setFilter(e.target.value);
    handleSearchWithDebounce(e);
  };

  const resetAccountList = () => {
    dispatch(getAccountsAsync());
  };

  return !loading && account ? (
    <>
      <div className={accountClass}>
        <Smenu
          transition
          onMenuChange={() => {
            setFilter('');
            resetAccountList();
          }}
          menuButton={
            <MenuButton className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
              {account ? (
                <>
                  <p
                    className="inline-flex justify-center w-full"
                    data-tip={account.name}
                  >
                    {account.name.length > 24
                      ? `${account.name.substr(0, 24)}...`
                      : account.name}
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </p>
                  {account.name.length > 24 && (
                    <ReactTooltip
                      place="top"
                      className="max-w-xs text-black"
                      backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                      textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                    />
                  )}
                </>
              ) : (
                t('Account.NoSelected')
              )}
            </MenuButton>
          }
        >
          <FocusableItem>
            {() => (
              <Input
                name="search"
                type="text"
                placeholder="Search"
                value={filter}
                onChange={onChangeFilter}
                classes="appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none"
              />
            )}
          </FocusableItem>
          {accountList.count ? (
            accountList.rows.map((el) => (
              <MenuItem
                key={`${el.accountId}`}
                className="text-left w-full px-1 text-xs text-gray-700 hover:bg-gray-100"
              >
                {() => (
                  <button
                    className={classNames(
                      account && el.accountId === account.accountId
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-700',
                      'flex w-full text-left px-4 py-2 text-sm'
                    )}
                    onClick={() => onSelectAccount(el)}
                  >
                    {el.name.length > 24
                      ? `${el.name.substr(0, 24)}...`
                      : el.name}
                    {account && el.accountId === account.accountId && (
                      <CheckCircleIcon className="-mr-1 ml-2 h-5 w-5" />
                    )}
                  </button>
                )}
              </MenuItem>
            ))
          ) : (
            <MenuItem
              key="none"
              className="text-left w-full px-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              {() => (
                <button className="flex w-full text-left px-4 py-2 text-sm text-gray-700">
                  No accounts to list
                </button>
              )}
            </MenuItem>
          )}
        </Smenu>
      </div>

      {/* Marketplace picker */}
      <Menu
        as="div"
        className={`${marketplaceClass} relative inline-block text-left`}
      >
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500">
                {marketplace ? (
                  <>
                    <img
                      className="mr-2 h-5 w-5 object-contain"
                      src={countryCodeToFlag(marketplace.details.countryCode)}
                      alt={marketplace.details.name}
                    />
                    {marketplace.details.name}
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
                static={true}
                className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
              >
                <div className="px-4 py-3">
                  {account &&
                    account.marketplaces.map((option) => (
                      <Menu.Item key={`${option.marketplaceId}`}>
                        {() => (
                          <button
                            className={classNames(
                              marketplace &&
                                option.marketplaceId ===
                                  marketplace.marketplaceId
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-700',
                              'flex w-full text-left px-4 py-2 text-sm'
                            )}
                            onClick={() => onSelectMarketplace(option)}
                          >
                            <img
                              className="mr-2 h-5 w-5 object-contain"
                              src={countryCodeToFlag(
                                option.details.countryCode
                              )}
                              alt={option.details.name}
                            />
                            {option.details.name}
                            {marketplace &&
                              option.marketplaceId ===
                                marketplace.marketplaceId && (
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
    </>
  ) : (
    <h4 className="text-center text-gray-700 mt-8 font-medium text-lg">
      {t('Loading')}
    </h4>
  );
};

export default AccountPicker;
