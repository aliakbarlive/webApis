import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { stateFormatter } from 'utils/formatter';

const CampaignDetail = ({ match }) => {
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const { campaignId, campaignType } = match.params;
  const [campaign, setCampaign] = useState();
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
      .get(`ppc/campaigns/${campaignId}`, {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        },
      })
      .then((res) => setCampaign(res.data.data));
  }, [account, marketplace, campaignId]);

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
            url={`ppc/campaigns/${campaignId}/statistics`}
            customAttributes={customAttributes}
          />
        </div>

        <MetricsChart
          url={`ppc/campaigns/${campaignId}/records`}
          customAttributes={customAttributes}
        />
      </div>

      {campaign && (
        <Card className="mt-6">
          <h3 className="font-medium text-gray-700">
            <span className="mr-4">Campaign: {campaign.name}</span>
            {stateFormatter(campaign.state)}
          </h3>
        </Card>
      )}

      <div className="mt-8 flex items-stretch justify-between items-center border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <div className="flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-red-500 text-red-600">
            Negative Keywords
          </div>
        </nav>
      </div>

      <NegativeKeywords
        url={`ppc/campaigns/${campaignId}/negative-keywords`}
        keyField="advCampaignNegativeKeywordId"
      />
    </div>
  );
};

export default CampaignDetail;
