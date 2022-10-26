import { useEffect, useState } from 'react';
import { max } from 'lodash';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';

import CampaignBuilder from '../forms/CampaignBuilder';
import classNames from 'utils/classNames';
import {
  AD_GROUPS,
  CAMPAIGNS,
  ENABLED_STATUS,
} from 'features/advertising/utils/constants';

const ConvertAsKeywordToNewAdGroup = ({
  open,
  setOpen,
  item,
  optimization,
  onChangeData,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState(optimization.data);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const validKeywords =
      data.keywords.length && data.keywords.every((keyword) => keyword.bid);
    const validCampaign =
      data.campaign.name &&
      data.campaign.startDate &&
      data.campaign.dailyBudget;

    setValid(
      validKeywords &&
        data.productAds.length &&
        data.adGroup.name &&
        validCampaign
    );
  }, [data]);

  const onClickCancel = () => {
    setData(optimization.data);
    setOpen(false);
    onCancel();
  };

  const onClickConfirm = () => {
    let payload = { ...data };
    payload.productAds = payload.productAds.map((p) => {
      return { sku: p.sku, state: ENABLED_STATUS };
    });

    payload.adGroup.defaultBid = max(
      payload.keywords.map(({ bid }) => parseFloat(bid))
    );

    payload.campaign.endDate = payload.campaign.endDate
      ? payload.campaign.endDate.split('-').join('')
      : payload.campaign.endDate;

    payload.campaign.startDate = payload.campaign.startDate.split('-').join('');

    if (!payload.campaign.endDate) delete payload.campaign.endDate;
    if (!payload.campaign.portfolioId) delete payload.campaign.portfolioId;

    onChangeData(payload);
    setOpen(false);
  };

  const onChangeNegativeKeywordLevel = (e) => {
    setData({ ...data, convertAsNegativeKeywordOn: e.target.value });
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
      <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title={t('Advertising.Actions.NewKeywords.NewCampaign')}
          titleClasses="text-sm font-normal"
          setOpen={setOpen}
          showCloseButton={false}
        />

        <div className="px-4 pt-4 pb-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 grid grid-cols-8 gap-4 px-6">
                  <dt className="text-xs text-gray-500">
                    {t('Advertising.Actions.NewKeywords.SearchTerm')}
                  </dt>
                  <dd className="text-xs text-gray-900 col-span-3">
                    {item.query}
                  </dd>

                  {item.AdvKeyword && (
                    <>
                      <dt className="text-xs text-gray-500">
                        Keyword Targeting
                      </dt>
                      <dd className="text-xs text-gray-900 col-span-3">
                        <span className="font-medium">
                          {item.AdvKeyword.keywordText}
                        </span>
                        <span> [{item.AdvKeyword.matchType}] </span>
                        <span> [${item.AdvKeyword.bid}] </span>
                      </dd>
                    </>
                  )}
                  {item.AdvTarget && (
                    <>
                      <dt className="text-xs text-gray-500">
                        Product Targeting
                      </dt>
                      <dd className="text-xs text-gray-900 col-span-3">
                        <span className="font-medium">
                          {item.AdvTarget.targetingText}
                        </span>
                        <span> [${item.AdvTarget.bid}] </span>
                      </dd>
                    </>
                  )}
                </div>

                <div className="py-3 grid grid-cols-8 gap-4 px-6">
                  <dt className="text-xs text-gray-500">Campaign</dt>
                  <dd className="text-xs text-gray-900 col-span-3">
                    {item.AdvCampaign.name}
                  </dd>

                  <dt className="text-xs text-gray-500">Ad Group</dt>
                  <dd className="text-xs text-gray-900 col-span-3">
                    {item.AdvAdGroup.name}
                  </dd>
                </div>

                <div className="py-3 px-6 text-xs flex">
                  <dt className="text-gray-500 mr-5">
                    {t('Advertising.Actions.AddAsNegativeKeyword')}
                  </dt>
                  <dd className="flex">
                    <div className="flex items-center mr-4">
                      <input
                        name="convertAsNegativeKeywordOn"
                        className="focus:outline-none focus:ring-0 h-4 w-4 text-red-600 border-gray-30"
                        type="radio"
                        value={AD_GROUPS}
                        checked={data.convertAsNegativeKeywordOn === AD_GROUPS}
                        onChange={onChangeNegativeKeywordLevel}
                      />
                      <div className="ml-3">
                        <label className="text-xs text-gray-900">
                          {t(
                            'Advertising.Actions.NegativeKeywords.AdGroupLevel'
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        name="convertAsNegativeKeywordOn"
                        className="focus:outline-none focus:ring-0 h-4 w-4 text-red-600 border-gray-30"
                        type="radio"
                        value={CAMPAIGNS}
                        checked={data.convertAsNegativeKeywordOn === CAMPAIGNS}
                        onChange={onChangeNegativeKeywordLevel}
                      />
                      <div className="ml-3">
                        <label className="text-xs text-gray-900">
                          {t(
                            'Advertising.Actions.NegativeKeywords.CampaignLevel'
                          )}
                        </label>
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <hr />

          <CampaignBuilder
            disableTargetingType={true}
            form={data}
            updateForm={(form) => setData(form)}
          />

          <div className="mt-4">
            <button
              className="text-xs border rounded-md  border-gray-300 px-4 py-2 mr-1"
              onClick={onClickCancel}
            >
              {t('Advertising.Actions.NewKeywords.Cancel')}
            </button>
            <button
              className={classNames(
                valid ? 'cursor-pointer' : 'cursor-not-allowed opacity-75',
                'border rounded-md text-xs text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0 focus:border-gray-300 px-4 py-2'
              )}
              disabled={!valid}
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

export default ConvertAsKeywordToNewAdGroup;
