import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
} from '@heroicons/react/outline';

import AnalyticsCard from 'features/advertising/analytics/AnalyticsCard';
import { currencyFormatter, percentageFormatter } from 'utils/formatters';

const CampaignTypePerformanceSummary = ({ data }) => {
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

  return (
    <div className="grid lg:grid-cols-3 gap-4 mt-12">
      {data.map((d) => (
        <div
          key={d.campaignType.title}
          className="px-2 pt-6 bg-white shadow hover:shadow-xl rounded-xl"
        >
          <div className="text-sm font-medium text-gray-700 text-center">
            {d.campaignType.title}
          </div>

          <div className="grid gap-4 grid-cols-3 mt-2">
            {stats.map((stat) => {
              const currentValue = d.current.data[stat.key];
              const previousValue = d.previous.data[stat.key];

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
                  loading={false}
                  percentage={percentage}
                  infoColor={infoColor}
                  currentValue={stat.formatter(currentValue)}
                  previousValue={stat.formatter(previousValue)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignTypePerformanceSummary;
