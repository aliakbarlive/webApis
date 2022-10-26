import AdGroupSettingForm from '../../forms/AdGroupSettingForm';
import CampaignBidStrategyForm from '../../forms/CampaignBidStrategyForm';
import CampaignSettingForm from '../../forms/CampaignSettingForm';
import KeywordTargetingForm from '../../forms/KeywordTargetingForm';
import NegativeKeywordForm from '../../forms/NegativeKeywordForm';
import ProductAdsForm from '../../forms/ProductAdsForm';
import TargetingForm from '../../forms/TargetingForm';

const CampaignBuilder = ({
  form,
  updateForm,
  errors = {},
  disableTargetingType = false,
}) => {
  const onUpdateForm = (key, data) => {
    updateForm({ ...form, [key]: data });
  };

  return (
    <div className="mt-4">
      <CampaignSettingForm
        form={form.campaign}
        disableTargetingType={disableTargetingType}
        updateForm={(data) => onUpdateForm('campaign', data)}
        errors={errors}
      />

      <CampaignBidStrategyForm
        form={form.campaign}
        updateForm={(data) => onUpdateForm('campaign', data)}
      />

      <AdGroupSettingForm
        form={form.adGroup}
        updateForm={(data) => onUpdateForm('adGroup', data)}
        errors={errors}
      />

      <ProductAdsForm
        form={form.productAds}
        updateForm={(data) => onUpdateForm('productAds', data)}
        errors={errors}
      />

      <TargetingForm
        targeting={form.targeting}
        disableTargetingType={disableTargetingType}
        updateForm={(data) => onUpdateForm('targeting', data)}
        errors={errors}
      />

      <KeywordTargetingForm
        form={form.keywords}
        updateForm={(data) => onUpdateForm('keywords', data)}
        errors={errors}
      />

      <NegativeKeywordForm
        form={form.negativeKeywords}
        updateForm={(data) => onUpdateForm('negativeKeywords', data)}
        errors={errors}
      />
    </div>
  );
};

export default CampaignBuilder;
