import { useTranslation } from 'react-i18next';

import SelectFilter from './SelectFilter';

const StatusFilter = ({ params, setParams, className }) => {
  const { t } = useTranslation();

  return (
    <SelectFilter
      name="state"
      placeholder={t('Advertising.Common.Filter.Status')}
      onApplyFilter={setParams}
      params={params}
      className={className}
      options={[
        {
          value: 'enabled',
          display: t('Advertising.Common.Filter.Status.Enabled'),
        },
        {
          value: 'paused',
          display: t('Advertising.Common.Filter.Status.Paused'),
        },
        {
          value: 'archived',
          display: t('Advertising.Common.Filter.Status.Archived'),
        },
      ]}
    />
  );
};

export default StatusFilter;
