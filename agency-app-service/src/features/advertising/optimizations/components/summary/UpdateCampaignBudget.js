import { currencyFormatter } from 'utils/formatters';

const UpdateCampaignBudget = ({ items }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Campaign
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Current Daily Budget
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Target Daily Budget
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item.advOptimizationReportItemId}>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
              <div className="flex flex-col">
                <span className="font-medium">{item.values.name}</span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {currencyFormatter(item.values.dailyBudget)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {currencyFormatter(item.selectedOption.data.dailyBudget)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UpdateCampaignBudget;
