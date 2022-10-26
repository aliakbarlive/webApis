import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectPortfolios } from 'features/advertising/advertisingSlice';

import classNames from 'utils/classNames';

const CampaignSettingForm = ({
  form,
  updateForm,
  disableTargetingType,
  errors = {},
}) => {
  const { t } = useTranslation();
  const portfolios = useSelector(selectPortfolios);

  const onChange = (e) => {
    const { name, value } = e.target;
    const key = name.replace('campaign.', '');

    updateForm({ ...form, [key]: value });
  };

  const targetingTypes = [
    {
      value: 'auto',
      display: t('Advertising.CampaignBuilder.Targeting.Auto.Display'),
      description: t('Advertising.CampaignBuilder.Targeting.Auto.Description'),
    },
    {
      value: 'manual',
      display: t('Advertising.CampaignBuilder.Targeting.Manual.Display'),
      description: t(
        'Advertising.CampaignBuilder.Targeting.Manual.Description'
      ),
    },
  ];

  return (
    <div className="border rounded-md">
      <div className="border-b p-4">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.CampaignSettings')}
        </h3>
      </div>

      <div className="p-4 mt-2 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-8">
        <div className="col-span-4">
          <label
            htmlFor="campaign.name"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.CampaignName')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={form.name}
              name="campaign.name"
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onChange={onChange}
            />
            {'campaign.name' in errors &&
              errors['campaign.name'].map((error) => {
                return (
                  <p key={error} className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
                );
              })}
          </div>
        </div>

        <div className="col-span-4">
          <label
            htmlFor="campaign.portfolioId"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.Portfolio')}
          </label>
          <div className="mt-1">
            <select
              value={form.portfolioId}
              name="campaign.portfolioId"
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onChange={onChange}
            >
              <option value="">
                {t('Advertising.CampaignBuilder.Portfolio.None')}
              </option>
              {portfolios.rows.map((portfolio) => (
                <option
                  key={portfolio.advPortfolioId}
                  value={portfolio.advPortfolioId}
                >
                  {portfolio.name}
                </option>
              ))}
              {'campaign.portforlioId' in errors &&
                errors['campaign.portforlioId'].map((error) => {
                  return (
                    <p key={error} className="mt-2 text-xs text-red-600">
                      {error}
                    </p>
                  );
                })}
            </select>
          </div>
        </div>

        <div className="col-span-4">
          <label
            htmlFor="campaign.dailyBudget"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.DailyBudget')}
          </label>
          <div className="mt-1">
            <input
              type="number"
              value={form.dailyBudget}
              name="campaign.dailyBudget"
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onChange={onChange}
            />
            {'campaign.dailyBudget' in errors &&
              errors['campaign.dailyBudget'].map((error) => {
                return (
                  <p key={error} className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
                );
              })}
          </div>
        </div>

        <div className="col-span-2">
          <label
            htmlFor="campaign.startDate"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.StartDate')}
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="campaign.startDate"
              value={form.startDate}
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onChange={onChange}
            />
            {'campaign.startDate' in errors &&
              errors['campaign.startDate'].map((error) => {
                return (
                  <p key={error} className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
                );
              })}
          </div>
        </div>

        <div className="col-span-2">
          <label
            htmlFor="campaign.endDate"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.EndDate')}
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="campaign.endDate"
              value={form.endDate}
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onChange={onChange}
            />
            {'campaign.endDate' in errors &&
              errors['campaign.endDate'].map((error) => {
                return (
                  <p key={error} className="mt-2 text-xs text-red-600">
                    {error}
                  </p>
                );
              })}
          </div>
        </div>

        {/* Targeting Type */}
        <fieldset className="col-span-8 mt-4">
          <legend className="block text-xs font-medium text-gray-700">
            {t('Advertising.CampaignBuilder.Targeting')}
          </legend>
          <div className="mt-2 space-y-4">
            {targetingTypes.map((targetingType) => (
              <div key={targetingType.value} className="flex items-center">
                <input
                  value={targetingType.value}
                  name="campaign.targetingType"
                  type="radio"
                  disabled={disableTargetingType}
                  className={classNames(
                    disableTargetingType
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer',
                    'focus:outline-none focus:ring-0 h-4 w-4 text-red-600 border-gray-300'
                  )}
                  checked={form.targetingType === targetingType.value}
                  onChange={onChange}
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
    </div>
  );
};

export default CampaignSettingForm;
