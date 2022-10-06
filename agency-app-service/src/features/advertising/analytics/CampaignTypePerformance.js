import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
} from '@heroicons/react/outline';

import { currencyFormatter, percentageFormatter } from 'utils/formatters';

import AnalyticsCard from './AnalyticsCard';

const CampaignTypePerformance = ({
  accountId,
  marketplace,
  startDate,
  endDate,
  attributes,
  title,
  campaignType,
}) => {
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState({
    previous: { data: {}, dateRange: {} },
    current: { data: {}, dateRange: {} },
  });

  const stats = [
    {
      key: 'sales',
      name: 'Ad Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'cost',
      name: 'Ad Spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'acos',
      name: 'ACoS',
      formatter: (value) => percentageFormatter(value),
    },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get('/advertising/analytics/performance', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
          attributes,
          campaignType,
        },
      })
      .then((response) => setPerformance(response.data.data))
      .finally(() => setLoading(false));
  }, [accountId, marketplace, startDate, attributes, campaignType, endDate]);

  return (
    <div className="px-2 pt-6 bg-white shadow rounded-lg">
      <div className="text-sm font-medium text-gray-700 text-center">
        {title}
      </div>

      <div className="grid gap-4 grid-cols-3 mt-2">
        {stats.map((stat) => {
          const currentValue = performance.current.data[stat.key];
          const previousValue = performance.previous.data[stat.key];
          let icon = null;
          let percentage = 0;
          let infoColor = 'green';

          if (currentValue !== previousValue && previousValue) {
            icon =
              currentValue > previousValue
                ? ArrowNarrowUpIcon
                : ArrowNarrowDownIcon;

            const lessRef =
              stat.key === 'acos' ||
              stat.key === 'cpc' ||
              stat.key === 'cost' ||
              stat.key === 'tacos'
                ? currentValue
                : previousValue;
            const greaterRef =
              stat.key === 'acos' ||
              stat.key === 'cpc' ||
              stat.key === 'cost' ||
              stat.key === 'tacos'
                ? previousValue
                : currentValue;

            infoColor = lessRef < greaterRef ? 'green' : 'red';
            percentage =
              (currentValue - previousValue) / Math.abs(previousValue);
          }

          return (
            <AnalyticsCard
              Icon={icon}
              key={stat.key}
              title={stat.name}
              loading={loading}
              percentage={percentage}
              infoColor={infoColor}
              currentValue={stat.formatter(currentValue)}
              previousValue={stat.formatter(previousValue)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CampaignTypePerformance;
