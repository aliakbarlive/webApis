import { useTranslation } from 'react-i18next';

import { KEYWORDS, TARGETS } from 'features/advertising/utils/constants';

import classNames from 'utils/classNames';

const TargetingForm = ({ targeting, updateForm, disableTargetingType }) => {
  const { t } = useTranslation();
  const targetingTypes = [
    {
      value: KEYWORDS,
      display: t('Advertising.CampaignBuilder.Targeting.Keyword.Display'),
      description: t(
        'Advertising.CampaignBuilder.Targeting.Keyword.Description'
      ),
    },
    {
      value: TARGETS,
      display: t('Advertising.CampaignBuilder.Targeting.Target.Display'),
      description: t(
        'Advertising.CampaignBuilder.Targeting.Target.Description'
      ),
    },
  ];

  return (
    <div className="mt-4 border rounded-md">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.Targeting')}
        </h3>
      </div>

      {/* Targeting Type */}
      <fieldset className="col-span-8 mt-4 p-4">
        <legend className="block text-xs font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.Targeting.Info')}
        </legend>
        <div className="mt-2 space-y-4">
          {targetingTypes.map((targetingType) => (
            <div key={targetingType.value} className="flex items-center">
              <input
                value={targetingType.value}
                name="targeting"
                type="radio"
                disabled={disableTargetingType}
                className={classNames(
                  disableTargetingType
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer',
                  'focus:outline-none focus:ring-0 h-4 w-4 text-red-600 border-gray-300'
                )}
                checked={targetingType.value === targeting}
                onChange={(e) => updateForm(e.target.value)}
              />
              <div className="ml-3 text-sm">
                <label className="text-xs text-gray-700">
                  {targetingType.display}
                </label>
                <p className="text-xs text-gray-500">
                  {targetingType.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default TargetingForm;
