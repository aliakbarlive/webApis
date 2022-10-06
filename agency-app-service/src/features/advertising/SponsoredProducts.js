import { Redirect, Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectAuthenticatedUser } from 'features/auth/authSlice';

import DatePicker from 'features/datePicker/DatePicker';
import Statistics from './components/Statistics';
import MetricsChart from './components/MetricsChart';
import Campaigns from './campaigns/Campaigns';
import AdGroups from './adGroups/AdGroups';
import Keywords from './keywords/Keywords';
import Targets from './targets/Targets';
import SearchTerms from './searchTerms/Searchterms';
import Products from './productAds/Products';
import Rules from './components/Rules';
import Optimizations from './optimizations/Optimizations';
import ChangeLogs from './components/ChangeLogs';
import NegativeKeywords from './components/NegativeKeywords';
import NegativeTargets from './components/NegativeTargets';

import { SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES } from './utils/constants';
import { userCan } from 'utils/permission';

const SponsoredProducts = ({ account, marketplace, query }) => {
  const { t } = useTranslation();
  const user = useSelector(selectAuthenticatedUser);

  const tabs = [
    {
      name: t('Advertising.Campaigns'),
      component: Campaigns,
      href: `/accounts/${account.accountId}/advertising/products/campaigns`,
      path: `/accounts/${account.accountId}/advertising/products/campaigns`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.AdGroups'),
      component: AdGroups,
      href: `/accounts/${account.accountId}/advertising/products/ad-groups`,
      path: `/accounts/${account.accountId}/advertising/products/ad-groups`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.Keywords'),
      component: Keywords,
      href: `/accounts/${account.accountId}/advertising/products/keywords`,
      path: `/accounts/${account.accountId}/advertising/products/keywords`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.Targets'),
      component: Targets,
      href: `/accounts/${account.accountId}/advertising/products/targets`,
      path: `/accounts/${account.accountId}/advertising/products/targets`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.SearchTerms'),
      component: SearchTerms,
      href: `/accounts/${account.accountId}/advertising/products/search-terms`,
      path: `/accounts/${account.accountId}/advertising/products/search-terms`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.Products'),
      component: Products,
      href: `/accounts/${account.accountId}/advertising/products/product-ads`,
      path: `/accounts/${account.accountId}/advertising/products/product-ads`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.NegKeywords'),
      component: NegativeKeywords,
      href: `/accounts/${account.accountId}/advertising/products/negative-keywords`,
      path: `/accounts/${account.accountId}/advertising/products/negative-keywords`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.NegTargets'),
      component: NegativeTargets,
      href: `/accounts/${account.accountId}/advertising/products/negative-targets`,
      path: `/accounts/${account.accountId}/advertising/products/negative-targets`,
      visible: true,
      exact: true,
    },
    {
      name: t('Advertising.Rules'),
      component: Rules,
      href: `/accounts/${account.accountId}/advertising/products/rules`,
      path: `/accounts/${account.accountId}/advertising/products/rules`,
      visible: userCan(user, 'ppc.rule.list'),
      exact: false,
    },
    {
      name: t('Advertising.Optimizations'),
      component: Optimizations,
      href: `/accounts/${account.accountId}/advertising/products/optimizations`,
      path: `/accounts/${account.accountId}/advertising/products/optimizations`,
      visible: userCan(
        user,
        'ppc.optimization.noApproval|ppc.optimization.requireApproval'
      ),
      exact: true,
    },
    {
      name: t('Advertising.ChangeLogs'),
      component: ChangeLogs,
      href: `/accounts/${account.accountId}/advertising/products/change-logs`,
      path: `/accounts/${account.accountId}/advertising/products/change-logs`,
      visible: true,
      exact: true,
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
            campaignType="sponsoredProducts"
            customAttributes={SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES}
            accountId={account.accountId}
            marketplace={marketplace.details.countryCode}
          />
        </div>

        <MetricsChart
          url="advertising/campaigns/performance"
          campaignType="sponsoredProducts"
          customAttributes={SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES}
          accountId={account.accountId}
          marketplace={marketplace.details.countryCode}
        />
      </div>

      <div className="hidden sm:block mt-8">
        <div className="flex justify-between items-center border-b border-gray-200">
          {tabs && (
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs
                .filter((tab) => tab.visible)
                .map((tab) => (
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
          path={`/accounts/${account.accountId}/advertising/products`}
          render={() => (
            <Redirect
              to={`/accounts/${account.accountId}/advertising/products/campaigns${query}`}
            />
          )}
        />

        {tabs
          .filter((tab) => tab.visible)
          .map((tab) => {
            const { component: Component } = tab;

            return (
              <Route
                key={tab.name}
                exact={tab.exact}
                path={tab.path}
                render={() => (
                  <Component
                    accountId={account.accountId}
                    marketplace={marketplace.details.countryCode}
                    campaignType="sponsoredProducts"
                    customAttributes={SPONSORED_PRODUCT_CUSTOM_ATTRIBUTES}
                  />
                )}
              />
            );
          })}
      </Switch>
    </div>
  );
};

export default SponsoredProducts;
