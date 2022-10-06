import KeywordPreview from 'features/advertising/keywords/components/KeywordPreview';
import { currencyFormatter } from 'utils/formatters';

const UpdateKeywordBid = ({ items }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Keyword
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Current BID
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Target Bid
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item.advOptimizationReportItemId}>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
              <KeywordPreview
                keywordText={item.values.keywordText}
                matchType={item.values.matchType}
                campaignName={item.values.AdvAdGroup.AdvCampaign.name}
                adGroupName={item.values.AdvAdGroup.name}
                showProducts={false}
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {currencyFormatter(item.values.bid)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {currencyFormatter(item.selectedOption.data.bid)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UpdateKeywordBid;
