import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMetricsAsync, selectMetrics } from '../profitSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';
import { Card } from 'components';
import DatePicker from 'features/datePicker/DatePicker';
import MainStat from './components/MainStat';
import SecondaryStat from './components/SecondaryStat';
import NetProfit from './NetProfit';
import NetRevenue from './NetRevenue';
import TotalCost from './TotalCost';

const Overview = () => {
  const dispatch = useDispatch();

  const metrics = useSelector(selectMetrics);
  const selectedDates = useSelector(selectCurrentDateRange);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);

  const [selectedStat, setSelectedStat] = useState('Net Profit');

  useEffect(() => {
    dispatch(getMetricsAsync(selectedDates));
  }, [selectedDates, dispatch, currentAccount, currentMarketplace]);

  const mainStats = [
    {
      title: 'Net Revenue',
      value: metrics && metrics.netRevenue,
      active: selectedStat === 'Net Revenue' ? true : false,
      type: 'currency',
    },

    {
      title: 'Total Cost',
      value: metrics && metrics.totalCost,
      active: selectedStat === 'Total Cost' ? true : false,
      type: 'currency',
    },
    {
      title: 'Net Profit',
      value: metrics && metrics.netProfit,
      active: selectedStat === 'Net Profit' ? true : false,
      type: 'currency',
    },
    {
      title: 'Profit Margin',
      value: metrics && metrics.profitMargin,
      active: selectedStat === 'Profit Margin' ? true : false,
      type: 'percentage',
    },
    {
      title: 'ROI',
      value: metrics && metrics.roi,
      active: selectedStat === 'ROI' ? true : false,
      type: 'percentage',
    },
  ];

  const secondaryStats = [
    {
      title: 'Organic Sales',
      value: metrics && metrics.organicSales,
      type: 'currency',
    },
    {
      title: 'PPC Sales',
      value: metrics && metrics.ppcSales,
      type: 'currency',
    },
    {
      title: 'PPC Spend',
      value: metrics && metrics.ppcSpend,
      type: 'currency',
    },
    {
      title: 'Refunds',
      value: metrics && metrics.refunds,
      type: 'currency',
    },
    {
      title: 'Total Units',
      value: metrics && metrics.totalUnits,
      type: 'number',
    },
    {
      title: 'Total Orders',
      value: metrics && metrics.totalOrders,
      type: 'number',
    },
    {
      title: 'FBA Orders',
      value: metrics && metrics.fbaOrders,
      type: 'number',
    },
    {
      title: 'FBM Orders',
      value: metrics && metrics.fbmOrders,
      type: 'number',
    },
  ];

  return (
    <>
      <Card className="mb-8" flex>
        <div className="col-span-12 sm:col-span-4 xl:col-span-3">
          <DatePicker />
        </div>
      </Card>

      <Card className="mt-5">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-5 text-center">
          {mainStats.map(({ title, value, active, type }) => (
            <MainStat
              key={title}
              title={title}
              value={value}
              active={active}
              type={type}
              onClick={() => setSelectedStat(title)}
            />
          ))}
        </dl>
      </Card>

      {selectedStat === 'Net Profit' && (
        <NetProfit
          currentAccount={currentAccount}
          currentMarketplace={currentMarketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === 'Net Revenue' && (
        <NetRevenue
          currentAccount={currentAccount}
          currentMarketplace={currentMarketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === 'Total Cost' && (
        <TotalCost
          currentAccount={currentAccount}
          currentMarketplace={currentMarketplace}
          selectedDates={selectedDates}
        />
      )}

      {/* {selectedStat === 'Profit Margin' && (
        <ProfitMargin
          currentAccount={currentAccount}
          currentMarketplace={currentMarketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === 'ROI' && (
        <Roi
          currentAccount={currentAccount}
          currentMarketplace={currentMarketplace}
          selectedDates={selectedDates}
        />
      )} */}

      <div className="mt-5">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4 text-center">
          {secondaryStats.map(({ title, value, type }) => (
            <SecondaryStat key={title} title={title} value={value} type={type} />
          ))}
        </dl>
      </div>
    </>
  );
};

export default Overview;
