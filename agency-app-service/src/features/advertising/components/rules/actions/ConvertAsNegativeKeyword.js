import { useTranslation } from 'react-i18next';
import {
  AD_GROUPS,
  CAMPAIGNS,
  NEGATIVE_EXACT,
  NEGATIVE_PHRASE,
} from 'features/advertising/utils/constants';

const ConvertAsNegativeKeyword = ({ data, onChangeData, errors = {} }) => {
  const { t } = useTranslation();
  const onChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...data, [name]: value };
    onChangeData(newData);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="matchType"
          className="block text-sm font-medium text-gray-700"
        >
          {t('Advertising.Rule.Action.ConvertAsNegKeyword.MatchType')}
        </label>
        <div className="mt-1">
          <select
            id="matchType"
            name="matchType"
            className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
            value={data.matchType}
            onChange={onChange}
          >
            <option value="">
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.SelectMatchType')}
            </option>
            <option value={NEGATIVE_PHRASE}>
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.NegativePhrase')}
            </option>
            <option value={NEGATIVE_EXACT}>
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.NegativeExact')}
            </option>
          </select>
        </div>
        {errors['actionData.matchType'] && (
          <p className="text-xs text-red-600">
            {errors['actionData.matchType']}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="level"
          className="block text-sm font-medium text-gray-700"
        >
          {t('Advertising.Rule.Action.ConvertAsNegKeyword.Level')}
        </label>
        <div className="mt-1">
          <select
            id="level"
            name="level"
            className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
            value={data.level}
            onChange={onChange}
          >
            <option value="">
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.SelectLevel')}
            </option>
            <option value={AD_GROUPS}>
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.AdGroup')}
            </option>
            <option value={CAMPAIGNS}>
              {t('Advertising.Rule.Action.ConvertAsNegKeyword.Campaign')}
            </option>
          </select>
        </div>
        {errors['actionData.level'] && (
          <p className="text-xs text-red-600">{errors['actionData.level']}</p>
        )}
      </div>
    </div>
  );
};

export default ConvertAsNegativeKeyword;
