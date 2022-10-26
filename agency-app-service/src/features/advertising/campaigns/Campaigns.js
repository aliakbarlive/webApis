import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  SPONSORED_PRODUCTS,
  CUSTOM_ATTRIBUTES,
  STATUS_OPTIONS,
  SORT_BY_COST,
  CAMPAIGNS,
  LESS_THAN,
  EQUAL_TO,
} from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  selectList,
  selectColumns,
  setColumns,
  getCampaignListAsync,
} from './campaignSlice';

import CampaignBudgetEditor from '../components/forms/CampaignBudgetEditor';
import AdvertisingTable from '../components/AdvertisingTable';
import ApplyRecoBudget from './components/ApplyRecoBudget';

import { metricColumns, statusColumn } from '../utils/columns';
import { upperFirst } from 'lodash';

const Campaigns = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const campaigns = useSelector(selectList);
  const visibleColumns = useSelector(selectColumns);
  const selectedDates = useSelector(selectCurrentDateRange);

  const customAttributes = CUSTOM_ATTRIBUTES[campaignType];
  const [selected, setSelected] = useState([]);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advCampaignId,state,name,campaignType,budget,advPortfolioId,bidding,startDate,endDate,budget,dailyBudget,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas',
    include: ['previousData', 'budgetRecommendation', 'portfolio'],
    sort: SORT_BY_COST,
  });

  useEffect(() => {
    dispatch(
      getCampaignListAsync({
        accountId,
        marketplace,
        ...selectedDates,
        ...params,
      })
    );
  }, [dispatch, accountId, marketplace, selectedDates, params]);

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    dispatch(setColumns(newColumns));
  };

  const columns = [
    {
      sort: true,
      auto: true,
      default: true,
      dataField: 'name',
      category: 'settings',
      text: t('Advertising.Campaign.Name'),
      headerStyle: { minWidth: '275px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
    },
    {
      sort: true,
      default: true,
      hideable: true,
      dataField: 'startDate',
      category: 'settings',
      text: 'Start Date',
      headerStyle: { minWidth: '150px' },
    },
    {
      sort: true,
      default: true,
      hideable: true,
      dataField: 'endDate',
      category: 'settings',
      text: 'End Date',
      headerStyle: { minWidth: '150px' },
      formatter: (cell) => cell ?? 'No end date',
    },
    statusColumn(),
    {
      sort: false,
      hideable: true,
      text: 'Bidding',
      category: 'settings',
      dataField: 'bidding',
      headerStyle: { minWidth: '150px' },
      formatter: (bidding) => {
        if (!bidding) return '';
        switch (bidding.strategy) {
          case 'legacyForSales':
            return 'Dynamic bids - down only';
          case 'autoForSales':
            return 'Dynamic bids - up and down';
          case 'manual':
            return 'Fixed bid';
          default:
            return '-';
        }
      },
    },
    {
      dataField: 'budget',
      text: t('Advertising.Campaign.Budget'),
      sort: true,
      headerStyle: { minWidth: '150px' },
      formatter: (cell, row) => (
        <CampaignBudgetEditor
          accountId={accountId}
          marketplace={marketplace}
          campaignId={row.advCampaignId}
          currentBudget={cell}
          editable={campaignType === SPONSORED_PRODUCTS}
          recommendedBudget={row.budgetRecommendation}
          onSuccess={() => {
            dispatch(
              getCampaignListAsync({
                accountId,
                marketplace,
                ...selectedDates,
                ...params,
              })
            );
          }}
        />
      ),
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      hideable: true,
      category: 'settings',
    },
    ...metricColumns(),
  ];

  const statusOptions = STATUS_OPTIONS.map((value) => {
    const display = t(`Advertising.Common.Filter.Status.${upperFirst(value)}`);
    return { display, value };
  });

  let additionalFilters = [
    {
      attribute: 'state',
      display: t('Advertising.Common.Status'),
      comparison: EQUAL_TO,
      value: '',
      options: statusOptions,
      placeholder: t('Advertising.Common.Filter.Status'),
    },
    {
      attribute: customAttributes.budget,
      display: t('Advertising.Campaign.Budget'),
      comparison: LESS_THAN,
      value: '',
    },
  ];

  if (campaignType === SPONSORED_PRODUCTS) {
    additionalFilters.unshift({
      attribute: 'targetingType',
      display: t('Advertising.Campaign.Targeting'),
      comparison: EQUAL_TO,
      value: '',
      placeholder: t('Advertising.Campaign.Filter.TargetingType'),
      options: [
        {
          value: 'auto',
          display: t('Advertising.Campaign.Filter.TargetingType.Auto'),
        },
        {
          value: 'manual',
          display: t('Advertising.Campaign.Filter.TargetingType.Manual'),
        },
      ],
    });

    additionalFilters.unshift({
      attribute: 'scope',
      display: 'Scopes',
      comparison: EQUAL_TO,
      order: 0,
      value: '',
      options: [
        {
          display: 'With Budget Recommendation',
          value: 'withBudgetRecommendation',
        },
      ],
    });
  }

  const refreshList = () => {
    dispatch(
      getCampaignListAsync({
        accountId,
        marketplace,
        ...selectedDates,
        ...params,
      })
    );
  };

  const selectRow = {
    mode: 'checkbox',
    headerColumnStyle: () => {
      return { padding: '0.5rem' };
    },
    nonSelectable: campaigns.rows
      .filter((campaign) => !campaign.budgetRecommendation)
      .map((campaign) => campaign.advCampaignId),
    selected: selected.map((campaign) => campaign.advCampaignId),
    onSelect: (row, isSelect) => {
      isSelect
        ? setSelected([...selected, row])
        : setSelected(
            selected.filter(
              (campaign) => campaign.advCampaignId !== row.advCampaignId
            )
          );
    },
    onSelectAll: (isSelect, rows) => {
      isSelect
        ? setSelected([
            ...selected,
            ...rows.filter(
              (row) =>
                !selected.find((s) => s.advCampaignId === row.advCampaignId)
            ),
          ])
        : setSelected(
            selected.filter(
              (campaign) =>
                !rows.find(
                  (row) => row.advCampaignId === campaign.advCampaignId
                )
            )
          );
    },
  };

  let tableProps = {
    params: params,
    list: campaigns,
    columns: columns,
    accountId: accountId,
    recordType: CAMPAIGNS,
    keyField: 'advCampaignId',
    marketplace: marketplace,
    campaignType: campaignType,
    onChangeParams: onUpdateParams,
    additionalFilters: additionalFilters,
    searchClassName: 'col-span-12 lg:col-span-3 xl:col-span-5',
    filtersClassName: 'col-span-6 lg:col-span-3 xl:col-span-2',
    exportClassName: 'col-span-6 lg:col-span-3 xl:col-span-3',
    searchPlaceholder: t('Advertising.Campaign.Filter.Name'),
    attributesKey: `${accountId}-${campaignType}-${CAMPAIGNS}`,
    visibleColumns,
    onChangeVisibleColumns,
  };

  if (campaignType === SPONSORED_PRODUCTS) {
    tableProps.selectRow = selectRow;
  }

  return (
    <div id={CAMPAIGNS}>
      <AdvertisingTable {...tableProps}>
        <ApplyRecoBudget
          accountId={accountId}
          marketplace={marketplace}
          campaignType={campaignType}
          campaigns={selected}
          onSuccess={refreshList}
        />
      </AdvertisingTable>
    </div>
  );
};

export default Campaigns;
