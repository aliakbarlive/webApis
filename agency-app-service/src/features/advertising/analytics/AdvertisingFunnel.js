import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { numberFormatter, percentageFormatter } from 'utils/formatters';
import './funnel.scss';

const AdvertisingFunnel = ({ accountId, marketplace, startDate, endDate }) => {
  const [funnel, setFunnel] = useState(null);
  useEffect(() => {
    axios
      .get('/ppc/analytics/funnel', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
        },
      })
      .then((response) => setFunnel(response.data.data));
  }, [accountId, marketplace, startDate, endDate]);

  return (
    <div className="my-8 border border-gray-300 bg-white rounded-md shadow-md px-4">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-md">
        <p className="text-sm leading-6 font-medium text-gray-700">
          PPC Funnel
        </p>
      </div>

      {funnel && (
        <div className="flex justify-center my-8">
          <div className="max-w-xl w-full">
            <div className="funnel">
              <div className="trapezoid">
                <span className="text-sm">Impressions</span>
                <span className="text-5xl font-medium">
                  {numberFormatter(funnel.impressions)}
                </span>
              </div>
              <div className="trapezoid transparent">
                <span className="italic text-gray-400 font-serif">
                  {percentageFormatter(funnel.ctr)} click-through-rate
                </span>
              </div>
              <div className="trapezoid">
                <span className="text-sm">Clicks</span>
                <span className="text-5xl font-medium">
                  {numberFormatter(funnel.clicks)}
                </span>
              </div>
              <div className="trapezoid transparent">
                <span className="italic text-gray-400 font-serif">
                  {percentageFormatter(funnel.cr)} Conversion Rate
                </span>
              </div>
              <div className="trapezoid">
                <span className="text-sm">Orders</span>
                <span className="text-5xl font-medium">
                  {numberFormatter(funnel.orders)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvertisingFunnel;
