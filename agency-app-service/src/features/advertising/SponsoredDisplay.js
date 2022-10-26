import { Redirect, Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES } from './utils/constants';

import DatePicker from 'features/datePicker/DatePicker';
import Statistics from './components/Statistics';
import MetricsChart from './components/MetricsChart';
import Campaigns from './campaigns/Campaigns';
import AdGroups from './adGroups/AdGroups';
import Targets from './targets/Targets';
import Products from './productAds/Products';

const SponsoredDisplay = ({ account, marketplace, query }) => {
  const { t } = useTranslation();

  const tabs = [
    {
      name: t('Advertising.Campaigns'),
      component: Campaigns,
      href: `/accounts/${account.accountId}/advertising/displays/campaigns`,
      path: `/accounts/${account.accountId}/advertising/displays/campaigns`,
    },
    {
      name: t('Advertising.AdGroups'),
      component: AdGroups,
      href: `/accounts/${account.accountId}/advertising/displays/ad-groups`,
      path: `/accounts/${account.accountId}/advertising/displays/ad-groups`,
    },
    {
      name: t('Advertising.Targets'),
      component: Targets,
      href: `/accounts/${account.accountId}/advertising/displays/targets`,
      path: `/accounts/${account.accountId}/advertising/displays/targets`,
    },
    {
      name: 'Products',
      component: Products,
      href: `/accounts/${account.accountId}/advertising/displays/product-ads`,
      path: `/accounts/${account.accountId}/advertising/displays/product-ads`,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid xl:grid-cols-2">
        <div id="statistics">
          <div className="grid xl:grid-cols-2 gap-5 mb-4 bg-white shadow rounded-lg p-4">
            <div>
              <DatePicker position="left" />
            </div>
          </div>
          <Statistics
            url="/ppc/campaigns/statistics"
            campaignType="sponsoredDisplay"
            customAttributes={SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES}
            accountId={account.accountId}
            marketplace={marketplace.details.countryCode}
          />
        </div>

        <MetricsChart
          url="advertising/campaigns/performance"
          campaignType="sponsoredDisplay"
          customAttributes={SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES}
          accountId={account.accountId}
          marketplace={marketplace.details.countryCode}
        />
      </div>

      <div className="hidden sm:block mt-8">
        <div className="flex justify-between items-center border-b border-gray-200">
          {tabs && (
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={`${tab.href}${query}`}
                  className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  activeClassName="border-red-500 text-red-600"
                >
                  {tab.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>

      <Switch>
        <Route
          exact
          path={`/accounts/${account.accountId}/advertising/displays`}
          render={() => (
            <Redirect
              to={`/accounts/${account.accountId}/advertising/displays/campaigns${query}`}
            />
          )}
        />

        {tabs.map((tab) => {
          const { component: Component } = tab;

          return (
            <Route
              key={tab.name}
              exact={true}
              path={tab.path}
              render={() => (
                <Component
                  accountId={account.accountId}
                  marketplace={marketplace.details.countryCode}
                  campaignType="sponsoredDisplay"
                  customAttributes={SPONSORED_DISPLAY_CUSTOM_ATTRIBUTES}
                />
              )}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default SponsoredDisplay;
