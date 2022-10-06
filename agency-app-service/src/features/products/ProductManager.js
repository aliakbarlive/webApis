import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import PageHeader from 'components/PageHeader';
import AccountAndMarketplacePicker from 'components/AccountAndMarketplacePicker';
import Overview from './Overview';
import KeywordRanking from './keywords/KeywordRanking';
import Inventory from './inventory/Inventory';

const ProductManager = () => {
  const { t } = useTranslation();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const query = `?marketplace=${marketplace.details.countryCode}`;

  const tabs = [
    {
      name: t('Products.Overview'),
      href: `/accounts/${account.accountId}/products`,
      path: `/accounts/${account.accountId}/products`,
      component: Overview,
      exact: true,
    },
    {
      name: t('Products.KeywordRanking'),
      href: `/accounts/${account.accountId}/products/keyword-ranking`,
      path: `/accounts/${account.accountId}/products/keyword-ranking`,
      component: KeywordRanking,
      exact: false,
    },
    {
      name: t('Products.Inventory'),
      href: `/accounts/${account.accountId}/products/inventory`,
      path: `/accounts/${account.accountId}/products/inventory`,
      component: Inventory,
      exact: false,
    },
  ];

  return (
    <div id="account-details">
      <div className="block">
        <div className="grid grid-cols-12 py-5">
          <h2 className="col-span-12 mb-4 lg:col-span-5 xl:mb-0 xl:col-span-7 text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate border-b-2 border-transparent capitalize">
            {t('Products.ProductManager')}
          </h2>
          <div className="col-span-12 lg:col-span-7 xl:col-span-5 grid grid-cols-5 gap-4">
            <AccountAndMarketplacePicker
              accountClass="col-span-5 sm:col-span-3"
              marketplaceClass="col-span-5 sm:col-start-4 col-span-2 sm:row-start-1"
            />
          </div>
        </div>
      </div>

      <PageHeader tabs={tabs} query={query} />

      <Switch>
        {tabs.map((tab) => {
          const { component: Component } = tab;
          return (
            <Route
              key={tab.name}
              path={tab.path}
              exact={tab.exact}
              render={() => (
                <Component
                  query={query}
                  key={tab.href}
                  account={account}
                  marketplace={marketplace}
                />
              )}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default ProductManager;
