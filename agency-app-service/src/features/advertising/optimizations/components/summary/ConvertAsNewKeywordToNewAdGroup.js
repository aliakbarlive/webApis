import KeywordPreview from 'features/advertising/keywords/components/KeywordPreview';
import TargetPreview from 'features/advertising/targets/components/TargetPreview';

import { currencyFormatter } from 'utils/formatters';

const ConvertAsNewKeywordToNewAdGroup = ({ items }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Query
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
            Campaign Settings
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ad Group Settings
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Product Ads
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Keywords
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Negative Keywords
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            More
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item) => {
          return (
            <tr key={item.advOptimizationReportItemId}>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {item.values.query}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                {item.values.target === 'keyword' ? (
                  <KeywordPreview
                    adGroupName={item.values.AdvAdGroup.name}
                    campaignName={item.values.AdvCampaign.name}
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
                <div className="flex flex-col">
                  <span>Name: {item.selectedOption.data.campaign.name} </span>
                  <span>
                    Daily Budget:{' '}
                    {currencyFormatter(
                      item.selectedOption.data.campaign.dailyBudget
                    )}{' '}
                  </span>
                  <span>
                    Start Date: {item.selectedOption.data.campaign.startDate}
                  </span>
                  {item.selectedOption.data.campaign.endDate && (
                    <span>
                      End Date: {item.selectedOption.data.campaign.endDate}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                <div className="flex flex-col">
                  <span>Name: {item.selectedOption.data.adGroup.name} </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                <ul className="ml-4 list-disc">
                  {item.selectedOption.data.productAds.map((productAd) => {
                    return <li key={productAd.sku}> {productAd.sku}</li>;
                  })}
                </ul>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                <ul className="ml-4 list-disc">
                  {item.selectedOption.data.keywords.map(
                    (keyword, keywordIdx) => {
                      return (
                        <li key={`keyword-${keywordIdx}`}>
                          {keyword.keywordText} - {keyword.matchType} -{' '}
                          {keyword.bid}
                        </li>
                      );
                    }
                  )}
                </ul>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                <ul className="ml-4 list-disc">
                  {item.selectedOption.data.negativeKeywords.map(
                    (keyword, keywordIdx) => {
                      return (
                        <li key={`negative-keyword-${keywordIdx}`}>
                          {keyword.keywordText} - {keyword.matchType}
                        </li>
                      );
                    }
                  )}
                </ul>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                {item.selectedOption.data.convertAsNegativeKeywordOn
                  ? `Negative Exact on ${item.selectedOption.data.convertAsNegativeKeywordOn} level`
                  : ''}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ConvertAsNewKeywordToNewAdGroup;
