import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const OverallMonthlyStats = ({ data }) => {
  const cpuKpis = [
    { key: 'cpm', label: 'CPM', formatter: currencyFormatter },
    {
      key: 'impressionsPerClick',
      label: 'Impressions Per Click',
      formatter: currencyFormatter,
    },
    {
      key: 'clicksPerOrder',
      label: 'Clicks Per Conversion',
      formatter: currencyFormatter,
    },
    {
      key: 'cpc',
      label: 'Cost Per Conversion',
      formatter: currencyFormatter,
    },
  ];

  const traditionalKpis = [
    { key: 'roas', label: 'ROAS', formatter: numberFormatter },
    {
      key: 'cpc',
      label: 'Impressions Per Click',
      formatter: currencyFormatter,
    },
    {
      key: 'cr',
      label: 'Conversion Rate',
      formatter: percentageFormatter,
    },
    {
      key: 'aov',
      label: 'Average Order Value',
      formatter: currencyFormatter,
    },
  ];

  return (
    <div className="px-6">
      <div className="mt-4">
        <p className="text-center text-lg font-bold text-black font-body mb-1">
          Cost Per Converted Unit Decomposition
        </p>
        <div className="grid grid-cols-4 gap-4 mx-4">
          {cpuKpis.map((kpi) => {
            const currentValue = data.current.data[kpi.key];
            const previousValue = data.previous.data[kpi.key];
            let Icon = null;
            let percentage = 0;
            let infoColor = 'green';

            if (currentValue !== previousValue && previousValue) {
              Icon =
                currentValue > previousValue
                  ? ArrowNarrowUpIcon
                  : ArrowNarrowDownIcon;

              const lessRef =
                kpi.key === 'acos' ||
                kpi.key === 'cpc' ||
                kpi.key === 'cost' ||
                kpi.key === 'tacos'
                  ? currentValue
                  : previousValue;
              const greaterRef =
                kpi.key === 'acos' ||
                kpi.key === 'cpc' ||
                kpi.key === 'cost' ||
                kpi.key === 'tacos'
                  ? previousValue
                  : currentValue;

              infoColor = lessRef < greaterRef ? 'green' : 'red';
              percentage =
                (currentValue - previousValue) / Math.abs(previousValue);
            }

            return (
              <div
                key={kpi.key}
                className="w-full flex flex-col bg-white rounded-md py-5 my-4 shadow-md text-center"
              >
                <p className="text-gray-500 text-xs mb-1">{kpi.label}</p>
                <p className="my-1 text-black font-bold text-xl font-body">
                  {kpi.formatter(data.current.data[kpi.key])}
                </p>
                <div className="flex justify-center items-center mt-1">
                  <Icon className={`text-${infoColor}-800 h-4 w-4`} />
                  <p className={`text-xs text-${infoColor}-800 ml-1`}>
                    {percentageFormatter(percentage)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-lg font-bold text-black font-body text-center">
          Traditional KPIs
        </p>
        <div className="grid grid-cols-4 gap-4 mx-4">
          {traditionalKpis.map((kpi) => {
            const currentValue = data.current.data[kpi.key];
            const previousValue = data.previous.data[kpi.key];
            let Icon = null;
            let percentage = 0;
            let infoColor = 'green';

            if (currentValue !== previousValue && previousValue) {
              Icon =
                currentValue > previousValue
                  ? ArrowNarrowUpIcon
                  : ArrowNarrowDownIcon;

              const lessRef =
                kpi.key === 'acos' ||
                kpi.key === 'cpc' ||
                kpi.key === 'cost' ||
                kpi.key === 'tacos'
                  ? currentValue
                  : previousValue;
              const greaterRef =
                kpi.key === 'acos' ||
                kpi.key === 'cpc' ||
                kpi.key === 'cost' ||
                kpi.key === 'tacos'
                  ? previousValue
                  : currentValue;

              infoColor = lessRef < greaterRef ? 'green' : 'red';
              percentage =
                (currentValue - previousValue) / Math.abs(previousValue);
            }

            return (
              <div
                key={kpi.key}
                className="flex flex-col bg-white w-full rounded-md py-5 my-4 shadow-md text-center"
              >
                <p className="text-gray-500 text-xs mb-1">{kpi.label}</p>
                <p className="my-1 text-black font-bold text-xl font-body">
                  {kpi.formatter(data.current.data[kpi.key])}
                </p>
                <div className="flex justify-center items-center mt-1">
                  <Icon className={`text-${infoColor}-800 h-4 w-4`} />
                  <p className={`text-xs text-${infoColor}-800 ml-1`}>
                    {percentageFormatter(percentage)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverallMonthlyStats;
