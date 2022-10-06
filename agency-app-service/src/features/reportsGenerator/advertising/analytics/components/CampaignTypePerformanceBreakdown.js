import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const CampaignTypePerformanceBreakdown = ({
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

  const setIcon = (idx) => {
    if (idx == 0) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
    } else if (idx == 1) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
      );
    } else if (idx == 2) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else if (idx == 3) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    } else {
      return null;
    }
  };

  const getFormattedTitle = (breakdown) => {
    let title = breakdown.title.split(' ');
    if (title.length > 1) {
      title[0] += '\n';
      let newTitle = title.join('');
      return newTitle;
    }
    return title[0];
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

  const COLORS = ['#002f5d', '#f9dc7d', '#fb426f'];

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

  return (
    <div className="">
      <div className="font-body w-full break-after-always pagebreak h-screen">
        <div className="h-1/6 flex flex-col justify-center">
          <p className="text-sm ml-16 font-extrabold">PPC Performance Report</p>
          <p
            className="ml-14 font-extrabold mt-1"
            style={{ fontSize: '34px', lineHeight: '60px' }}
          >
            Performance Breakdown By Campaign Type
          </p>
        </div>

        <div className="overflow-hidden ring-1 ring-black ring-opacity-5 h-4/6 w-11/12 mx-auto mt-2">
          <table
            className="min-w-full h-full divide-y divide-gray-300"
            style={{ fontSize: '12px' }}
          >
            <thead className="bg-black">
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="px-4 py-3.5 text-center font-normal"
                ></th>
                {stats.map((stat) => (
                  <th
                    key={stat.key}
                    scope="col"
                    className="px-4 py-3.5 text-center font-bold text-white"
                  >
                    {stat.name != '' ? stat.name : 'Campaign Type'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {breakdowns.map((breakdown, idx) => (
                <tr
                  key={breakdown.title}
                  className={
                    idx % 2 === 0
                      ? 'divide-x divide-gray-200'
                      : 'bg-gray-50 divide-x divide-gray-200'
                  }
                >
                  <td className="whitespace-nowrap text-center py-3.5 px-2 bg-custom-pink text-white">
                    <div className="flex justify-center items-center">
                      {setIcon(idx)}

                      <p className="ml-1">{breakdown.title}</p>
                    </div>
                  </td>

                  {stats.map((stat) => {
                    return (
                      <td
                        key={`${stat.key}-value`}
                        className="whitespace-nowrap text-center py-3.5 px-2"
                      >
                        <div className="flex justify-evenly item-center">
                          {/* {stat.key == 'cr'
                            ? getPercentCircle(stat, breakdown)
                            : stat.key == 'acos'
                            ? getPercentCircle(stat, breakdown)
                            : null} */}
                          <p
                            className={`${
                              breakdown.title == 'Total' ? 'font-bold' : null
                            }`}
                            // className={`${
                            //   breakdown[stat.key] == 1440.7
                            //     ? 'bg-custom-pink pl-1 pr-1 font-bold text-white'
                            //     : breakdown[stat.key] == 2809.26
                            //     ? 'bg-custom-yellow pl-1 pr-1 font-bold'
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="font-body w-full break-after-always pagebreak h-screen">
        <div className="h-1/6 flex flex-col justify-center">
          <p className="text-sm ml-16 font-extrabold">PPC Performance Report</p>
          <p
            className=" ml-14 font-extrabold mt-1"
            style={{ fontSize: '34px', lineHeight: '60px' }}
          >
            Campaigns Summary
          </p>
        </div>
        {showChart && (
          <div
            id="campaign-type-performance-breakdown-charts"
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
                .filter((b) => b.title !== 'Total')
                .filter((b) => b[stat.key])
                .map((b) => {
                  return { name: b.title, value: b[stat.key] };
                });

              return (
                <div
                  key={`${stat.key}-campaign-type-breakdown-charts`}
                  className="w-full h-5/6 "
                >
                  <p className="-mb-5 text-center font-bold text-lg">
                    {stat.name}
                  </p>
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
                        innerRadius="30%"
                        outerRadius="60%"
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
export default CampaignTypePerformanceBreakdown;
