import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
} from '@heroicons/react/outline';
import { currencyFormatter, percentageFormatter } from 'utils/formatters';

const MonthlyKPIs = ({ data }) => {
  const kpis = [
    { key: 'revenue', label: 'OVERALL SALES', formatter: currencyFormatter },
    { key: 'cost', label: 'PPC SPEND', formatter: currencyFormatter },
    { key: 'sales', label: 'PPC SALES', formatter: currencyFormatter },
    {
      key: 'organicSales',
      label: 'ORGANIC SALES',
      formatter: currencyFormatter,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mx-8 -mt-20">
      {kpis.map((kpi) => {
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
          percentage = (currentValue - previousValue) / Math.abs(previousValue);
        }

        return (
          <div
            key={kpi.key}
            className="flex flex-col bg-white w-full rounded-md py-5 my-4 shadow-md text-center"
          >
            <p className="mt-1 text-gray-500 text-xs">{kpi.label}</p>
            <p className="my-1 text-black font-bold text-xl">
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
  );
};

export default MonthlyKPIs;
