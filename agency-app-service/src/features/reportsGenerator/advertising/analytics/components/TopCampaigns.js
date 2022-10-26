import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const TopCampaigns = ({ campaigns = [] }) => {
  const KpiDifference = ({ campaign, dataKey }) => {
    const currentValue = campaign[dataKey];
    const previousValue = campaign.previousData[dataKey];
    let Icon = ChevronUpIcon;
    let percentage = 0;
    let infoColor = 'green';

    if (currentValue !== previousValue && previousValue) {
      Icon = currentValue > previousValue ? ChevronUpIcon : ChevronDownIcon;

      const lessRef =
        dataKey === 'acos' ||
        dataKey === 'cpc' ||
        dataKey === 'cost' ||
        dataKey === 'tacos'
          ? currentValue
          : previousValue;

      const greaterRef =
        dataKey === 'acos' ||
        dataKey === 'cpc' ||
        dataKey === 'cost' ||
        dataKey === 'tacos'
          ? previousValue
          : currentValue;

      infoColor = lessRef < greaterRef ? 'green' : 'red';
      percentage = (currentValue - previousValue) / Math.abs(previousValue);
    }

    return (
      <div className="flex justify-center items-center mt-1">
        <Icon className={`text-${infoColor}-800 h-2 w-2`} />
        <p className={`text-xs text-${infoColor}-800 ml-1`}>
          {percentageFormatter(percentage)}
        </p>
      </div>
    );
  };

  return (
    <div className="my-6 mx-auto px-8 font-body">
      <div className="flex justify-between items-center my-2">
        <p className="text-xl font-bold text-black font-body">Top Campaigns</p>
        <p className="text-sm font-normal text-gray-500 font-body">
          Spend, Sales, ACOS and Orders
        </p>
      </div>

      <div className="ring-1 ring-black ring-opacity-5 w-full">
        <table className="h-full divide-y divide-gray-30 w-full table-fixed font-body">
          <thead className="bg-gray-100">
            <tr className="divide-x divide-gray-200 bg-black text-sm">
              <th
                scope="col"
                colspan="3"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Campaign
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Spend
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                %
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Sales
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                %
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                ACOS
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                %
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Orders
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs">
            {campaigns.map((campaign, index) => {
              const bgClass = index % 2 == 0 ? 'bg-gray-100' : 'bg-white';

              return (
                <tr
                  key={campaign.advCampaignId}
                  className={`divide-x divide-gray-200 ${bgClass}`}
                >
                  <td
                    colspan="3"
                    className="whitespace-nowrap py-3.5 px-2 text-xs"
                  >
                    {campaign.name && campaign.name.length > 25
                      ? `${campaign.name.substr(0, 25)}...`
                      : campaign.name}
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    {currencyFormatter(campaign.cost)}
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    <KpiDifference campaign={campaign} dataKey="cost" />
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    {currencyFormatter(campaign.sales)}
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    <KpiDifference campaign={campaign} dataKey="sales" />
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    {percentageFormatter(campaign.acos)}
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    <KpiDifference campaign={campaign} dataKey="acos" />
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    {numberFormatter(campaign.orders)}
                  </td>
                  <td className="whitespace-nowrap py-3.5 px-2 text-xs text-center">
                    <KpiDifference campaign={campaign} dataKey="orders" />
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
export default TopCampaigns;
