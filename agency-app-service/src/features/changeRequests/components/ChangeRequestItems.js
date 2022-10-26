import axios from 'axios';
import moment from 'moment';
import { groupBy, startCase, uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ThumbUpIcon,
  ThumbDownIcon,
  CheckIcon,
  XIcon,
} from '@heroicons/react/outline';

import {
  getChangeRequestDetails,
  selectSelectedChangeRequest,
} from '../changeRequestsSlice';

import { setAlert } from 'features/alerts/alertsSlice';

import ChangeRequestStatus from './ChangeRequestStatus';
import Checkbox from 'components/Forms/Checkbox';
import PageHeader from 'components/PageHeader';
import Button from 'components/Button';

import usePermissions from 'hooks/usePermissions';

import KeywordPreview from 'features/advertising/keywords/components/KeywordPreview';
import TargetPreview from 'features/advertising/targets/components/TargetPreview';

import classNames from 'utils/classNames';
import { currencyFormatter } from 'utils/formatters';

import {
  SP_CAMPAIGNS_UPDATE_BUDGET,
  SP_CAMPAIGNS_UPDATE_STATUS,
  SP_KEYWORDS_UPDATE_BID,
  SP_KEYWORDS_UPDATE_STATUS,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
} from 'features/advertising/utils/constants';

const ChangeRequestItems = ({}) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const { changeRequestId } = useParams();

  const changeRequest = useSelector(selectSelectedChangeRequest);
  const [optimizationItems, setOptimizationItems] = useState({});

  const [statusFilter, setStatusFilter] = useState('');
  const [optimizationActiveTab, setOptimizationActiveTab] = useState('');

  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    let params = { include: ['items', 'advProfile'] };

    if (statusFilter) {
      params.status = statusFilter;
    }

    dispatch(getChangeRequestDetails(changeRequestId, params));
  }, [dispatch, changeRequestId, statusFilter]);

  useEffect(() => {
    if (changeRequest && changeRequest.type === 'optimization') {
      const items = groupBy(
        changeRequest.items.map((item) => {
          return {
            ...item.optimization.reportItem,
            status: item.status,
            evaluator: item.evaluator,
            evaluatedAt: item.evaluatedAt,
            advChangeRequestItemId: item.advChangeRequestItemId,
            advOptimizationReportItemId:
              item.optimization.advOptimizationReportItemId,
            selectedOption: {
              data: item.optimization.data,
              rule: item.optimization.rule,
            },
          };
        }),
        'selectedOption.rule.action.code'
      );

      setOptimizationItems(items);
      setOptimizationActiveTab(Object.keys(items)[0]);
    }
  }, [changeRequest]);

  const evaluate = (type) => {
    if (!changeRequest) return;

    type === 'approve' ? setApproving(true) : setRejecting(true);

    axios
      .post(
        `/ppc/change-requests/${changeRequest.advChangeRequestId}/${type}`,
        {
          items: selectedItems,
        }
      )
      .then((response) => {
        dispatch(setAlert('success', response.data.message));
      })
      .catch(() => dispatch(setAlert('errror', 'Whoops! Something went wrong')))
      .finally(() => {
        dispatch(
          getChangeRequestDetails(changeRequestId, {
            include: ['items', 'advProfile'],
          })
        );
        setSelectedItems([]);
        type === 'approve' ? setApproving(false) : setRejecting(false);
      });
  };

  const onChangeSelectedItem = (e) => {
    let { id } = e.target;
    id = parseInt(id);

    const newSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter((i) => i !== id)
      : [...selectedItems, id];

    setSelectedItems(newSelectedItems);
  };

  return changeRequest ? (
    <>
      <PageHeader title="Change Requests Details" />

      <div className="flex mb-4 justify-between items-center">
        <div>
          <select
            className="mr-3 font-medium inline-flex text-sm text-gray-700 rounded"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {userCan('ppc.changeRequest.evaluate') && (
            <>
              <Button
                color="green"
                textSize="xs"
                classes="mr-1"
                disabled={
                  changeRequest.items.filter((i) => i.status === 'pending')
                    .length === 0
                }
                onClick={() =>
                  setSelectedItems(
                    changeRequest.items
                      .filter((i) => i.status === 'pending')
                      .map((i) => i.advChangeRequestItemId)
                  )
                }
              >
                <CheckIcon className="mr-2 h-4 w-4 cursor-pointer" />
                Select All Pending Items
              </Button>

              <Button
                color="gray"
                textSize="xs"
                classes="mr-1"
                disabled={selectedItems.length === 0}
                onClick={() => setSelectedItems([])}
              >
                <XIcon className="mr-2 h-4 w-4 cursor-pointer" />
                Clear selected items
              </Button>
            </>
          )}
        </div>

        {userCan('ppc.changeRequest.evaluate') && (
          <div>
            <Button
              color="gray"
              textSize="xs"
              classes="mr-1"
              loading={rejecting}
              showLoading={rejecting}
              disabled={rejecting || selectedItems.length === 0}
              onClick={() => evaluate('reject')}
            >
              <ThumbDownIcon className="mr-2 h-4 w-4 cursor-pointer" />
              Reject
            </Button>

            <Button
              classes="mr-1"
              textSize="xs"
              loading={approving}
              showLoading={approving}
              disabled={approving || selectedItems.length === 0}
              onClick={() => evaluate('approve')}
            >
              <ThumbUpIcon className="mr-2 h-4 w-4 cursor-pointer" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {(changeRequest.type === 'update campaign manually' ||
        changeRequest.type === 'apply campaign recommened budget') && (
        <div className="border px-2 py-1 rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th></th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Campaign
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Current Daily Budget
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Target Daily Budget
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Evaluated By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Evaluated At
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {changeRequest.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox
                      id={item.advChangeRequestItemId}
                      checked={selectedItems.includes(
                        item.advChangeRequestItemId
                      )}
                      onChange={onChangeSelectedItem}
                      disabled={item.status !== 'pending'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {currencyFormatter(item.campaign.dailyBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {currencyFormatter(item.data.dailyBudget)}
                  </td>
                  <td>
                    <ChangeRequestStatus status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {item.evaluator
                      ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                      : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {item.evaluatedAt
                      ? moment(item.evaluatedAt).format(
                          'MMMM Do YYYY, h:mm:ss a'
                        )
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {changeRequest.type === 'optimization' && (
        <div className="">
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {Object.keys(optimizationItems).map((actionCode) => {
                  const { action } =
                    optimizationItems[actionCode][0].selectedOption.rule;
                  const actionItems = optimizationItems[actionCode];

                  return (
                    <div
                      key={action.code}
                      className={classNames(
                        action.code === optimizationActiveTab
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                        'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-xs cursor-pointer'
                      )}
                      onClick={() => setOptimizationActiveTab(action.code)}
                    >
                      {action.name}
                      {actionItems.length ? (
                        <span
                          className={classNames(
                            action.code === optimizationActiveTab
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
                    {optimizationActiveTab === SP_KEYWORDS_UPDATE_BID && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Keyword
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Current BID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target Bid
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => (
                              <tr key={item.advOptimizationReportItemId}>
                                <td className="pl-3">
                                  <Checkbox
                                    id={item.advChangeRequestItemId}
                                    checked={selectedItems.includes(
                                      item.advChangeRequestItemId
                                    )}
                                    onChange={onChangeSelectedItem}
                                    disabled={item.status !== 'pending'}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                  <KeywordPreview
                                    keywordText={item.values.keywordText}
                                    matchType={item.values.matchType}
                                    campaignName={
                                      item.values.AdvAdGroup.AdvCampaign.name
                                    }
                                    adGroupName={item.values.AdvAdGroup.name}
                                    showProducts={false}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {currencyFormatter(item.values.bid)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {currencyFormatter(
                                    item.selectedOption.data.bid
                                  )}
                                </td>
                                <td>
                                  <ChangeRequestStatus status={item.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluator
                                    ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                    : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluatedAt
                                    ? moment(item.evaluatedAt).format(
                                        'MMMM Do YYYY, h:mm:ss a'
                                      )
                                    : ''}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab === SP_KEYWORDS_UPDATE_STATUS && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Keyword
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Current Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => (
                              <tr key={item.advOptimizationReportItemId}>
                                <td className="pl-3">
                                  <Checkbox
                                    id={item.advChangeRequestItemId}
                                    checked={selectedItems.includes(
                                      item.advChangeRequestItemId
                                    )}
                                    onChange={onChangeSelectedItem}
                                    disabled={item.status !== 'pending'}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                  <KeywordPreview
                                    keywordText={item.values.keywordText}
                                    matchType={item.values.matchType}
                                    campaignName={
                                      item.values.AdvAdGroup.AdvCampaign.name
                                    }
                                    adGroupName={item.values.AdvAdGroup.name}
                                    bid={currencyFormatter(item.values.bid)}
                                    showProducts={false}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.values.state}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.selectedOption.rule.actionData.state}
                                </td>
                                <td>
                                  <ChangeRequestStatus status={item.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluator
                                    ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                    : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluatedAt
                                    ? moment(item.evaluatedAt).format(
                                        'MMMM Do YYYY, h:mm:ss a'
                                      )
                                    : ''}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab === SP_CAMPAIGNS_UPDATE_STATUS && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Campaign
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Current Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => (
                              <tr key={item.advOptimizationReportItemId}>
                                <td className="pl-3">
                                  <Checkbox
                                    id={item.advChangeRequestItemId}
                                    checked={selectedItems.includes(
                                      item.advChangeRequestItemId
                                    )}
                                    onChange={onChangeSelectedItem}
                                    disabled={item.status !== 'pending'}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {item.values.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.values.state}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.selectedOption.rule.actionData.state}
                                </td>
                                <td>
                                  <ChangeRequestStatus status={item.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluator
                                    ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                    : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluatedAt
                                    ? moment(item.evaluatedAt).format(
                                        'MMMM Do YYYY, h:mm:ss a'
                                      )
                                    : ''}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab === SP_CAMPAIGNS_UPDATE_BUDGET && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Campaign
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Current Daily Budget
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target Daily Budget
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => (
                              <tr key={item.advOptimizationReportItemId}>
                                <td className="pl-3">
                                  <Checkbox
                                    id={item.advChangeRequestItemId}
                                    checked={selectedItems.includes(
                                      item.advChangeRequestItemId
                                    )}
                                    onChange={onChangeSelectedItem}
                                    disabled={item.status !== 'pending'}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {item.values.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {currencyFormatter(item.values.dailyBudget)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {currencyFormatter(
                                    item.selectedOption.data.dailyBudget
                                  )}
                                </td>
                                <td>
                                  <ChangeRequestStatus status={item.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluator
                                    ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                    : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluatedAt
                                    ? moment(item.evaluatedAt).format(
                                        'MMMM Do YYYY, h:mm:ss a'
                                      )
                                    : ''}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab ===
                      SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Search Term
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Convert as
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => (
                              <tr key={item.advOptimizationReportItemId}>
                                <td className="pl-3">
                                  <Checkbox
                                    id={item.advChangeRequestItemId}
                                    checked={selectedItems.includes(
                                      item.advChangeRequestItemId
                                    )}
                                    onChange={onChangeSelectedItem}
                                    disabled={item.status !== 'pending'}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.values.query}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                  {item.values.target === 'keyword' ? (
                                    <KeywordPreview
                                      adGroupId={item.values.advAdGroupId}
                                      adGroupName={item.values.AdvAdGroup.name}
                                      campaignName={
                                        item.values.AdvCampaign.name
                                      }
                                      keywordId={
                                        item.values.AdvKeyword.advKeywordId
                                      }
                                      keywordText={
                                        item.values.AdvKeyword.keywordText
                                      }
                                      matchType={
                                        item.values.AdvKeyword.matchType
                                      }
                                      bid={currencyFormatter(
                                        item.values.AdvKeyword.bid
                                      )}
                                      showProducts={false}
                                    />
                                  ) : (
                                    <TargetPreview
                                      adGroupName={item.values.AdvAdGroup.name}
                                      campaignName={
                                        item.values.AdvCampaign.name
                                      }
                                      targetingText={
                                        item.values.AdvTarget.targetingText
                                      }
                                    />
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {startCase(
                                    item.selectedOption.rule.actionData
                                      .matchType
                                  )}{' '}
                                  in{' '}
                                  {startCase(
                                    item.selectedOption.rule.actionData.level.slice(
                                      0,
                                      -1
                                    )
                                  )}{' '}
                                  level
                                </td>
                                <td>
                                  <ChangeRequestStatus status={item.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluator
                                    ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                    : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                  {item.evaluatedAt
                                    ? moment(item.evaluatedAt).format(
                                        'MMMM Do YYYY, h:mm:ss a'
                                      )
                                    : ''}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab ===
                      SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_EXISTING_CAMPAIGN_AND_AD_GROUP && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Search Term
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Add as new Keyword to
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => {
                              return (
                                <tr key={item.advOptimizationReportItemId}>
                                  <td className="pl-3">
                                    <Checkbox
                                      id={item.advChangeRequestItemId}
                                      checked={selectedItems.includes(
                                        item.advChangeRequestItemId
                                      )}
                                      onChange={onChangeSelectedItem}
                                      disabled={item.status !== 'pending'}
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.values.query}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                    {item.values.target === 'keyword' ? (
                                      <KeywordPreview
                                        adGroupName={
                                          item.values.AdvAdGroup.name
                                        }
                                        campaignName={
                                          item.values.AdvCampaign.name
                                        }
                                        keywordText={
                                          item.values.AdvKeyword.keywordText
                                        }
                                        matchType={
                                          item.values.AdvKeyword.matchType
                                        }
                                        bid={currencyFormatter(
                                          item.values.AdvKeyword.bid
                                        )}
                                        showProducts={false}
                                      />
                                    ) : (
                                      <TargetPreview
                                        adGroupName={
                                          item.values.AdvAdGroup.name
                                        }
                                        campaignName={
                                          item.values.AdvCampaign.name
                                        }
                                        targetingText={
                                          item.values.AdvTarget.targetingText
                                        }
                                      />
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <KeywordPreview
                                      adGroupName={
                                        item.selectedOption.data.adGroupName
                                      }
                                      campaignName={
                                        item.selectedOption.data.campaignName
                                      }
                                      keywordText={item.values.query}
                                      matchType={
                                        item.selectedOption.data.matchType
                                      }
                                      bid={currencyFormatter(
                                        item.selectedOption.data.bid
                                      )}
                                      showProducts={false}
                                    />
                                  </td>
                                  <td>
                                    <ChangeRequestStatus status={item.status} />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.evaluator
                                      ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                      : ''}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.evaluatedAt
                                      ? moment(item.evaluatedAt).format(
                                          'MMMM Do YYYY, h:mm:ss a'
                                        )
                                      : ''}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    )}

                    {optimizationActiveTab ===
                      SP_SEARCH_TERMS_CONVERT_AS_KEYWORD_ON_NEW_CAMPAIGN_AND_AD_GROUP && (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="pl-3"></th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Query
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Target
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Campaign Settings
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ad Group Settings
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Product Ads
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Keywords
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Negative Keywords
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              More
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated By
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Evaluated At
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {optimizationItems[optimizationActiveTab].map(
                            (item) => {
                              return (
                                <tr key={item.advOptimizationReportItemId}>
                                  <td className="pl-3">
                                    <Checkbox
                                      id={item.advChangeRequestItemId}
                                      checked={selectedItems.includes(
                                        item.advChangeRequestItemId
                                      )}
                                      onChange={onChangeSelectedItem}
                                      disabled={item.status !== 'pending'}
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.values.query}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                    {item.values.target === 'keyword' ? (
                                      <KeywordPreview
                                        adGroupName={
                                          item.values.AdvAdGroup.name
                                        }
                                        campaignName={
                                          item.values.AdvCampaign.name
                                        }
                                        keywordText={
                                          item.values.AdvKeyword.keywordText
                                        }
                                        matchType={
                                          item.values.AdvKeyword.matchType
                                        }
                                        bid={currencyFormatter(
                                          item.values.AdvKeyword.bid
                                        )}
                                        showProducts={false}
                                      />
                                    ) : (
                                      <TargetPreview
                                        adGroupName={
                                          item.values.AdvAdGroup.name
                                        }
                                        campaignName={
                                          item.values.AdvCampaign.name
                                        }
                                        targetingText={
                                          item.values.AdvTarget.targetingText
                                        }
                                      />
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <div className="flex flex-col">
                                      <span>
                                        Name:{' '}
                                        {item.selectedOption.data.campaign.name}{' '}
                                      </span>
                                      <span>
                                        Daily Budget:{' '}
                                        {currencyFormatter(
                                          item.selectedOption.data.campaign
                                            .dailyBudget
                                        )}{' '}
                                      </span>
                                      <span>
                                        Start Date:{' '}
                                        {
                                          item.selectedOption.data.campaign
                                            .startDate
                                        }
                                      </span>
                                      {item.selectedOption.data.campaign
                                        .endDate && (
                                        <span>
                                          End Date:{' '}
                                          {
                                            item.selectedOption.data.campaign
                                              .endDate
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <div className="flex flex-col">
                                      <span>
                                        Name:{' '}
                                        {item.selectedOption.data.adGroup.name}{' '}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <ul className="ml-4 list-disc">
                                      {item.selectedOption.data.productAds.map(
                                        (productAd) => {
                                          return (
                                            <li key={productAd.sku}>
                                              {' '}
                                              {productAd.sku}
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <ul className="ml-4 list-disc">
                                      {item.selectedOption.data.keywords.map(
                                        (keyword, keywordIdx) => {
                                          return (
                                            <li key={`keyword-${keywordIdx}`}>
                                              {keyword.keywordText} -{' '}
                                              {keyword.matchType} -{' '}
                                              {keyword.bid}
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    <ul className="ml-4 list-disc">
                                      {item.selectedOption.data.negativeKeywords.map(
                                        (keyword, keywordIdx) => {
                                          return (
                                            <li
                                              key={`negative-keyword-${keywordIdx}`}
                                            >
                                              {keyword.keywordText} -{' '}
                                              {keyword.matchType}
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.selectedOption.data
                                      .convertAsNegativeKeywordOn
                                      ? `Negative Exact on ${item.selectedOption.data.convertAsNegativeKeywordOn} level`
                                      : ''}
                                  </td>
                                  <td>
                                    <ChangeRequestStatus status={item.status} />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.evaluator
                                      ? `${item.evaluator.firstName} ${item.evaluator.lastName}`
                                      : ''}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                    {item.evaluatedAt
                                      ? moment(item.evaluatedAt).format(
                                          'MMMM Do YYYY, h:mm:ss a'
                                        )
                                      : ''}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {changeRequest.items.length === 0 && (
        <p className="mt-4 text-center text-gray-700 text-base font-medium">
          No Items
        </p>
      )}
    </>
  ) : null;
};

export default ChangeRequestItems;
