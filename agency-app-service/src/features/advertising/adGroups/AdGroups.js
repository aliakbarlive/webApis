import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';

import {
  STATUS_OPTIONS,
  SORT_BY_COST,
  AD_GROUPS,
  LESS_THAN,
  EQUAL_TO,
} from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  selectList as selectCampaigns,
  getCampaignListAsync,
} from '../campaigns/campaignSlice';

import {
  getAdGroupListAsync,
  selectList,
  setColumns,
  selectColumns,
} from './adGroupSlice';

import { metricColumns, statusColumn } from '../utils/columns';
import { currencyFormatter } from 'utils/formatters';

import AdvertisingTable from '../components/AdvertisingTable';

const AdGroups = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const adGroups = useSelector(selectList);
  const campaigns = useSelector(selectCampaigns);
  const visibleColumns = useSelector(selectColumns);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes: `advCampaignId,advAdGroupId,name,state,defaultBid,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas`,
    include: ['previousData', 'campaign'],
    sort: SORT_BY_COST,
  });

  useEffect(() => {
    dispatch(
      getAdGroupListAsync({
        ...params,
        ...selectedDates,
        accountId,
        marketplace,
      })
    );
  }, [dispatch, accountId, marketplace, selectedDates, params]);

  useEffect(() => {
    dispatch(
      getCampaignListAsync({
        campaignType,
        pageSize: 10000,
        accountId,
        marketplace,
      })
    );
  }, [dispatch, accountId, marketplace, campaignType]);

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    dispatch(setColumns(newColumns));
  };

  const columns = [
    {
      dataField: 'name',
      auto: true,
      default: true,
      category: 'settings',
      text: t('Advertising.AdGroup.Name'),
      sort: true,
      headerStyle: { minWidth: '150px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell, row) => {
        return (
          <div className="flex flex-col">
            <span>{cell}</span>
            <span className="text-xs text-gray-400">
              {t('Advertising.Campaign')}:{' '}
              {row.AdvCampaign ? row.AdvCampaign.name : ''}
            </span>
          </div>
        );
      },
    },
    statusColumn(),
    {
      dataField: 'defaultBid',
      hideable: true,
      category: 'settings',
      text: t('Advertising.AdGroup.Bid'),
      sort: true,
      headerStyle: { minWidth: '100px' },
      formatter: (cell) => currencyFormatter(cell),
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
    },
    ...metricColumns(),
  ];

  const statusOptions = STATUS_OPTIONS.map((value) => {
    const display = t(`Advertising.Common.Filter.Status.${upperFirst(value)}`);
    return { display, value };
  });

  return (
    <div id={AD_GROUPS}>
      <AdvertisingTable
        params={params}
        list={adGroups}
        campaignOptions={campaigns.rows.map((c) => {
          return { value: c.advCampaignId, display: c.name };
        })}
        columns={columns}
        accountId={accountId}
        recordType={AD_GROUPS}
        keyField="advAdGroupId"
        marketplace={marketplace}
        campaignType={campaignType}
        onChangeParams={onUpdateParams}
        searchClassName="lg:col-span-3"
        filterCampaignClassName="lg:col-span-3"
        filtersClassName="lg:col-span-4"
        exportClassName="lg:col-span-2"
        searchPlaceholder={t('Advertising.AdGroup.Filter.Name')}
        filterCampaignPlaceholder={t('Advertising.AdGroup.Filter.Campaign')}
        attributesKey={`${accountId}-${campaignType}-${AD_GROUPS}`}
        visibleColumns={visibleColumns}
        onChangeVisibleColumns={onChangeVisibleColumns}
        additionalFilters={[
          {
            attribute: 'state',
            display: t('Advertising.Common.Status'),
            comparison: EQUAL_TO,
            value: '',
            options: statusOptions,
            placeholder: t('Advertising.Common.Filter.Status'),
          },
          {
            attribute: 'defaultBid',
            display: t('Advertising.AdGroup.Bid'),
            comparison: LESS_THAN,
            value: '',
          },
        ]}
      />
    </div>
  );
};

export default AdGroups;
