import React, { useState, useEffect } from 'react';

import axios from 'axios';

import ProfitBreakdown from './ProfitBreakdown';
import ProfitMetrics from './ProfitMetrics';
import ProfitTrend from './ProfitTrend';

const Profit = ({ asin, selectedDates }) => {
  const [salesMetrics, setSalesMetrics] = useState(null);
  const [salesTrend, setSalesTrend] = useState(null);

  useEffect(() => {
    try {
      const getSalesMetrics = async () => {
        const res = await axios({
          method: 'GET',
          url: `/sales-metrics/${asin}`,
          params: {
            ...selectedDates,
          },
        });

        setSalesMetrics(res.data.data);
      };
      getSalesMetrics();
    } catch (error) {
      console.log(error);
    }
  }, [selectedDates]);

  useEffect(() => {
    try {
      const getSalesTrend = async () => {
        const res = await axios({
          method: 'GET',
          url: `sales-metrics/trend/${asin}`,
          params: {
            ...selectedDates,
          },
        });
        setSalesTrend(res.data.data);
      };

      getSalesTrend();
    } catch (error) {
      console.log(error);
    }
  }, [selectedDates]);

  return (
    <>
      {salesMetrics && (
        <>
          <ProfitBreakdown profitBreakdown={salesMetrics.profitBreakdown} />
          <ProfitMetrics keyMetrics={salesMetrics.keyMetrics} />
        </>
      )}

      {salesTrend && <ProfitTrend trendAnalysis={salesTrend} />}
    </>
  );
};

export default Profit;
