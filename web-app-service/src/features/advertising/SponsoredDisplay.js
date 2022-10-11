import React from 'react';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';

import DatePicker from 'features/datePicker/DatePicker';
import MetricsChart from './components/MetricsChart';
import Statistics from './components/Statistics';
import Campaigns from './components/Campaigns';
import AdGroups from './components/AdGroups';
import Targets from './components/Targets';
import Products from './components/Products';

const SponsoredDisplay = ({ location }) => {
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
      name: 'Targets',
      component: Targets,
    },
    {
      name: 'Products',
      component: Products,
    },
  ];

  const customAttributes = {
    sales: 'attributedSales30d',
    orders: 'attributedUnitsOrdered30d',
    budget: 'budget',
    subPath: 'display',
  };

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
            customAttributes={customAttributes}
            campaignType="sponsoredDisplay"
          />
        </div>

        <MetricsChart
          url="ppc/campaigns/records"
          customAttributes={customAttributes}
          campaignType="sponsoredDisplay"
        />
      </div>

      <div className="hidden sm:block my-8">
        <div className="flex items-stretch justify-between items-center border-b border-gray-200">
          {tabs && (
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={`/advertising/display/${tab.name
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
          path="/advertising/display"
          render={() => (
            <Redirect to={`/advertising/display/campaigns${location.search}`} />
          )}
        />

        {tabs.map((tab) => {
          const { component: Component } = tab;

          return (
            <Route
              key={tab.name}
              path={`/advertising/display/${tab.name
                .replace(/\s+/g, '-')
                .toLowerCase()}`}
              render={() => (
                <Component
                  campaignType="sponsoredDisplay"
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

export default SponsoredDisplay;
