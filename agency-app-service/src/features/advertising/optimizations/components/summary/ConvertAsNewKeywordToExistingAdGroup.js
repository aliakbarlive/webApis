import { useSelector } from 'react-redux';

import {
  selectAdGroups,
  selectCampaigns,
} from 'features/advertising/advertisingSlice';

import KeywordPreview from 'features/advertising/keywords/components/KeywordPreview';
import TargetPreview from 'features/advertising/targets/components/TargetPreview';

import { currencyFormatter } from 'utils/formatters';

const ConvertAsNewKeywordToExistingAdGroup = ({ items }) => {
  const adGroups = useSelector(selectAdGroups);
  const campaigns = useSelector(selectCampaigns);

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
            Add as new Keyword to
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item, index) => {
          const campaign = campaigns.rows.find(
            (c) =>
              c.advCampaignId.toString() ===
              item.selectedOption.data.campaignId.toString()
          );

          const adGroup = adGroups.rows.find(
            (a) =>
              a.advAdGroupId.toString() ===
              item.selectedOption.data.adGroupId.toString()
          );

          return (
            <tr key={index}>
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
                <KeywordPreview
                  adGroupName={adGroup ? adGroup.name : ''}
                  campaignName={campaign ? campaign.name : ''}
                  keywordText={item.values.query}
                  matchType={item.selectedOption.data.matchType}
                  bid={currencyFormatter(item.selectedOption.data.bid)}
                  showProducts={false}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ConvertAsNewKeywordToExistingAdGroup;
