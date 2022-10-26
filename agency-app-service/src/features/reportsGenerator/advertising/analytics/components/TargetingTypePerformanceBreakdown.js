import { Fragment } from 'react';
import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  Label,
} from 'recharts';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';
import { useEffect } from 'react';

const TargetingTypePerformanceBreakdown = ({
  breakdowns = [],
  showChart = false,
}) => {
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

  const COLORS = ['#002f5d', '#fb426f', '#f9dc7d'];

  const renderCustomizedLabel = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, fill, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 20;
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
          x={ex + (cos >= 0 ? 1 : -1) * 3}
          y={ey}
          textAnchor={textAnchor}
          fill="#999"
          fontSize="smaller"
        >{`${(percent * 100).toFixed(2)}%`}</text>
      </g>
    );
  };

  const autoCapitalize = (title) => {
    let firstLetter = title.charAt(0).toUpperCase();
    return firstLetter + title.substring(1, title.length);
  };

  const getPercentCircle = (stat, breakdown) => {
    return (
      <div
        className="w-5 h-5 rounded-full flex justify-center items-center"
        style={{
          background:
            breakdown[stat.key] == 0
              ? '#fecaca'
              : breakdown[stat.key] == 1
              ? '#f87171'
              : `conic-gradient(#f87171 ${
                  breakdown[stat.key] * 100
                }%, #fecaca 0)`,
        }}
      >
        <div className="w-3 h-3 rounded-full bg-white"></div>
      </div>
    );
  };

  return (
    <div>
      <div className="font-body w-full break-after-always pagebreak h-screen ">
        <div className="h-1/6 flex flex-col justify-center">
          <p className="text-sm ml-16 font-extrabold">PPC Performance Report</p>
          <p
            className=" ml-14 font-extrabold mt-1"
            style={{ fontSize: '34px', lineHeight: '60px' }}
          >
            Performance Breakdown By Targeting Type
          </p>
        </div>

        <div className="overflow-hidden ring-1 ring-black ring-opacity-5 h-4/6 w-11/12 mx-auto mt-2">
          <table
            className="min-w-full h-full divide-y divide-gray-300 text-xs"
            style={{ fontSize: '12px' }}
          >
            <thead className="bg-black text-white font-bold">
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="px-4 py-3.5 text-center font-normal"
                ></th>
                {stats.map((stat) => (
                  <th
                    key={stat.key}
                    scope="col"
                    className="px-4 py-3.5 text-center"
                  >
                    {stat.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {breakdowns.map((breakdown, idx) => {
                const subs = breakdown.subBreakdown
                  ? breakdown.subBreakdown
                  : [];

                return (
                  <Fragment key={breakdown.title}>
                    <tr
                      className={
                        idx % 2 === 0
                          ? 'divide-x divide-gray-200'
                          : 'bg-gray-50 divide-x divide-gray-200'
                      }
                    >
                      <td className="whitespace-nowrap text-left py-3.5 px-2 bg-custom-pink text-white font-bold font-mono">
                        <p className="font-light">{breakdown.title}</p>
                      </td>

                      {stats.map((stat) => {
                        return (
                          <td
                            key={`${breakdown.title}-${stat.key}-value`}
                            className="whitespace-nowrap text-center py-3.5 px-2"
                          >
                            <div className="flex justify-evenly item-center">
                              <p
                              // className={`${
                              //   breakdown[stat.key] == 40.15
                              //     ? 'bg-custom-pink pr-1 pl-1 font-bold text-white'
                              //     : breakdown[stat.key] == 110.93
                              //     ? 'bg-custom-yellow pr-1 pl-1 font-bold'
                              //     : null
                              // }`}
                              >
                                {' '}
                                {stat.formatter(breakdown[stat.key])}
                              </p>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {subs.map((sub) => {
                      return (
                        <tr
                          key={sub.matchType}
                          className="divide-x divide-gray-200"
                        >
                          <td className="whitespace-nowrap text-left py-3.5 px-2 pl-6 bg-custom-pink text-white font-bold">
                            <p className="font-light">
                              -{autoCapitalize(sub.matchType)}
                            </p>
                          </td>
                          {stats.map((stat) => {
                            return (
                              <td
                                key={`${stat.key}-value`}
                                className="whitespace-nowrap text-center py-3.5 px-2"
                              >
                                <div className="flex justify-evenly item-center">
                                  {/* {stat.key == 'cr'
                                    ? getPercentCircle(stat, sub)
                                    : stat.key == 'acos'
                                    ? getPercentCircle(stat, sub)
                                    : null} */}
                                  {stat.formatter(sub[stat.key])}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="font-body w-full pagebreak break-after-always h-screen">
        <div className="h-1/6 flex flex-col justify-center">
          <p className="text-sm ml-16 font-extrabold">PPC Performance Report</p>
          <p
            className=" ml-14 font-extrabold mt-1"
            style={{ fontSize: '34px', lineHeight: '60px' }}
          >
            Performance Breakdown By Targeting Type
          </p>
        </div>

        {showChart && (
          <div
            id="targeting-type-performance-breakdown-charts"
            className="grid grid-cols-2 mt-2 h-4/6 bg-gray-100 items-center w-11/12 mx-auto"
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
                .find((b) => b.subBreakdown)
                .subBreakdown.map((b) => {
                  return {
                    name: autoCapitalize(b.matchType),
                    value: b[stat.key],
                  };
                });

              return (
                <div
                  key={`${stat.key}-campaign-type-breakdown-charts`}
                  className="w-full h-5/6 "
                >
                  <p className="-mb-8 text-center font-medium">{stat.name}</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="30%"
                        outerRadius="60%"
                        cornerRadius={999}
                        isAnimationActive={false}
                        paddingAngle={-25}
                        label={renderCustomizedLabel}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            style={{ borderRadius: '10px' }}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        layout="vertical"
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
    </div>
  );
};
export default TargetingTypePerformanceBreakdown;
