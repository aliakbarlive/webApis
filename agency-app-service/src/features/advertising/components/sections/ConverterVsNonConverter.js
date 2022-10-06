import React from 'react';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const ConverterVsNonConverter = ({
  data,
  showLoading = false,
  loading = false,
  className,
}) => {
  const rows = [
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
    {
      name: 'Click Through Rate',
      key: 'ctr',
      formatter: percentageFormatter,
    },
    {
      name: 'Conversion Rate',
      key: 'cr',
      formatter: percentageFormatter,
    },
    { name: 'ACOS', key: 'acos', formatter: percentageFormatter },
    { name: 'CPM', key: 'cpm', formatter: currencyFormatter },
    {
      name: 'Cost Per Click',
      key: 'cpc',
      formatter: currencyFormatter,
    },
    {
      name: 'Cost Per Conversion',
      key: 'cpcon',
      formatter: currencyFormatter,
    },
  ];

  return (
    <div
      className={`p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl ${className}`}
    >
      <p className="text-sm xl:text-md leading-6 font-medium text-gray-700 mb-4">
        Converters VS. Non-Converters
      </p>
      <div className="grid">
        <table>
          <thead>
            <tr className="text-xs">
              <th colSpan={2}></th>
              <th className="bg-custom-success text-white py-2">Converters</th>
              <th className="bg-custom-error text-white py-2">
                Non-Converters
              </th>
              <th className="bg-custom-success text-white py-2">All</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              return (
                <tr
                  className={`${index % 2 === 1 ? 'bg-gray-100' : 'bg-white'}`}
                  key={row.key}
                >
                  <td
                    colSpan={2}
                    className="whitespace-nowrap py-2 text-xs text-gray-600 pl-2 border border-slate-300 border-solid"
                  >
                    {row.name}
                  </td>
                  <td className="border border-slate-300 border-solid text-xs text-gray-500 text-right pr-4">
                    {loading && showLoading ? (
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      row.formatter(data[0][row.key])
                    )}
                  </td>
                  <td className="border border-slate-300 border-solid text-xs text-gray-500 text-right pr-4">
                    {loading && showLoading ? (
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      row.formatter(data[1][row.key])
                    )}
                  </td>
                  <td className="border border-slate-300 border-solid text-xs text-gray-500 text-right pr-4">
                    {loading && showLoading ? (
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      row.formatter(data[2][row.key])
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConverterVsNonConverter;
