import { useTranslation } from 'react-i18next';

const TargetPreview = ({ campaignName, adGroupName, targetingText }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <span>{targetingText}</span>
      <span className="text-xs text-gray-400">
        {t('Advertising.Campaign')}: {campaignName}
      </span>
      <span className="text-xs text-gray-400">
        {t('Advertising.AdGroup')}: {adGroupName}
      </span>
    </div>
  );
};

export default TargetPreview;
