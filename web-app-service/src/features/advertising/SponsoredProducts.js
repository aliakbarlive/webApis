import React from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import DatePicker from 'features/datePicker/DatePicker';
import MetricsChart from './components/MetricsChart';
import Statistics from './components/Statistics';
import Campaigns from './components/Campaigns';
import AdGroups from './components/AdGroups';
import Keywords from './components/Keywords';
import Targets from './components/Targets';
import SearchTerms from './components/SearchTerms';
import Products from './components/Products';

const SponsoredProducts = ({ location }) => {
  const customAttributes = {
    sales: 'attributedSales30d',
    orders: 'attributedUnitsOrdered30d',
    budget: 'dailyBudget',
    subPath: 'products',
  };

  const tabs = [
    {
      name: 'Campaigns',
      component: Campaigns,
    },
    {
      name: 'Ad Groups',
      component: AdGroups,
    },
    {
      name: 'Keywords',
      component: Keywords,
    },
    {
      name: 'Targets',
      component: Targets,
    },
    {
      name: 'Search Terms',
      component: SearchTerms,
    },
    {
      name: 'Products',
      component: Products,
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
            customAttributes={customAttributes}
          />
        </div>

        <MetricsChart
          url="ppc/campaigns/records"
          campaignType="sponsoredProducts"
          customAttributes={customAttributes}
        />
      </div>

      <div className="hidden sm:block mt-8">
        <div className="flex items-stretch justify-between items-center border-b border-gray-200">
          {tabs && (
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={`/advertising/products/${tab.name
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`}
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
          path="/advertising/products"
          render={() => (
            <Redirect
              to={`/advertising/products/campaigns${location.search}`}
            />
          )}
        />

        {tabs.map((tab) => {
          const { component: Component } = tab;

          return (
            <Route
              key={tab.name}
              exact={true}
              path={`/advertising/products/${tab.name
                .replace(/\s+/g, '-')
                .toLowerCase()}`}
              render={() => (
                <Component
                  campaignType="sponsoredProducts"
                  customAttributes={customAttributes}
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
