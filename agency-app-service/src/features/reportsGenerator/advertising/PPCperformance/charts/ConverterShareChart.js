import React from 'react';
import { percentageFormatter } from 'utils/formatters';

const ConverterShareChart = ({ data }) => {
  const [converters, nonConverters, all] = data;

  const stats = [
    { key: 'count', label: 'Keywords' },
    { key: 'cost', label: 'Spend' },
    { key: 'impressions', label: 'Impressions' },
    { key: 'clicks', label: 'Clicks' },
  ];

  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-16">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Converter Share
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
        {stats.map((stat) => {
          const converterPercentage = all[stat.key]
            ? converters[stat.key] / all[stat.key]
            : 0;

          const nonConverterPercentage = all[stat.key]
            ? nonConverters[stat.key] / all[stat.key]
            : 0;

          return (
            <div
              key={stat.key}
              className="grid grid-cols-12 mb-8 text-xs xl:text-sm"
            >
              <div className="col-span-3 flex items-center">
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>

              <div className="col-span-9 flex text-white text-xs">
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

export default ConverterShareChart;
