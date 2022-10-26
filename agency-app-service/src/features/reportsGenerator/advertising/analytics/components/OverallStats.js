import moment from 'moment';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const OverallStats = ({ data = {} }) => {
  let overallStats = [
    {
      key: 'cost',
      name: 'Ad Spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'sales',
      name: 'Ad Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'acos',
      name: 'ACoS',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'impressions',
      name: 'Impressions',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'clicks',
      name: 'Clicks',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'ctr',
      name: 'CTR',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'cr',
      name: 'PPC CVR',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'revenue',
      name: 'Total Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'tacos',
      name: 'T.ACoS',
      formatter: (value) => percentageFormatter(value),
    },
  ];

  const getCellValue = (stat) => {
    if (stat.key == 'acos' || stat.key == 'tacos' || stat.key == 'cost') {
      return (
        <div
          className={`flex justify-between item-center ${
            data.current.data[stat.key] < data.previous.data[stat.key]
              ? 'text-custom-green'
              : data.current.data[stat.key] > data.previous.data[stat.key]
              ? 'text-custom-red'
              : 'text-black'
          }`}
        >
          {stat.formatter(data.current.data[stat.key])}
        </div>
      );
    }

    return (
      <div
        className={`
         ${
           data.current.data[stat.key] > data.previous.data[stat.key]
             ? 'text-custom-green'
             : data.current.data[stat.key] < data.previous.data[stat.key]
             ? 'text-custom-red'
             : 'text-black'
         }`}
      >
        {stat.formatter(data.current.data[stat.key])}
      </div>
    );
  };

  const getPreviousCellValue = (stat) => {
    return <div>{stat.formatter(data.previous.data[stat.key])}</div>;
  };

  return (
    <div className="font-body w-full break-after-always pagebreak h-screen">
      <div className="bg-black h-1/6 flex justify-between items-center ">
        <div>
          <p className="text-sm ml-16 font-bold text-white">
            PPC Performance Report
          </p>
          <p
            className="ml-14 font-bold text-white mt-1"
            style={{ fontSize: '34px', lineHeight: '60px' }}
          >
            Overall Performance Section
          </p>
        </div>

        <p className="text-sm mr-6 font-extrabold text-white">
          Report Date: <br /> 1st May, 2022 to <br /> 31st May, 2022
        </p>
      </div>

      <div className="overflow-hidden ring-1 ring-black ring-opacity-5 h-3/6 w-11/12 mx-auto mt-20 ">
        <table className="min-w-full min-h-full divide-y divide-gray-300 text-xs">
          <thead className="bg-black">
            <tr className="divide-x divide-gray-200">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center text-white font-bold"
              >
                Time Period
              </th>
              {overallStats.map((stat) => (
                <th
                  key={`header-${stat.key}`}
                  scope="col"
                  className="px-4 py-3.5 text-center text-white font-bold"
                >
                  {stat.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="divide-x divide-gray-200">
              <td className="whitespace-nowrap text-center py-4 px-2 font-bold bg-custom-light-pink">
                {data.current.dateRange.startDate} to{' '}
                {data.current.dateRange.endDate}
              </td>
              {overallStats.map((stat) => (
                <td
                  key={`current-data-${stat.key}`}
                  className={`whitespace-nowrap text-center py-4 px-2 font-bold bg-custom-light-pink`}
                >
                  {getCellValue(stat)}
                </td>
              ))}
            </tr>
            <tr className="divide-x divide-gray-200">
              <td className="whitespace-nowrap text-center py-4 px-2 bg-white">
                {moment(data.previous.dateRange.startDate).format('YYYY-MM-DD')}{' '}
                to{' '}
                {moment(data.previous.dateRange.endDate).format('YYYY-MM-DD')}
              </td>
              {overallStats.map((stat) => (
                <td
                  key={`previous-data-${stat.key}`}
                  className="whitespace-nowrap text-center py-4 px-2 bg-white"
                >
                  {/* {stat.formatter(data.previous.data[stat.key])} */}
                  {getPreviousCellValue(stat)}
                </td>
              ))}
            </tr>
            <tr className="divide-x divide-gray-200">
              <td className="whitespace-nowrap text-center py-4 px-2 bg-white">
                Changes
              </td>
              {overallStats.map((stat) => {
                const currentValue = data.current.data[stat.key];
                const previousValue = data.previous.data[stat.key];

                return (
                  <td
                    key={`changes-${stat.key}`}
                    className="whitespace-nowrap text-center py-4 px-2"
                  >
                    {previousValue
                      ? percentageFormatter(
                          (currentValue - previousValue) /
                            Math.abs(previousValue)
                        )
                      : 'N/A'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverallStats;
