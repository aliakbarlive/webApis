import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const CampaignTypeBreakdown = ({
  data,
  loading = false,
  showLoading = false,
}) => {
  const [showChart, setShowChart] = useState(false);

  const stats = [
    {
      key: 'cost',
      name: 'Spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'clicks',
      name: 'Clicks',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'cpc',
      name: 'CPC',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'orders',
      name: 'Orders',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'sales',
      name: 'Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'cr',
      name: 'CVR',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'aov',
      name: 'AOV',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'acos',
      name: 'ACoS',
      formatter: (value) => percentageFormatter(value),
    },
  ];

  const COLORS = ['#F84D67', '#FFDB6C', '#82ca9d', '#8884d8'];

  const renderCustomizedLabel = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, fill, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 50) * cos;
    const my = cy + (outerRadius + 300) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          fontSize="smaller"
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col mt-12 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between rounded-t-xl">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Performance Breakdown by Campaign Type
        </p>

        <div className="flex items-center">
          <p className="mr-4 text-gray-700 text-sm">Display Chart</p>
          <Switch
            checked={showChart}
            onChange={setShowChart}
            className={`${
              showChart ? 'bg-red-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                showChart ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden py-4 px-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="">
                <tr className="">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-xs font-semibold text-gray-700 sm:pl-6"
                  ></th>
                  {stats.map((stat) => (
                    <th
                      key={stat.key}
                      scope="col"
                      className="px-4 py-3.5 border border-slate-50 text-left text-xs text-white bg-gray-500"
                    >
                      {stat.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {data.map((breakdown, idx) => (
                  <tr
                    key={breakdown.title}
                    className={
                      idx % 2 === 0
                        ? 'divide-x divide-gray-300 border-l border-r'
                        : 'bg-gray-100 divide-x divide-gray-300 border-l border-r'
                    }
                  >
                    <td className="border-b whitespace-nowrap py-3 pl-4 pr-4 text-xs text-gray-700 sm:pl-6">
                      {breakdown.title}
                    </td>

                    {stats.map((stat) => {
                      return (
                        <td
                          key={`${stat.key}-value`}
                          className="border-b whitespace-nowrap text-right px-4 py-3 text-xs text-gray-500"
                        >
                          {loading && showLoading ? (
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                          ) : (
                            stat.formatter(breakdown[stat.key])
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showChart && (
        <div className="grid grid-cols-2 gap-4 mt-5 mb-8 px-8">
          {[
            {
              key: 'sales',
              name: 'Sales',
            },
            {
              key: 'cost',
              name: 'Spend',
            },
          ].map((stat) => {
            const record = data
              .filter((b) => b.title !== 'Total')
              .filter((b) => b[stat.key])
              .map((b) => {
                return { name: b.title, value: b[stat.key] };
              });

            return (
              <div
                key={`${stat.key}-campaign-type-breakdown-charts`}
                className="w-full h-72"
              >
                <p className="text-center text-xs font-medium text-gray-700">
                  {stat.name}
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={record}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      fill="#82ca9d"
                      paddingAngle={1}
                      labelLine={false}
                      isAnimationActive={false}
                      label={renderCustomizedLabel}
                    >
                      {record.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignTypeBreakdown;
