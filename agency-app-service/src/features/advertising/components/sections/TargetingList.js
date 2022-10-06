import { currencyFormatter, numberFormatter } from 'utils/formatters';
import classNames from 'utils/classNames';

const TargetingList = ({ rows = [], bgColor }) => {
  const columns = [
    { key: 'value', display: 'Keywords' },
    {
      key: 'roas',
      display: 'RoAS',
      formatter: (value) => `${value}X`,
    },
    {
      key: 'cost',
      display: 'Ad spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'orders',
      display: 'Orders',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'impressions',
      display: 'Impressions',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'cpcon',
      display: 'Cost per conversion',
      formatter: (value) => currencyFormatter(value),
    },
  ];

  return (
    <table className="divide-y divide-gray-300 w-full table-fixed">
      <thead className={`${bgColor} py-2`}>
        <tr className="">
          {columns.map((col, index) => (
            <th
              key={col.key}
              colSpan={index ? 1 : 2}
              scope="col"
              className={classNames(
                'py-2 px-2 text-xs font-medium text-white border border-gray-200',
                index ? 'text-right' : 'text-left'
              )}
            >
              {col.display}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="">
        {rows.length ? (
          rows.map((record) => {
            return (
              <tr key={record.advTargetingId}>
                {columns.map((col, index) => (
                  <td
                    colSpan={index ? 1 : 2}
                    key={`${record.advTargetingId}-${col.key}`}
                    className={classNames(
                      'p-2 text-xs text-gray-500 sm:pr-6 xs:pr-8 border border-gray-200',
                      index ? 'text-right' : 'text-left'
                    )}
                  >
                    {col.formatter
                      ? col.formatter(record[col.key])
                      : record[col.key]}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan="7"
              className="p-2 text-xs text-gray-500 sm:pr-6 xs:pr-8 border border-gray-200 text-center"
            >
              No records to display
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TargetingList;
