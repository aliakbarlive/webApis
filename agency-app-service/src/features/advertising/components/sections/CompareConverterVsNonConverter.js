import { useState } from 'react';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const CompareConverterVsNonConverter = ({ data }) => {
  const [converters, nonConverters, all] = data;
  const [selectedMetrics, setSelectedMetrics] = useState(['count', 'cost']);

  const metrics = [
    { name: 'Keywords', key: 'count', formatter: numberFormatter },
    { name: 'Spend', key: 'cost', formatter: currencyFormatter },
    { name: 'Sales', key: 'sales', formatter: currencyFormatter },
    {
      name: 'Impressions',
      key: 'impressions',
      formatter: numberFormatter,
    },
    { name: 'Clicks', key: 'clicks', formatter: numberFormatter },
    { name: 'Orders', key: 'orders', formatter: numberFormatter },
    {
      name: 'Units Sold',
      key: 'unitsSold',
      formatter: numberFormatter,
    },
  ];

  const onChangeSelectedMetric = (e) => {
    const { id, value } = e.target;
    let newSelectedMetrics = [...selectedMetrics];
    newSelectedMetrics[id] = value;

    setSelectedMetrics(newSelectedMetrics);
  };

  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-16">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Compare Converters vs. Non Converters
        </p>
        <div className="flex">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-custom-success"></div>
            <span className="ml-1 mr-4 font-medium text-xs text-custom-success">
              CONVERTERS
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-custom-error"></div>
            <span className="ml-1 mr-4 font-medium text-xs text-custom-error">
              NON-CONVERTERS
            </span>
          </div>
        </div>
      </div>

      <div className="">
        {selectedMetrics.map((metric, index) => {
          const stat = metrics.find((m) => m.key === metric);

          const converterPercentage = all[stat.key]
            ? converters[stat.key] / all[stat.key]
            : 0;

          const nonConverterPercentage = all[stat.key]
            ? nonConverters[stat.key] / all[stat.key]
            : 0;

          return (
            <div key={stat.key} className="mb-12 text-xs px-6">
              <div className="flex justify-between text-center">
                <select
                  id={index}
                  value={selectedMetrics[index]}
                  onChange={onChangeSelectedMetric}
                  className="mb-3 mx-auto bg-gray-50 border-none rounded-lg text-gray-700 px-6 py-3 focus:border-none"
                >
                  {metrics
                    .filter((m) =>
                      index
                        ? m.key !== selectedMetrics[0]
                        : m.key !== selectedMetrics[1]
                    )
                    .map((m) => (
                      <option value={m.key} key={`options-${index}-${m.key}`}>
                        {m.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex text-white text-xs">
                <div
                  style={{ width: `${converterPercentage * 100}%` }}
                  className="bg-custom-success py-6 text-center"
                >
                  {percentageFormatter(converterPercentage)}
                </div>
                <div
                  className="bg-custom-error py-6 text-center"
                  style={{ width: `${nonConverterPercentage * 100}%` }}
                >
                  {percentageFormatter(nonConverterPercentage)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompareConverterVsNonConverter;
