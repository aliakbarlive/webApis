import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import { currencyFormatter, percentageFormatter } from 'utils/formatters';

const NonConvertersKPIsChart = ({ data }) => {
  const bars = [
    { key: 'CONVERTERS', fill: '#00966D' },
    { key: 'NON-CONVERTERS', fill: '#C30000' },
    { key: 'ALL', fill: '#949494' },
  ];

  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-16">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Effects of Non-Converters on KPIs
        </p>
        <div className="flex">
          {bars.map((bar) => (
            <div className="flex items-center" key={`${bar.key}-label`}>
              <div
                className="w-5 h-5"
                style={{ backgroundColor: bar.fill }}
              ></div>
              <span
                className="ml-1 mr-4 font-medium text-xs"
                style={{ color: bar.fill }}
              >
                {bar.key}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2">
        {[
          { key: 'cpm', label: 'CPM', formatter: currencyFormatter },
          {
            key: 'ctr',
            label: 'Click-through rate',
            formatter: percentageFormatter,
          },
          {
            key: 'cr',
            label: 'Conversion rate',
            formatter: percentageFormatter,
          },
          {
            key: 'cpcon',
            label: 'Cost per conversion',
            formatter: currencyFormatter,
          },
        ].map((stat) => {
          return (
            <div key={stat.key}>
              <div className="text-xs xl:text-sm text-gray-700 font-medium">
                {stat.label}
              </div>
              <div className="h-48">
                <ResponsiveContainer>
                  <BarChart
                    barGap={20}
                    layout="vertical"
                    data={[
                      {
                        name: 'Keywords',
                        CONVERTERS: data[0][stat.key],
                        'NON-CONVERTERS': data[1][stat.key],
                        ALL: data[2][stat.key],
                      },
                    ]}
                    margin={{
                      left: -40,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />

                    <XAxis type="number" tick={false} />

                    <YAxis
                      dataKey="name"
                      type="category"
                      scale="band"
                      tick={false}
                    />

                    <Tooltip />

                    {bars.map((bar) => (
                      <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        barSize={30}
                        fill={bar.fill}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey={bar.key}
                          position="middle"
                          formatter={(value) => stat.formatter(value)}
                          fill="#ffffff"
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NonConvertersKPIsChart;
