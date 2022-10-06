import axios from 'axios';
import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';

import {
  selectDisplayCampaignTypeChart,
  setDisplayCampaignTypeChart,
} from '../advertisingSlice';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

import classNames from 'utils/classNames';

const CampaignTypePerformanceBreakdown = ({
  accountId,
  marketplace,
  startDate,
  endDate,
  attributes,
}) => {
  const dispatch = useDispatch();
  const displayChart = useSelector(selectDisplayCampaignTypeChart);

  const [loading, setLoading] = useState(true);

  const setDisplayChart = (bool) => {
    dispatch(setDisplayCampaignTypeChart(bool));
  };

  const [breakdowns, setBreakdowns] = useState([
    {
      title: 'Sponsored Products',
    },
    {
      title: 'Sponsored Brands',
    },
    {
      title: 'Sponsored Brands Video',
    },
    {
      title: 'Sponsored Display',
    },
    {
      title: 'Total',
    },
  ]);

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
      selectable: true,
    },
  ];

  const COLORS = ['#F84D67', '#FFDB6C', '#82ca9d', '#8884d8'];

  useEffect(() => {
    setLoading(true);
    axios
      .get('/ppc/analytics/campaign-types/performance', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
          attributes,
        },
      })
      .then((response) => {
        setBreakdowns(response.data.data);
      })
      .finally(() => setLoading(false));
  }, [accountId, marketplace, startDate, endDate, attributes]);

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
    <div className="my-8 border border-gray-300 bg-white rounded-md shadow-md">
      <div id="CampaignTypePerformanceBreakdown">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-md flex justify-between">
          <p className="text-sm leading-6 font-medium text-gray-700">
            Performance Breakdown by Campaign Type
          </p>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="bg-gray-100 rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                <span className="sr-only">Open options</span>
                <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                        onClick={() => setDisplayChart(!displayChart)}
                      >
                        {displayChart ? 'Hide Charts' : 'Display Charts'}
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="flex flex-col mt-4">
          <div className="-my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="">
                    <tr className="">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-700 sm:pl-6"
                      ></th>
                      {stats.map((stat) => (
                        <th
                          key={stat.key}
                          scope="col"
                          className="px-4 py-3.5 text-left text-sm text-gray-700"
                        >
                          {stat.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {breakdowns.map((breakdown, idx) => (
                      <tr
                        key={breakdown.title}
                        className={idx % 2 === 0 ? '' : 'bg-gray-50'}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-700 sm:pl-6">
                          {breakdown.title}
                        </td>

                        {stats.map((stat) => {
                          return (
                            <td
                              key={`${stat.key}-value`}
                              className="whitespace-nowrap p-4 text-sm text-gray-500"
                            >
                              {loading ? (
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
        </div>
      </div>

      {displayChart && (
        <div
          id="campaign-type-performance-breakdown-charts"
          className="grid grid-cols-2 gap-4 mt-5 mb-8 px-8"
        >
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
            const data = breakdowns
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
                <p className="text-center text-xs font-medium">{stat.name}</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
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
                      {data.map((entry, index) => (
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
export default CampaignTypePerformanceBreakdown;
