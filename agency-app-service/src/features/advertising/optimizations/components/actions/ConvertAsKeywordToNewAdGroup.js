import axios from 'axios';
import { max } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectReport } from '../../optimizationSlice';

import Modal from 'components/Modal';
import Checkbox from 'components/Forms/Checkbox';
import ModalHeader from 'components/ModalHeader';

import CampaignBuilder from 'features/advertising/components/optimizations/forms/CampaignBuilder';

import {
  AD_GROUPS,
  BROAD,
  CAMPAIGNS,
  ENABLED_STATUS,
  EXACT,
  PHRASE,
} from 'features/advertising/utils/constants';

const ConvertAsKeywordToNewAdGroup = ({
  accountId,
  marketplace,
  option,
  item,
  onUpdate,
  checked,
}) => {
  const baseForm = {
    convertAsNegativeKeywordOn: '',
    campaign: {
      portfolioId: '',
      name: '',
      campaignType: 'sponsoredProducts',
      targetingType: 'manual',
      state: ENABLED_STATUS,
      dailyBudget: '',
      startDate: '',
      endDate: '',
      bidding: {
        strategy: 'legacyForSales',
        adjustments: [
          { predicate: 'placementTop', percentage: 0 },
          { predicate: 'placementProductPage', percentage: 0 },
        ],
      },
    },
    adGroup: {
      name: '',
      defaultBid: '',
      state: ENABLED_STATUS,
    },
    targeting: 'keywords',
    productAds: item.values.AdvAdGroup.AdvProductAds,
    negativeKeywords: [],
    keywords: [
      {
        state: ENABLED_STATUS,
        keywordText: item.values.query,
        matchType: EXACT,
        bid: item.cpc,
      },
      {
        state: ENABLED_STATUS,
        keywordText: item.values.query,
        matchType: BROAD,
        bid: item.cpc,
      },
      {
        state: ENABLED_STATUS,
        keywordText: item.values.query,
        matchType: PHRASE,
        bid: item.cpc,
      },
    ],
  };

  const { t } = useTranslation();
  const report = useSelector(selectReport);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(baseForm);
  const [errors, setErrors] = useState({});

  const onClickCancel = () => {
    setData(baseForm);
    setOpen(false);
  };

  const onClickConfirm = async () => {
    let payload = { ...data };
    payload.productAds = payload.productAds.map((p) => {
      return { sku: p.sku, state: ENABLED_STATUS };
    });

    payload.adGroup.defaultBid = max(
      payload.keywords.map(({ bid }) => parseFloat(bid))
    );

    if (!payload.campaign.endDate) delete payload.campaign.endDate;
    if (!payload.campaign.portfolioId) delete payload.campaign.portfolioId;

    await updateOption({ selected: true, data: payload });
  };

  const onChangeNegativeKeywordLevel = (e) => {
    setData({ ...data, convertAsNegativeKeywordOn: e.target.value });
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
                        {item.values.query}
                      </dd>

                      {item.values.AdvKeyword && (
                        <>
                          <dt className="text-xs text-gray-500">
                            Keyword Targeting
                          </dt>
                          <dd className="text-xs text-gray-900 col-span-3">
                            <span className="font-medium">
                              {item.values.AdvKeyword.keywordText}
                            </span>
                            <span> [{item.values.AdvKeyword.matchType}] </span>
                            <span> [${item.values.AdvKeyword.bid}] </span>
                          </dd>
                        </>
                      )}
                      {item.values.AdvTarget && (
                        <>
                          <dt className="text-xs text-gray-500">
                            Product Targeting
                          </dt>
                          <dd className="text-xs text-gray-900 col-span-3">
                            <span className="font-medium">
                              {item.values.AdvTarget.targetingText}
                            </span>
                            <span> [${item.values.AdvTarget.bid}] </span>
                          </dd>
                        </>
                      )}
                    </div>

                    <div className="py-3 grid grid-cols-8 gap-4 px-6">
                      <dt className="text-xs text-gray-500">Campaign</dt>
                      <dd className="text-xs text-gray-900 col-span-3">
                        {item.values.AdvCampaign.name}
                      </dd>

                      <dt className="text-xs text-gray-500">Ad Group</dt>
                      <dd className="text-xs text-gray-900 col-span-3">
                        {item.values.AdvAdGroup.name}
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
                            checked={
                              data.convertAsNegativeKeywordOn === AD_GROUPS
                            }
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
                            checked={
                              data.convertAsNegativeKeywordOn === CAMPAIGNS
                            }
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
                errors={errors}
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
                  className="border rounded-md text-xs text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0 focus:border-gray-300 px-4 py-2"
                  onClick={onClickConfirm}
                >
                  {t('Advertising.Actions.NewKeywords.Confirm')}
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <p className="font-medium">{option.rule.name}</p>
        <p>Convert as new keyword in new campaign and adGroup</p>
      </div>
    </div>
  );
};

export default ConvertAsKeywordToNewAdGroup;
