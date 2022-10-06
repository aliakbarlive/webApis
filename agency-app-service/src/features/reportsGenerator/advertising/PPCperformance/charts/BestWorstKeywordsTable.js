import React from 'react';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const BestWorstKeywordsTable = ({ data }) => {
  const rows = [
    { name: 'Keywords', key: 'value', formatter: (value) => value, fill: 0 },
    { name: 'Spend', key: 'cost', formatter: currencyFormatter, fill: 1 },
    { name: 'Sales', key: 'sales', formatter: currencyFormatter, fill: 0 },
    {
      name: 'Impressions',
      key: 'impressions',
      formatter: numberFormatter,
      fill: 1,
    },
    { name: 'Clicks', key: 'clicks', formatter: numberFormatter, fill: 0 },
    { name: 'Orders', key: 'orders', formatter: numberFormatter, fill: 1 },
    {
      name: 'Units Sold',
      key: 'unitsSold',
      formatter: numberFormatter,
      fill: 0,
    },
    {
      name: 'Click Through Rate',
      key: 'ctr',
      formatter: percentageFormatter,
      fill: 1,
    },
    {
      name: 'Conversion Rate',
      key: 'cr',
      formatter: percentageFormatter,
      fill: 0,
    },
    { name: 'ACOS', key: 'acos', formatter: percentageFormatter, fill: 1 },
    { name: 'CPM', key: 'cpm', formatter: currencyFormatter, fill: 0 },
    {
      name: 'Cost Per Click',
      key: 'cpc',
      formatter: currencyFormatter,
      fill: 1,
    },
    {
      name: 'Cost Per Conversion',
      key: 'cpcon',
      formatter: currencyFormatter,
      fill: 0,
    },
  ];

  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <p className="text-sm xl:text-md leading-6 font-medium text-gray-700 mb-4">
        Best vs. Worst Keywords
      </p>
      <div className="grid">
        <table>
          <thead>
            <tr className="text-xs">
              <th colSpan={2}></th>
              <th className="bg-custom-success text-white py-2">Most sales</th>
              <th className="bg-custom-error text-white py-2">Most Spend</th>
              <th className="bg-custom-success text-white py-2">Lowest ACoS</th>
              <th className="bg-custom-error text-white py-2">Highest ACoS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              return (
                <tr
                  className={`${row.fill === 1 ? 'bg-gray-100' : 'bg-white'}`}
                  key={row.key}
                >
                  <td
                    colSpan={2}
                    className="whitespace-nowrap py-2 text-xs text-gray-600 pl-2 border border-slate-300 border-solid"
                  >
                    {row.name}
                  </td>
                  {data.map((d) => (
                    <td className="border border-slate-300 border-solid text-xs text-gray-500 text-right pr-4">
                      {row.formatter(d[row.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestWorstKeywordsTable;
