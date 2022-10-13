import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { Card } from 'components';
import DatePicker from 'features/datePicker/DatePicker';
import MetricsChart from './MetricsChart';
import Statistics from './Statistics';
import NegativeKeywords from './NegativeKeywords';
import NegativeTargets from './NegativeTargets';
import { stateFormatter } from 'utils/formatter';

const AdGroupDetail = ({ match }) => {
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const { adGroupId, campaignType } = match.params;
  const [adGroup, setAdGroup] = useState();
  const customAttributes = {
    sales:
      campaignType === 'brands' ? 'attributedSales14d' : 'attributedSales30d',
    orders:
      campaignType === 'brands'
        ? 'attributedUnitsOrdered14d'
        : 'attributedUnitsOrdered30d',
    budget: campaignType === 'brands' ? 'budget' : 'dailyBudget',
    subPath: campaignType,
  };

  useEffect(() => {
    axios
      .get(`ppc/ad-groups/${adGroupId}`, {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        },
      })
      .then((res) => setAdGroup(res.data.data));
  }, [account, marketplace, adGroupId]);

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
            url={`ppc/ad-groups/${adGroupId}/statistics`}
            customAttributes={customAttributes}
          />
        </div>

        <MetricsChart
          url={`ppc/ad-groups/${adGroupId}/records`}
          customAttributes={customAttributes}
        />
      </div>

      {adGroup && (
        <Card className="mt-6">
          <h3 className="font-medium text-gray-700">
            <span className="mr-4">Ad Group: {adGroup.name}</span>
            {stateFormatter(adGroup.state)}
          </h3>
        </Card>
      )}

      {/* Tabs */}
      <div className="mt-8 flex items-stretch justify-between items-center border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <NavLink
            to={`/advertising/${campaignType}/ad-groups/${adGroupId}/negative-keywords`}
            className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            activeClassName="border-red-500 text-red-600"
          >
            Negative Keywords
          </NavLink>

          <NavLink
            to={`/advertising/${campaignType}/ad-groups/${adGroupId}/negative-targets`}
            className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            activeClassName="border-red-500 text-red-600"
          >
            Negative Targets
          </NavLink>
        </nav>
      </div>

      {/* Sub Routes */}
      <Switch>
        <Route
          exact
          path={`/advertising/${campaignType}/ad-groups/${adGroupId}`}
          render={() => (
            <Redirect
              to={`/advertising/${campaignType}/ad-groups/${adGroupId}/negative-keywords`}
            />
          )}
        />

        <Route
          path={`/advertising/${campaignType}/ad-groups/${adGroupId}/negative-keywords`}
          render={() => (
            <NegativeKeywords
              url={`ppc/ad-groups/${adGroupId}/negative-keywords`}
              keyField="advNegativeKeywordId"
            />
          )}
        />

        <Route
          path={`/advertising/${campaignType}/ad-groups/${adGroupId}/negative-targets`}
          render={() => (
            <NegativeTargets
              url={`ppc/ad-groups/${adGroupId}/negative-targets`}
              keyField="advNegativeKeywordId"
            />
          )}
        />
      </Switch>
    </div>
  );
};

export default AdGroupDetail;
