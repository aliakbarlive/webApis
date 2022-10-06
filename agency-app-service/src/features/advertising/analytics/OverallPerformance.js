import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
} from '@heroicons/react/outline';

import AnalyticsCard from './AnalyticsCard';
import Cpm from '../components/metrics/Cpm';
import ImpressionsPerClick from '../components/metrics/ImpressionsPerClick';
import ClicksPerConversion from '../components/metrics/ClicksPerConversion';
import ConversionsPerUnit from '../components/metrics/ConversionsPerUnit';
import Impressions from '../components/metrics/Impressions';
import CostPerConversion from '../components/metrics/CostPerConversion';
import ACoS from '../components/metrics/ACoS';
import ClickThroughRate from '../components/metrics/ClickThroughRate';
import ConversionRate from '../components/metrics/ConversionRate';
import RoAS from '../components/metrics/RoAS';
import AverageOrderValue from '../components/metrics/AverageOrderValue';
import CostPerClick from '../components/metrics/CostPerClick';
import TotalSales from '../components/metrics/TotalSales';
import TACoS from '../components/metrics/TACos';
import AdSales from '../components/metrics/AdSales';
import AdSpend from '../components/metrics/AdSpend';
import Clicks from '../components/metrics/Clicks';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

import classNames from 'utils/classNames';

const OverallPerformance = ({
  accountId,
  marketplace,
  startDate,
  endDate,
  selectedMetrics,
  onSelectMetric,
}) => {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState({
    previous: { data: {}, dateRange: {} },
    current: { data: {}, dateRange: {} },
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/advertising/analytics/overall', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
        },
      })
      .then((response) => setPerformance(response.data.data))
      .finally(() => setLoading(false));
  }, [accountId, marketplace, startDate, endDate]);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8">
      <Cpm
        loading={loading}
        showLoading={true}
        value={performance.current.data.cpm}
        previousValue={performance.previous.data.cpm}
        cost={performance.current.data.cost}
        impressions={performance.current.data.impressions}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('cpm') && 'border-t-2',
          selectedMetrics[0] === 'cpm' && 'border-blue-500',
          selectedMetrics[1] === 'cpm' && 'border-green-500',
          selectedMetrics[2] === 'cpm' && 'border-yellow-500'
        )}
        onClick={() => onSelectMetric('cpm')}
      />

      <ImpressionsPerClick
        loading={loading}
        showLoading={true}
        value={performance.current.data.impressionsPerClick}
        previousValue={performance.previous.data.impressionsPerClick}
        clicks={performance.current.data.clicks}
        impressions={performance.current.data.impressions}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('impressionsPerClick') && 'border-t-2',
          selectedMetrics[0] === 'impressionsPerClick' && 'border-blue-500',
          selectedMetrics[1] === 'impressionsPerClick' && 'border-green-500',
          selectedMetrics[2] === 'impressionsPerClick' && 'border-yellow-500'
        )}
        onClick={() => onSelectMetric('impressionsPerClick')}
      />

      <ClicksPerConversion
        loading={loading}
        showLoading={true}
        value={performance.current.data.clicksPerOrder}
        previousValue={performance.previous.data.clicksPerOrder}
        clicks={performance.current.data.clicks}
        orders={performance.current.data.orders}
        onClick={() => onSelectMetric('clicksPerOrder')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('clicksPerOrder') && 'border-t-2',
          selectedMetrics[0] === 'clicksPerOrder' && 'border-blue-500',
          selectedMetrics[1] === 'clicksPerOrder' && 'border-green-500',
          selectedMetrics[2] === 'clicksPerOrder' && 'border-yellow-500'
        )}
      />

      <ConversionsPerUnit
        loading={loading}
        showLoading={true}
        value={performance.current.data.ordersPerUnit}
        previousValue={performance.previous.data.ordersPerUnit}
        orders={performance.current.data.orders}
        units={performance.current.data.unitsSold}
        onClick={() => onSelectMetric('ordersPerUnit')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('ordersPerUnit') && 'border-t-2',
          selectedMetrics[0] === 'ordersPerUnit' && 'border-blue-500',
          selectedMetrics[1] === 'ordersPerUnit' && 'border-green-500',
          selectedMetrics[2] === 'ordersPerUnit' && 'border-yellow-500'
        )}
      />

      <Impressions
        loading={loading}
        showLoading={true}
        value={performance.current.data.impressions}
        previousValue={performance.previous.data.impressions}
        onClick={() => onSelectMetric('impressions')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('impressions') && 'border-t-2',
          selectedMetrics[0] === 'impressions' && 'border-blue-500',
          selectedMetrics[1] === 'impressions' && 'border-green-500',
          selectedMetrics[2] === 'impressions' && 'border-yellow-500'
        )}
      />

      <CostPerConversion
        loading={loading}
        showLoading={true}
        value={performance.current.data.cpcon}
        previousValue={performance.previous.data.cpcon}
        cost={performance.current.data.cost}
        orders={performance.current.data.orders}
        onClick={() => onSelectMetric('cpcon')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('cpcon') && 'border-t-2',
          selectedMetrics[0] === 'cpcon' && 'border-blue-500',
          selectedMetrics[1] === 'cpcon' && 'border-green-500',
          selectedMetrics[2] === 'cpcon' && 'border-yellow-500'
        )}
      />

      <ACoS
        loading={loading}
        showLoading={true}
        value={performance.current.data.acos}
        previousValue={performance.previous.data.acos}
        cost={performance.current.data.cost}
        sales={performance.current.data.sales}
        onClick={() => onSelectMetric('acos')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('acos') && 'border-t-2',
          selectedMetrics[0] === 'acos' && 'border-blue-500',
          selectedMetrics[1] === 'acos' && 'border-green-500',
          selectedMetrics[2] === 'acos' && 'border-yellow-500'
        )}
      />

      <ClickThroughRate
        loading={loading}
        showLoading={true}
        value={performance.current.data.ctr}
        previousValue={performance.previous.data.ctr}
        clicks={performance.current.data.clicks}
        impressions={performance.current.data.impressions}
        onClick={() => onSelectMetric('ctr')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('ctr') && 'border-t-2',
          selectedMetrics[0] === 'ctr' && 'border-blue-500',
          selectedMetrics[1] === 'ctr' && 'border-green-500',
          selectedMetrics[2] === 'ctr' && 'border-yellow-500'
        )}
      />

      <ConversionRate
        loading={loading}
        showLoading={true}
        value={performance.current.data.cr}
        previousValue={performance.previous.data.cr}
        orders={performance.current.data.orders}
        clicks={performance.current.data.clicks}
        onClick={() => onSelectMetric('cr')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('cr') && 'border-t-2',
          selectedMetrics[0] === 'cr' && 'border-blue-500',
          selectedMetrics[1] === 'cr' && 'border-green-500',
          selectedMetrics[2] === 'cr' && 'border-yellow-500'
        )}
      />

      <CostPerClick
        loading={loading}
        showLoading={true}
        value={performance.current.data.cpc}
        previousValue={performance.previous.data.cpc}
        cost={performance.current.data.cost}
        clicks={performance.current.data.clicks}
        onClick={() => onSelectMetric('cpc')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('cpc') && 'border-t-2',
          selectedMetrics[0] === 'cpc' && 'border-blue-500',
          selectedMetrics[1] === 'cpc' && 'border-green-500',
          selectedMetrics[2] === 'cpc' && 'border-yellow-500'
        )}
      />

      <RoAS
        loading={loading}
        showLoading={true}
        value={performance.current.data.roas}
        previousValue={performance.previous.data.roas}
        sales={performance.current.data.sales}
        cost={performance.current.data.cost}
        onClick={() => onSelectMetric('roas')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('roas') && 'border-t-2',
          selectedMetrics[0] === 'roas' && 'border-blue-500',
          selectedMetrics[1] === 'roas' && 'border-green-500',
          selectedMetrics[2] === 'roas' && 'border-yellow-500'
        )}
      />

      <AverageOrderValue
        loading={loading}
        showLoading={true}
        value={performance.current.data.aov}
        previousValue={performance.previous.data.aov}
        cost={performance.current.data.cost}
        orders={performance.current.data.orders}
        onClick={() => onSelectMetric('aov')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('aov') && 'border-t-2',
          selectedMetrics[0] === 'aov' && 'border-blue-500',
          selectedMetrics[1] === 'aov' && 'border-green-500',
          selectedMetrics[2] === 'aov' && 'border-yellow-500'
        )}
      />

      <TotalSales
        loading={loading}
        showLoading={true}
        value={performance.current.data.revenue}
        previousValue={performance.previous.data.revenue}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('revenue') && 'border-t-2',
          selectedMetrics[0] === 'revenue' && 'border-blue-500',
          selectedMetrics[1] === 'revenue' && 'border-green-500',
          selectedMetrics[2] === 'revenue' && 'border-yellow-500'
        )}
      />

      <TACoS
        loading={loading}
        showLoading={true}
        value={performance.current.data.tacos}
        previousValue={performance.previous.data.tacos}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('tacos') && 'border-t-2',
          selectedMetrics[0] === 'tacos' && 'border-blue-500',
          selectedMetrics[1] === 'tacos' && 'border-green-500',
          selectedMetrics[2] === 'tacos' && 'border-yellow-500'
        )}
      />

      <AdSales
        loading={loading}
        showLoading={true}
        value={performance.current.data.sales}
        previousValue={performance.previous.data.sales}
        onClick={() => onSelectMetric('sales')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('sales') && 'border-t-2',
          selectedMetrics[0] === 'sales' && 'border-blue-500',
          selectedMetrics[1] === 'sales' && 'border-green-500',
          selectedMetrics[2] === 'sales' && 'border-yellow-500'
        )}
      />

      <AdSpend
        loading={loading}
        showLoading={true}
        value={performance.current.data.cost}
        previousValue={performance.previous.data.cost}
        onClick={() => onSelectMetric('cost')}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('cost') && 'border-t-2',
          selectedMetrics[0] === 'cost' && 'border-blue-500',
          selectedMetrics[1] === 'cost' && 'border-green-500',
          selectedMetrics[2] === 'cost' && 'border-yellow-500'
        )}
      />

      <Clicks
        loading={loading}
        showLoading={true}
        value={performance.current.data.clicks}
        previousValue={performance.previous.data.clicks}
        className={classNames(
          'shadow cursor-pointer',
          selectedMetrics.includes('clicks') && 'border-t-2',
          selectedMetrics[0] === 'clicks' && 'border-blue-500',
          selectedMetrics[1] === 'clicks' && 'border-green-500',
          selectedMetrics[2] === 'clicks' && 'border-yellow-500'
        )}
      />
    </div>
  );
};

export default OverallPerformance;
