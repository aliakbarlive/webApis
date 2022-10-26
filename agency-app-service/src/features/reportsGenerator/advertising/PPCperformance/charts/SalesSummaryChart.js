import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { currencyFormatter } from 'utils/formatters';

const SalesSummaryChart = ({ data }) => {
  const bars = [
    { key: 'sales', display: 'Sales', color: '#00966D' },
    { key: 'cost', display: 'Spend', color: '#C30000' },
    { key: 'profit', display: 'Net Sales', color: '#949494' },
  ];

  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-16">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Sales Summary
        </p>
        <div className="flex">
          {bars.map((bar) => (
            <div className="flex items-center" key={`${bar.key}-label`}>
              <div
                className="w-5 h-5"
                style={{ backgroundColor: bar.color }}
              ></div>
              <span
                className="ml-1 mr-4 font-medium text-xs"
                style={{ color: bar.color }}
              >
                {bar.display}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="gap-8 grid grid-cols-2">
        {['totalSummary', 'perUnitSummary'].map((key) => {
          return (
            <div className="h-96" key={key}>
              <div className="mb-4 text-gray-600 font-bold text-sm">
                {key === 'totalSummary' ? 'Total' : 'Per Unit'}
              </div>
              <ResponsiveContainer height="100%">
                <BarChart
                  data={[{ ...data[key], cost: data[key].cost * -1 }]}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3" vertical={false} />

                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => currencyFormatter(value)}
                    style={{ fontSize: '0.6rem' }}
                  />

                  {bars.map((bar) => (
                    <Bar
                      key={`${bar.key}-bar`}
                      dataKey={bar.key}
                      fill={bar.color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesSummaryChart;
