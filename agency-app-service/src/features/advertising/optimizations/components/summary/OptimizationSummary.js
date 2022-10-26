import axios from 'axios';
import { startCase } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getReportItemsAsync, selectParams } from '../../optimizationSlice';
import { setAlert } from 'features/alerts/alertsSlice';

import Modal from 'components/Modal';
import Button from 'components/Button';
import ModalHeader from 'components/ModalHeader';

import UpdateKeywordBid from './UpdateKeywordBid';
import UpdateKeywordStatus from './UpdateKeywordStatus';
import UpdateCampaignStatus from './UpdateCampaignStatus';
import UpdateCampaignBudget from './UpdateCampaignBudget';
import ConvertAsNegativeKeyword from './ConvertAsNegativeKeyword';
import ConvertAsNewKeywordToNewAdGroup from './ConvertAsNewKeywordToNewAdGroup';
import ConvertAsNewKeywordToExistingAdGroup from './ConvertAsNewKeywordToExistingAdGroup';

import {
  SP_CAMPAIGNS_UPDATE_BUDGET,
  SP_CAMPAIGNS_UPDATE_STATUS,
  SP_KEYWORDS_UPDATE_BID,
  SP_KEYWORDS_UPDATE_STATUS,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
} from 'features/advertising/utils/constants';

import classNames from 'utils/classNames';

const OptimizationSummary = ({
  accountId,
  marketplace,
  reportId,
  recordType,
  open,
  setOpen,
  items = {},
}) => {
  const dispatch = useDispatch();
  const params = useSelector(selectParams);

  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(items).length) {
      setActiveTab(Object.keys(items)[0]);
    }
  }, [items]);

  const proceedOptimization = () => {
    setLoading(true);

    axios
      .post(`ppc/optimizations/reports/${reportId}/process`, {
        accountId,
        marketplace,
      })
      .then((response) => {
        dispatch(setAlert('success', response.data.message));

        dispatch(
          getReportItemsAsync(reportId, { ...params, accountId, marketplace })
        );
      })
      .catch((err) => {
        dispatch(setAlert('errror', err.response.data.message));
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
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
          title={`${startCase(recordType)} Optimization Summary`}
          titleClasses="text-sm font-normal"
          setOpen={setOpen}
          showCloseButton={false}
        />

        <div className="px-4 pb-10">
          <div className="mb-4">
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {Object.keys(items).map((actionCode) => {
                    const { action } = items[actionCode][0].selectedOption.rule;
                    const actionItems = items[actionCode];

                    return (
                      <div
                        key={action.code}
                        className={classNames(
                          action.code === activeTab
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                          'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-xs cursor-pointer'
                        )}
                        onClick={() => setActiveTab(action.code)}
                      >
                        {action.name}
                        {actionItems.length ? (
                          <span
                            className={classNames(
                              action.code === activeTab
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-900',
                              'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                            )}
                          >
                            {actionItems.length}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-col mt-2">
                <div className="-my-2 overflow-x-auto">
                  <div className="py-2 align-middle inline-block min-w-full">
                    <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      {activeTab === SP_KEYWORDS_UPDATE_BID && (
                        <UpdateKeywordBid items={items[activeTab]} />
                      )}

                      {activeTab === SP_KEYWORDS_UPDATE_STATUS && (
                        <UpdateKeywordStatus items={items[activeTab]} />
                      )}

                      {activeTab === SP_CAMPAIGNS_UPDATE_STATUS && (
                        <UpdateCampaignStatus items={items[activeTab]} />
                      )}

                      {activeTab === SP_CAMPAIGNS_UPDATE_BUDGET && (
                        <UpdateCampaignBudget items={items[activeTab]} />
                      )}

                      {activeTab ===
                        SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD && (
                        <ConvertAsNegativeKeyword items={items[activeTab]} />
                      )}

                      {activeTab ===
                        SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP && (
                        <ConvertAsNewKeywordToExistingAdGroup
                          items={items[activeTab]}
                        />
                      )}

                      {activeTab ===
                        SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP && (
                        <ConvertAsNewKeywordToNewAdGroup
                          items={items[activeTab]}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              className="text-xs border rounded-md  border-gray-300 px-4 py-2 mr-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <Button
              classes="disabled:opacity-75r"
              disabled={loading}
              loading={loading}
              showLoading
              onClick={proceedOptimization}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OptimizationSummary;
