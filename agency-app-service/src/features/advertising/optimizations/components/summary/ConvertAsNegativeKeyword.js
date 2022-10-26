import { startCase } from 'lodash';

import KeywordPreview from 'features/advertising/keywords/components/KeywordPreview';
import TargetPreview from 'features/advertising/targets/components/TargetPreview';

import { currencyFormatter } from 'utils/formatters';

const ConvertAsNegativeKeyword = ({ items }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Search Term
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Target
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Convert as
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item.advOptimizationReportItemId}>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {item.values.query}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
              {item.values.target === 'keyword' ? (
                <KeywordPreview
                  adGroupId={item.values.advAdGroupId}
                  adGroupName={item.values.AdvAdGroup.name}
                  campaignName={item.values.AdvCampaign.name}
                  keywordId={item.values.AdvKeyword.advKeywordId}
                  keywordText={item.values.AdvKeyword.keywordText}
                  matchType={item.values.AdvKeyword.matchType}
                  bid={currencyFormatter(item.values.AdvKeyword.bid)}
                  showProducts={false}
                />
              ) : (
                <TargetPreview
                  adGroupName={item.values.AdvAdGroup.name}
                  campaignName={item.values.AdvCampaign.name}
                  targetingText={item.values.AdvTarget.targetingText}
                />
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
              {startCase(item.selectedOption.rule.actionData.matchType)} in{' '}
              {startCase(
                item.selectedOption.rule.actionData.level.slice(0, -1)
              )}{' '}
              level
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ConvertAsNegativeKeyword;
