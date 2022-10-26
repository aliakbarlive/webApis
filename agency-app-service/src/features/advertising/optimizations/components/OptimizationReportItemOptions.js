import { useState } from 'react';

import UpdateStatus from './actions/UpdateStatus';
import UpdateKeywordBid from './actions/UpdateKeywordBid';
import UpdateCampaignBudget from './actions/UpdateCampaignBudget';
import ConvertAsNegativeKeyword from './actions/ConvertAsNegativeKeyword';
import ConvertAsKeywordToNewAdGroup from './actions/ConvertAsKeywordToNewAdGroup';
import ConvertAsNewKeywordToExistingAdGroup from './actions/ConvertAsNewKeywordToExistingAdGroup';

import {
  SP_KEYWORDS_UPDATE_BID,
  SP_KEYWORDS_UPDATE_STATUS,
  SP_CAMPAIGNS_UPDATE_BUDGET,
  SP_CAMPAIGNS_UPDATE_STATUS,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP,
} from 'features/advertising/utils/constants';

const OptimizationReportItemOptions = ({
  accountId,
  marketplace,
  item,
  options,
}) => {
  const ActionComponents = {
    [SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD]: ConvertAsNegativeKeyword,
    [SP_CAMPAIGNS_UPDATE_STATUS]: UpdateStatus,
    [SP_KEYWORDS_UPDATE_STATUS]: UpdateStatus,
    [SP_CAMPAIGNS_UPDATE_BUDGET]: UpdateCampaignBudget,
    [SP_KEYWORDS_UPDATE_BID]: UpdateKeywordBid,
    [SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP]:
      ConvertAsNewKeywordToExistingAdGroup,
    [SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP]:
      ConvertAsKeywordToNewAdGroup,
  };

  const [optionsSelections, setOptionsSelection] = useState(
    options.map((option) => {
      return {
        advOptimizationReportItemOptionId:
          option.advOptimizationReportItemOptionId,
        selected: option.selected,
      };
    })
  );

  const onUpdate = (optionId, selected) => {
    let optionsSelectionCopy = selected
      ? [...optionsSelections].map((os) => {
          os.selected = false;
          return os;
        })
      : [...optionsSelections];

    const index = optionsSelectionCopy.findIndex(
      (os) => os.advOptimizationReportItemOptionId === optionId
    );

    optionsSelectionCopy[index].selected = selected;
    setOptionsSelection(optionsSelectionCopy);
  };

  return options.map((option) => {
    const ActionComponent = ActionComponents[option.rule.action.code];
    const optionSelection = optionsSelections.find(
      (os) =>
        os.advOptimizationReportItemOptionId ===
        option.advOptimizationReportItemOptionId
    );

    return ActionComponent ? (
      <ActionComponent
        accountId={accountId}
        marketplace={marketplace}
        option={option}
        item={item}
        key={option.advOptimizationReportItemOptionId}
        checked={optionSelection.selected}
        onUpdate={onUpdate}
      />
    ) : (
      option.rule.action.code
    );
  });
};

export default OptimizationReportItemOptions;
