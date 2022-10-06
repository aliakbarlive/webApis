import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const KeywordsConversionSummary = ({
  accountId,
  marketplace,
  startDate,
  endDate,
}) => {
  const [summary, setSummary] = useState({});
  const [converters, setConverters] = useState({});
  const [charts, setCharts] = useState(['Keywords', 'Spend']);

  const [nonConverters, setNonconverters] = useState({});

  const rows = [
    { name: 'Keywords', key: 'count', formatter: numberFormatter },
    { name: 'Spend', key: 'cost', formatter: currencyFormatter },
    { name: 'Sales', key: 'sales', formatter: currencyFormatter },
    { name: 'Impressions', key: 'impressions', formatter: numberFormatter },
    { name: 'Clicks', key: 'clicks', formatter: numberFormatter },
    { name: 'Orders', key: 'orders', formatter: numberFormatter },
    { name: 'Units Sold', key: 'unitsSold', formatter: numberFormatter },
    { name: 'Click Through Rate', key: 'ctr', formatter: percentageFormatter },
    { name: 'Conversion Rate', key: 'cr', formatter: percentageFormatter },
    { name: 'ACOS', key: 'acos', formatter: percentageFormatter },
    { name: 'CPM', key: 'cpm', formatter: currencyFormatter },
    { name: 'Cost Per Click', key: 'cpc', formatter: currencyFormatter },
    { name: 'Cost Per Conversion', key: 'cpcon', formatter: currencyFormatter },
  ];

  const COLORS = ['#16a34a', '#dc2626'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + (radius - 15) * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    axios
      .get('/ppc/analytics/keyword-converters-summary', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
        },
      })
      .then((response) => {
        const [con, nonCon, all] = response.data.data;
        setSummary(all);
        setConverters(con);
        setNonconverters(nonCon);
      });
  }, [accountId, marketplace, startDate, endDate]);

  return (
    <div>
      <div className="my-8 border border-gray-300 bg-white rounded-md shadow-md">
        <div className="px-4 pt-5 border-gray-200 sm:px-6 rounded-t-md bg-custom-dark-blue">
          <p className="text-md font-medium text-white ">
            Converters VS. Non-Converters
          </p>
        </div>

        <div className="flex flex-col">
          <div className="overflow-hidden pb-5">
            <table className="min-w-full divide-y divide-gray-300">
              <thead
                className="bg-custom-dark-blue "
                style={{
                  borderSpacing: '10px 0',
                  borderCollapse: 'separate',
                }}
              >
                <tr className="">
                  <th
                    colSpan={2}
                    className=" text-left text-sm font-semibold text-gray-700 sm:pl-6"
                  ></th>
                  <th
                    scope="col"
                    className="py-2 text-center text-sm bg-custom-light-green text-green-text"
                  >
                    Converters
                  </th>
                  <th
                    scope="col"
                    className="text-center text-sm bg-custom-light-pink text-custom-pink"
                  >
                    Non-Converters
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-center font-normal text-sm text-white sm:pr-6"
                  >
                    ALL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {rows.map((row) => {
                  return (
                    <tr key={row.key}>
                      <td
                        colSpan={2}
                        className="whitespace-nowrap py-2 font-medium text-sm text-gray-700 pl-2 "
                      >
                        {row.name}
                      </td>
                      <td
                        className={`whitespace-nowrap py-2 pr-2 mr-5 text-right text-sm text-gray-700 border-custom-light-green border-r-2 border-l-2 ${
                          row.key == 'cpcon' ? 'border-b-2' : null
                        }`}
                      >
                        {row.formatter(converters[row.key])}
                      </td>
                      <td
                        className={`whitespace-nowrap py-2 pr-2 mr-5 text-right text-sm text-gray-700 border-custom-light-pink border-r-2 border-l-2 ${
                          row.key == 'cpcon' ? 'border-b-2' : null
                        }`}
                      >
                        {row.formatter(nonConverters[row.key])}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-2 text-right text-sm text-gray-700">
                        {row.formatter(summary[row.key])}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 bg-white rounded-md shadow-md">
        <div className="px-4 pt-5 border-gray-200 sm:px-6 rounded-t-md bg-custom-dark-blue w-full">
          <p className="text-md font-medium text-white self-start">
            Converters Share Of...
          </p>

          <div className="grid grid-cols-2 py-4">
            <div className="flex justify-center">
              <select
                className="text-xs text-gray-700"
                value={charts[0]}
                onChange={(e) => setCharts([e.target.value, charts[1]])}
              >
                {rows
                  .filter((row) => row.name !== charts[1])
                  .map((row) => (
                    <option key={row.key} value={row.name}>
                      {row.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-center">
              <select
                className="text-xs text-gray-700"
                value={charts[1]}
                onChange={(e) => setCharts([charts[0], e.target.value])}
              >
                {rows
                  .filter((row) => row.name !== charts[0])
                  .map((row) => (
                    <option key={row.key} value={row.name}>
                      {row.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="h-full grid grid-cols-2 gap-4 -mt-8">
          {charts.map((chart) => {
            const { key } = rows.find((row) => row.name === chart);
            const data = [
              { name: 'Converters', value: converters[key] },
              { name: 'Non-Converters', value: nonConverters[key] },
            ];

            return (
              <ResponsiveContainer height={400}>
                <PieChart>
                  <Pie
                    data={data}
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
                    layout="horizontal"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '11px',
                      paddingBottom: '2rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KeywordsConversionSummary;
