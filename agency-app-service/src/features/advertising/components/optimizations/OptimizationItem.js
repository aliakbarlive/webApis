import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Checkbox from 'components/Forms/Checkbox';

import {
  selectOptimizations,
  setOptimizationItem,
} from 'features/advertising/advertisingSlice';

import ActionDisplay from './actions/ActionDisplay';
import UpdateBid from './actions/UpdateBid';
import ConvertAsNewKeywordToExistingAdGroup from './actions/ConvertAsNewKeywordToExistingAdGroup';

import {
  SP_CAMPAIGNS_UPDATE_BUDGET,
  SP_KEYWORDS_UPDATE_BID,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP,
} from 'features/advertising/utils/constants';
import ConvertAsKeywordToNewAdGroup from './actions/ConvertAsKeywordToNewAdGroup';
import UpdateBudget from './actions/UpdateBudget';

const OptimizationItem = ({ keyField, item, rule, className }) => {
  const dispatch = useDispatch();
  const optimizations = useSelector(selectOptimizations);

  const [index, setIndex] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [optimization, setOptimization] = useState({ selected: false });

  useEffect(() => {
    const index = optimizations.findIndex(
      (opt) =>
        opt.optimizableId === item[keyField] && opt.ruleId === rule.advRuleId
    );

    setIndex(index);
    setOptimization(optimizations[index]);
  }, [dispatch, item, optimizations, keyField, rule.advRuleId]);

  const onChange = (key, data) => {
    dispatch(
      setOptimizationItem({
        index,
        value: { ...optimization, [key]: data },
      })
    );
  };

  const onChangeSelection = (e) => {
    const { checked } = e.target;
    if (
      checked &&
      (rule.action.code ===
        SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP ||
        rule.action.code ===
          SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP)
    ) {
      setShowOptions(true);
    }

    onChange('selected', checked);
  };

  return (
    <div className={`flex items-center pb-2 ${className}`}>
      <Checkbox
        checked={optimization.selected}
        onChange={onChangeSelection}
        className="mr-2"
      />
      {'data' in optimization && (
        <div className="flex-col flex">
          <span className="font-medium text-xs text-gray-500">{rule.name}</span>

          <ActionDisplay action={rule.action} options={rule.actionData} />

          {rule.action.code ===
            SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP && (
            <ConvertAsNewKeywordToExistingAdGroup
              item={item}
              open={showOptions}
              setOpen={setShowOptions}
              optimization={optimization}
              onChangeData={(data) => onChange('data', data)}
              onCancel={() => onChange('selected', false)}
            />
          )}

          {rule.action.code ===
            SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP && (
            <ConvertAsKeywordToNewAdGroup
              item={item}
              open={showOptions}
              setOpen={setShowOptions}
              optimization={optimization}
              onChangeData={(data) => onChange('data', data)}
              onCancel={() => onChange('selected', false)}
            />
          )}

          {rule.action.code === SP_KEYWORDS_UPDATE_BID && (
            <UpdateBid
              item={item}
              optimization={optimization}
              onChangeData={(data) => onChange('data', data)}
            />
          )}

          {rule.action.code === SP_CAMPAIGNS_UPDATE_BUDGET && (
            <UpdateBudget
              item={item}
              optimization={optimization}
              onChangeData={(data) => onChange('data', data)}
              attribute="dailyBudget"
            />
          )}
        </div>
      )}
    </div>
  );
};
export default OptimizationItem;
