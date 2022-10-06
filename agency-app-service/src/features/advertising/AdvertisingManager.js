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
import SponsoredProducts from './SponsoredProducts';
import SponsoredDisplay from './SponsoredDisplay';
import SponsoredBrands from './SponsoredBrands';
import Analytics from './Analytics';
import Reports from './Reports';
import Trends from './Trends';

import AdvertisingApiNotConnected from './components/AdvertisingApiNotConnected';
import NoAdvertisingProfile from './components/NoAdvertisingProfile';

const AdvertisingManager = () => {
  const { t } = useTranslation();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const query = `?marketplace=${marketplace.details.countryCode}`;

  const tabs = [
    {
      name: 'Analytics',
      href: `/accounts/${account.accountId}/advertising`,
      path: `/accounts/${account.accountId}/advertising`,
      component: Analytics,
      exact: true,
    },
    {
      name: 'Reports',
      href: `/accounts/${account.accountId}/advertising/reports`,
      path: `/accounts/${account.accountId}/advertising/reports`,
      component: Reports,
      exact: true,
    },
    {
      name: 'Trends',
      href: `/accounts/${account.accountId}/advertising/trends`,
      path: `/accounts/${account.accountId}/advertising/trends`,
      component: Trends,
      exact: false,
    },
    {
      name: t('Advertising.SponsoredProducts'),
      href: `/accounts/${account.accountId}/advertising/products`,
      path: `/accounts/${account.accountId}/advertising/products`,
      component: SponsoredProducts,
      exact: false,
    },
    {
      name: t('Advertising.SponsoredBrands'),
      href: `/accounts/${account.accountId}/advertising/brands`,
      path: `/accounts/${account.accountId}/advertising/brands`,
      component: SponsoredBrands,
      exact: false,
    },
    {
      name: t('Advertising.SponsoredDisplay'),
      href: `/accounts/${account.accountId}/advertising/displays`,
      path: `/accounts/${account.accountId}/advertising/displays`,
      component: SponsoredDisplay,
      exact: false,
    },
  ];

  return (
    <div id="account-details">
      <div className="block">
        <div className="grid grid-cols-12 py-5">
          <h2 className="col-span-12 mb-4 lg:col-span-5 xl:mb-0 xl:col-span-7 text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate border-b-2 border-transparent capitalize">
            {t('Advertising.AdvertisingManager')}
          </h2>
          <div className="col-span-12 lg:col-span-7 xl:col-span-5 grid grid-cols-5 gap-4">
            <AccountAndMarketplacePicker
              accountClass="col-span-5 sm:col-span-3"
              marketplaceClass="col-span-5 sm:col-start-4 col-span-2 sm:row-start-1"
            />
          </div>
        </div>
      </div>

      {account.credentials.find(
        (credential) => credential.service === 'advApi'
      ) ? (
        account.advProfiles.find(
          (profileId) => profileId.marketplaceId === marketplace.marketplaceId
        ) ? (
          <>
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
          </>
        ) : (
          <NoAdvertisingProfile account={account} />
        )
      ) : (
        <AdvertisingApiNotConnected />
      )}
    </div>
  );
};

export default AdvertisingManager;
