import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';

import {
  selectAdGroups,
  selectCampaigns,
} from 'features/advertising/advertisingSlice';

import { BROAD, EXACT, PHRASE } from 'features/advertising/utils/constants';

const ConvertAsNewKeywordToExistingAdGroup = ({
  open,
  setOpen,
  item,
  optimization,
  onChangeData,
  onCancel,
}) => {
  const { t } = useTranslation();

  const campaigns = useSelector(selectCampaigns);
  const adGroups = useSelector(selectAdGroups);
  const [data, setData] = useState(optimization.data);

  const onChange = (e) => {
    const { value, name } = e.target;
    setData({ ...data, [name]: value });
  };

  const onClickCancel = () => {
    setData(optimization.data);
    setOpen(false);
    onCancel();
  };

  const onClickConfirm = () => {
    onChangeData(data);
    setOpen(false);
  };

  return (
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
                    {item.query}
                  </dd>
                </div>
                {item.AdvKeyword && (
                  <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-xs text-gray-500">Keyword Targeting</dt>
                    <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="font-medium">
                        {item.AdvKeyword.keywordText}
                      </span>
                      <span> [{item.AdvKeyword.matchType}] </span>
                      <span> [${item.AdvKeyword.bid}] </span>
                    </dd>
                  </div>
                )}
                {item.AdvTarget && (
                  <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-xs text-gray-500">Product Targeting</dt>
                    <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className="font-medium">
                        {item.AdvTarget.targetingText}
                      </span>
                      <span> [${item.AdvTarget.bid}] </span>
                    </dd>
                  </div>
                )}
                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs text-gray-500">Ad Group</dt>
                  <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.AdvAdGroup.name}
                  </dd>
                </div>
                <div className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-xs text-gray-500">Campaign</dt>
                  <dd className="mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.AdvCampaign.name}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Keyword Text */}
          <div>
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
          <div>
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
          </div>
          {/* Ad Group Options */}
          <div>
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
          </div>
          {/* Match Type Options */}
          <div>
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
          </div>
          {/* Keyword Bid */}
          <div>
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
              disabled={
                !(
                  !!data.campaignId &&
                  !!data.adGroupId &&
                  !!data.matchType &&
                  !!data.bid
                )
              }
              onClick={onClickConfirm}
            >
              {t('Advertising.Actions.NewKeywords.Confirm')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConvertAsNewKeywordToExistingAdGroup;
