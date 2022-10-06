import { useTranslation } from 'react-i18next';

const AdGroupSettingForm = ({ form, updateForm, errors = {} }) => {
  const { t } = useTranslation();
  const onChange = (e) => {
    const { name, value } = e.target;
    const key = name.replace('adGroup.', '');

    updateForm({ ...form, [key]: value });
  };

  return (
    <div className="mt-4 border rounded-md">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.AdGroupSettings')}
        </h3>
      </div>

      <div className="p-4 mt-2 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-8">
        <div className="col-span-4">
          <label
            htmlFor="adGroup.name"
            className="block text-xs font-medium text-gray-700"
          >
            {t('Advertising.CampaignBuilder.AdGroupName')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="adGroup.name"
              className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              value={form.name}
              onChange={onChange}
            />
          </div>
          {'adGroup.name' in errors &&
            errors['adGroup.name'].map((error) => {
              return (
                <p key={error} className="mt-2 text-xs text-red-600">
                  {error}
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdGroupSettingForm;
