import { useTranslation } from 'react-i18next';
import {
  ARCHIVED_STATUS,
  ENABLED_STATUS,
  PAUSED_STATUS,
} from 'features/advertising/utils/constants';

const UpdateStatus = ({ data, onChangeData, errors }) => {
  const { t } = useTranslation();
  const onChange = (e) => {
    let newData = { ...data, state: e.target.value };
    onChangeData(newData);
  };

  return (
    <div>
      <label
        htmlFor="state"
        className="block text-sm font-medium text-gray-700"
      >
        {t('Advertising.Common.Status')}
      </label>
      <div className="mt-1">
        <select
          id="state"
          name="state"
          className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
          value={data.state}
          onChange={onChange}
        >
          <option value="">
            {t('Advertising.Rule.Action.UpdateStatus.SelectStatus')}
          </option>
          <option value={ENABLED_STATUS}>
            {t('Advertising.Rule.Action.UpdateStatus.Enabled')}
          </option>
          <option value={PAUSED_STATUS}>
            {t('Advertising.Rule.Action.UpdateStatus.Paused')}
          </option>
          <option value={ARCHIVED_STATUS}>
            {t('Advertising.Rule.Action.UpdateStatus.Archived')}
          </option>
        </select>
        {errors['actionData.state'] && (
          <p className="text-xs text-red-600">{errors['actionData.state']}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateStatus;
