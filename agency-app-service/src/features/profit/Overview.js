import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getMetricsAsync, selectMetrics } from './profitSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import DatePicker from 'features/datePicker/DatePicker';

import { Card } from 'components';
import MainStat from './components/MainStat';
import SecondaryStat from './components/SecondaryStat';
import NetRevenue from './components/metrics/NetRevenue';
import TotalCost from './components/metrics/TotalCost';
import NetProfit from './components/metrics/NetProfit';
import ProfitMargin from './components/metrics/ProfitMargin';
import Roi from './components/metrics/Roi';

const Overview = ({ account, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const metrics = useSelector(selectMetrics);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [selectedStat, setSelectedStat] = useState(t('Profit.NetProfit'));

  useEffect(() => {
    dispatch(getMetricsAsync(selectedDates));
  }, [selectedDates, dispatch, account, marketplace]);

  const mainStats = [
    {
      title: t('Profit.NetRevenue'),
      value: metrics && metrics.netRevenue,
      active: selectedStat === t('Profit.NetRevenue') ? true : false,
      type: 'currency',
    },
    {
      title: t('Profit.TotalCost'),
      value: metrics && metrics.totalCost,
      active: selectedStat === t('Profit.TotalCost') ? true : false,
      type: 'currency',
    },
    {
      title: t('Profit.NetProfit'),
      value: metrics && metrics.netProfit,
      active: selectedStat === t('Profit.NetProfit') ? true : false,
      type: 'currency',
    },
    {
      title: t('Profit.ProfitMargin'),
      value: metrics && metrics.profitMargin,
      active: selectedStat === t('Profit.ProfitMargin') ? true : false,
      type: 'percentage',
    },
    {
      title: t('Profit.ROI'),
      value: metrics && metrics.roi,
      active: selectedStat === t('Profit.ROI') ? true : false,
      type: 'percentage',
    },
  ];

  const secondaryStats = [
    {
      title: t('Profit.OrganicSales'),
      value: metrics && metrics.organicSales,
      type: 'currency',
    },
    {
      title: t('Profit.PPCSales'),
      value: metrics && metrics.ppcSales,
      type: 'currency',
    },
    {
      title: t('Profit.PPCSpend'),
      value: metrics && metrics.ppcSpend,
      type: 'currency',
    },
    {
      title: t('Profit.Refunds'),
      value: metrics && metrics.refunds,
      type: 'currency',
    },
    {
      title: t('Profit.TotalUnits'),
      value: metrics && metrics.totalUnits,
      type: 'number',
    },
    {
      title: t('Profit.TotalOrders'),
      value: metrics && metrics.totalOrders,
      type: 'number',
    },
    {
      title: t('Profit.FBAOrders'),
      value: metrics && metrics.fbaOrders,
      type: 'number',
    },
    {
      title: t('Profit.FBMOrders'),
      value: metrics && metrics.fbmOrders,
      type: 'number',
    },
  ];

  return (
    <>
      <div className="grid xl:grid-cols-2 gap-5 mb-4 bg-white shadow rounded-lg p-4">
        <div className="w-6/12">
          <DatePicker position="left" />
        </div>
      </div>

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

      {selectedStat === t('Profit.NetRevenue') && (
        <NetRevenue
          currentAccount={account}
          currentMarketplace={marketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === t('Profit.TotalCost') && (
        <TotalCost
          currentAccount={account}
          currentMarketplace={marketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === t('Profit.NetProfit') && (
        <NetProfit
          currentAccount={account}
          currentMarketplace={marketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === 'Profit Margin' && (
        <ProfitMargin
          currentAccount={account}
          currentMarketplace={marketplace}
          selectedDates={selectedDates}
        />
      )}

      {selectedStat === t('Profit.ROI') && (
        <Roi
          currentAccount={account}
          currentMarketplace={marketplace}
          selectedDates={selectedDates}
        />
      )}

      <div className="mt-5">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4 text-center">
          {secondaryStats.map(({ title, value, type }) => (
            <SecondaryStat
              key={title}
              title={title}
              value={value}
              type={type}
            />
          ))}
        </dl>
      </div>
    </>
  );
};

export default Overview;
