import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import Checkbox from 'components/Forms/Checkbox';

import {
  selectAdGroups,
  selectCampaigns,
} from 'features/advertising/advertisingSlice';

import { selectReport } from '../../optimizationSlice';

import {
  BROAD,
  ENABLED_STATUS,
  EXACT,
  PHRASE,
} from 'features/advertising/utils/constants';

const ConvertAsNewKeywordToExistingAdGroup = ({
  accountId,
  marketplace,
  option,
  item,
  onUpdate,
  checked,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const campaigns = useSelector(selectCampaigns);
  const adGroups = useSelector(selectAdGroups);
  const report = useSelector(selectReport);

  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    keywordText: item.values.query,
    matchType: '',
    campaignId: item.values.target === 'keyword' ? item.advCampaignId : '',
    adGroupId: item.values.target === 'keyword' ? item.advAdGroupId : '',
    bid:
      item.values.target === 'keyword' ? item.values.AdvAdGroup.defaultBid : '',
    state: ENABLED_STATUS,
  });

  const onChange = (e) => {
    const { value, name } = e.target;
    const newData = { ...data, [name]: value };
    if (name === 'campaignId') {
      newData.adGroupId = '';
    }
    setData(newData);
  };

  const onClickCancel = () => {
    setData({
      keywordText: item.values.query,
      matchType: '',
      campaignId: item.values.target === 'keyword' ? item.advCampaignId : '',
      adGroupId: item.values.target === 'keyword' ? item.advAdGroupId : '',
      bid:
        item.values.target === 'keyword'
          ? item.values.AdvAdGroup.defaultBid
          : '',
      state: ENABLED_STATUS,
    });
    setOpen(false);
  };

  const onClickConfirm = () => {
    updateOption({ selected: true, data });
  };

  const updateOption = async (payload) => {
    const reportId = report.advOptimizationReportId;
    const optionId = option.advOptimizationReportItemOptionId;
    const itemId = option.advOptimizationReportItemId;

    await axios
      .put(
        `/ppc/optimizations/reports/${reportId}/items/${itemId}/options/${optionId}`,
        {
          accountId,
          marketplace,
          ...payload,
        }
      )
      .then(() => {
        setErrors({});
        setOpen(false);
        onUpdate(optionId, true);
      })
      .catch((error) => setErrors(error.response.data.errors));
  };

  const onChangeChecked = async (e) => {
    const optionId = option.advOptimizationReportItemOptionId;

    const { checked } = e.target;
    if (checked) {
      setOpen(true);

      return;
    }
    await updateOption({ selected: false, data: {} });
    onUpdate(optionId, false);
  };

  return (
    <div className="flex items-center mb-2">
      <Checkbox checked={checked} onChange={onChangeChecked} />

      <div className="ml-3">
        <Modal
          open={open}
          setOpen={setOpen}
          as={'div'}
          align="top"
          noOverlayClick={true}
          persistent={true}
        >
          <div className="inline-block max-w-2xl mx-2 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
            <ModalHeader
              title="Convert As Keyword To Existing Campaign / AdGroup"
              titleClasses="text-sm font-normal"
              setOpen={setOpen}
              showCloseButton={false}
            />

            <div className="px-4 pt-4 pb-10">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-xs text-gray-500">
                        {t('Advertising.Actions.NewKeywords.SearchTerm')}
                      </dt>
                      <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {item.values.query}
                      </dd>
                    </div>
                    {item.values.AdvKeyword && (
                      <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-xs text-gray-500">
                          Keyword Targeting
                        </dt>
                        <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="font-medium">
                            {item.values.AdvKeyword.keywordText}
                          </span>
                          <span> [{item.values.AdvKeyword.matchType}] </span>
                          <span> [${item.values.AdvKeyword.bid}] </span>
                        </dd>
                      </div>
                    )}
                    {item.values.AdvTarget && (
                      <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-xs text-gray-500">
                          Product Targeting
                        </dt>
                        <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="font-medium">
                            {item.values.AdvTarget.targetingText}
                          </span>
                          <span> [${item.values.AdvTarget.bid}] </span>
                        </dd>
                      </div>
                    )}
                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-xs text-gray-500">Ad Group</dt>
                      <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {item.values.AdvAdGroup.name}
                      </dd>
                    </div>
                    <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-xs text-gray-500">Campaign</dt>
                      <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {item.values.AdvCampaign.name}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Keyword Text */}
              <div className="mb-2">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="w-28 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                    {t('Advertising.Actions.NewKeywords.KeywordText')}
                  </span>
                  <input
                    name="keywordText"
                    value={data.keywordText}
                    className="flex-1 min-w-0 block w-full px-3 py-1 rounded-none rounded-r-md focus:outline-none border focus:ring-0 focus:border-gray-300 text-xs border-gray-300"
                    disabled
                  />
                </div>
              </div>

              {/* Campaign Options */}
              <div className="mb-2">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="w-28 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                    {t('Advertising.Actions.NewKeywords.Campaign')}
                  </span>
                  <select
                    name="campaignId"
                    value={data.campaignId}
                    className="flex-1 min-w-0 block w-full px-3 py-1 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300 text-xs border-gray-300"
                    onChange={onChange}
                  >
                    <option value="">
                      {' '}
                      {t('Advertising.Actions.NewKeywords.SelectCampaign')}
                    </option>
                    {campaigns.rows.map((campaign) => (
                      <option
                        key={campaign.advCampaignId}
                        value={campaign.advCampaignId}
                      >
                        {campaign.name}
                      </option>
                    ))}
                  </select>
                </div>
                {'campaignId' in errors &&
                  errors.campaignId.map((error) => {
                    return (
                      <p key={error} className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    );
                  })}
              </div>
              {/* Ad Group Options */}
              <div className="mb-2">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="w-28 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                    {t('Advertising.Actions.NewKeywords.AdGroup')}
                  </span>
                  <select
                    name="adGroupId"
                    value={data.adGroupId}
                    className="flex-1 min-w-0 block w-full px-3 py-1 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300 text-xs border-gray-300"
                    onChange={onChange}
                  >
                    <option value="">
                      {t('Advertising.Actions.NewKeywords.SelectAdGroup')}
                    </option>
                    {adGroups.rows
                      .filter(
                        (adGroup) => adGroup.advCampaignId === data.campaignId
                      )
                      .map((adGroup) => (
                        <option
                          key={adGroup.advAdGroupId}
                          value={adGroup.advAdGroupId}
                        >
                          {adGroup.name}
                        </option>
                      ))}
                  </select>
                </div>
                {'adGroupId' in errors &&
                  errors.adGroupId.map((error) => {
                    return (
                      <p key={error} className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    );
                  })}
              </div>
              {/* Match Type Options */}
              <div className="mb-2">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="w-28 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                    {t('Advertising.Actions.NewKeywords.MatchType')}
                  </span>
                  <select
                    name="matchType"
                    value={data.matchType}
                    className="flex-1 min-w-0 block w-full px-3 py-1 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300 text-xs border-gray-300"
                    onChange={onChange}
                  >
                    <option value="">
                      {t('Advertising.Actions.NewKeywords.SelectMatchType')}
                    </option>
                    <option value={EXACT}>
                      {t('Advertising.Actions.NewKeywords.MatchType.Exact')}
                    </option>
                    <option value={PHRASE}>
                      {t('Advertising.Actions.NewKeywords.MatchType.Phrase')}
                    </option>
                    <option value={BROAD}>
                      {t('Advertising.Actions.NewKeywords.MatchType.Broad')}
                    </option>
                  </select>
                </div>
                {'matchType' in errors &&
                  errors.matchType.map((error) => {
                    return (
                      <p key={error} className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    );
                  })}
              </div>
              {/* Keyword Bid */}
              <div className="mb-2">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="w-28 inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
                    {t('Advertising.Actions.NewKeywords.Bid')}
                  </span>
                  <input
                    name="bid"
                    value={data.bid}
                    className="flex-1 min-w-0 block w-full px-3 py-1 rounded-none rounded-r-md focus:outline-none border focus:ring-0 focus:border-gray-300 text-xs border-gray-300"
                    onChange={onChange}
                  />
                </div>
                {'bid' in errors &&
                  errors.bid.map((error) => {
                    return (
                      <p key={error} className="mt-2 text-xs text-red-600">
                        {error}
                      </p>
                    );
                  })}
              </div>
              <div className="mt-4">
                <button
                  className="text-xs border rounded-md  border-gray-300 px-4 py-2 mr-1"
                  onClick={onClickCancel}
                >
                  {t('Advertising.Actions.NewKeywords.Cancel')}
                </button>
                <button
                  className="disabled:opacity-75 border rounded-md text-xs text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0 focus:border-gray-300 px-4 py-2"
                  onClick={onClickConfirm}
                >
                  {t('Advertising.Actions.NewKeywords.Confirm')}
                </button>
              </div>
            </div>
          </div>
        </Modal>

        <p className="font-medium">{option.rule.name}</p>
        <p>Convert as new keyword in existing campaign and adGroup</p>
      </div>
    </div>
  );
};

export default ConvertAsNewKeywordToExistingAdGroup;
