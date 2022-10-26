import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';
import axios from 'axios';

import {
  STATUS_OPTIONS,
  SORT_BY_COST,
  KEYWORDS,
  LESS_THAN,
  EQUAL_TO,
} from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import KeywordPreview from './components/KeywordPreview';
import AdvertisingTable from '../components/AdvertisingTable';

import { currencyFormatter } from 'utils/formatters';
import { metricColumns, statusColumn } from '../utils/columns';

const Keywords = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();

  const selectedDates = useSelector(selectCurrentDateRange);

  const [keywords, setKeywords] = useState({ rows: [] });
  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    localStorage.getItem('keywords-list-column') ??
      'advKeywordId,keywordText,matchType,state,cost,sales,orders'
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advKeywordId,advAdGroupId,keywordText,matchType,state,bid,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas',
    sort: SORT_BY_COST,
    include: ['previousData', 'adGroup'],
  });

  useEffect(() => {
    axios
      .get('/advertising/keywords', {
        params: { ...params, ...selectedDates, accountId, marketplace },
      })
      .then((response) => setKeywords(response.data.data));
  }, [accountId, marketplace, selectedDates, params]);

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    localStorage.setItem('keywords-list-column', newColumns);
    setVisibleColumns(newColumns);
  };

  const columns = [
    {
      auto: true,
      default: true,
      category: 'settings',
      dataField: 'keywordText',
      text: t('Advertising.Keyword.Text'),
      sort: true,
      headerStyle: { minWidth: '200px' },
      formatter: (cell, row) => {
        return (
          <KeywordPreview
            adGroupName={row.AdvAdGroup.name}
            campaignName={row.AdvAdGroup.AdvCampaign.name}
            keywordId={row.advKeywordId}
            keywordText={cell}
            matchType={row.matchType}
            showProducts={false}
          />
        );
      },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
    },
    statusColumn(),
    {
      hideable: true,
      category: 'settings',
      dataField: 'bid',
      text: t('Advertising.Keyword.Bid'),
      sort: true,
      headerStyle: { minWidth: '120px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell) => currencyFormatter(cell),
    },
    ...metricColumns(),
  ];

  const statusOptions = STATUS_OPTIONS.map((value) => {
    const display = t(`Advertising.Common.Filter.Status.${upperFirst(value)}`);
    return { display, value };
  });

  return (
    <div id={KEYWORDS}>
      <AdvertisingTable
        params={params}
        list={keywords}
        columns={columns}
        accountId={accountId}
        recordType={KEYWORDS}
        keyField="advKeywordId"
        marketplace={marketplace}
        campaignType={campaignType}
        selectedIds={selectedIds}
        onChangeParams={onUpdateParams}
        onChangeSelectedIds={setSelectedIds}
        searchClassName="lg:col-span-6"
        filtersClassName="lg:col-span-4"
        exportClassName="lg:col-span-2"
        searchPlaceholder={t('Advertising.Keyword.Filter.Keyword')}
        onChangeVisibleColumns={onChangeVisibleColumns}
        visibleColumns={visibleColumns}
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
            attribute: 'bid',
            display: t('Advertising.Keyword.Bid'),
            comparison: LESS_THAN,
            value: '',
          },
        ]}
      />
    </div>
  );
};

export default Keywords;
