import { useTranslation } from 'react-i18next';
import { isObject, startCase, upperFirst } from 'lodash';

import {
  PERCENTAGE,
  SP_CAMPAIGNS_UPDATE_STATUS,
  SP_AD_GROUPS_UPDATE_STATUS,
  SP_KEYWORDS_UPDATE_STATUS,
  SP_TARGETS_UPDATE_STATUS,
  SP_KEYWORDS_UPDATE_BID,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
} from 'features/advertising/utils/constants';

const ActionDisplay = ({
  action,
  options,
  className = 'text-xs text-gray-500',
}) => {
  const { t } = useTranslation();
  let display = '';

  switch (action.code) {
    case SP_CAMPAIGNS_UPDATE_STATUS:
    case SP_AD_GROUPS_UPDATE_STATUS:
    case SP_KEYWORDS_UPDATE_STATUS:
    case SP_TARGETS_UPDATE_STATUS:
      display = `${action.name} to ${options.state}`;
      break;

    case SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD:
      let { matchType } = options;
      matchType = action.name.replace('negative', startCase(matchType));
      display = `${matchType} on ${startCase(options.level)} level`;
      break;

    case SP_KEYWORDS_UPDATE_BID:
      const valueDisplay = isObject(options.value)
        ? options.value.type === PERCENTAGE
          ? `${options.value.value}%`
          : `$${options.value.value}`
        : `$${options.value}`;

      display = `${t(
        `Advertising.Actions.UpdateBid.${upperFirst(options.type)}`
      )} ${valueDisplay}.`;
      break;

    default:
      display = action.name;
  }
  return <span className={className}>{display}</span>;
};

export default ActionDisplay;
