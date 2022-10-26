import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';

import {
  STATUS_OPTIONS,
  SORT_BY_COST,
  LESS_THAN,
  TARGETS,
  EQUAL_TO,
} from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import TargetPreview from './components/TargetPreview';
import AdvertisingTable from '../components/AdvertisingTable';

import { currencyFormatter } from 'utils/formatters';
import { metricColumns, statusColumn } from '../utils/columns';

const Targets = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const selectedDates = useSelector(selectCurrentDateRange);

  const [targets, setTargets] = useState({ rows: [] });
  const [selectedIds, setSelectedIds] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState(
    localStorage.getItem('targets-list-column') ??
      'advTargetId,targetingText,bid,state,cost,sales,orders'
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advTargetId,targetingText,state,bid,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas',
    sort: SORT_BY_COST,
    include: ['adGroup', 'previousData'],
  });

  useEffect(() => {
    axios
      .get('/advertising/targets', {
        params: { ...params, ...selectedDates, accountId, marketplace },
      })
      .then((response) => setTargets(response.data.data));
  }, [accountId, marketplace, selectedDates, params]);

  const columns = [
    {
      auto: true,
      default: true,
      category: 'settings',
      dataField: 'targetingText',
      text: t('Advertising.Target.Expression'),
      sort: true,
      headerStyle: { minWidth: '120px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell, row) => (
        <TargetPreview
          targetingText={cell}
          adGroupName={row.AdvAdGroup.name}
          campaignName={row.AdvAdGroup.AdvCampaign.name}
        />
      ),
    },
    {
      dataField: 'bid',
      category: 'settings',
      text: t('Advertising.Target.Bid'),
      sort: true,
      headerStyle: { minWidth: '120px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell) => currencyFormatter(cell),
      hideable: true,
    },
    statusColumn(),
    ...metricColumns(),
  ];

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    localStorage.setItem('targets-list-column', newColumns);
    setVisibleColumns(newColumns);
  };

  const statusOptions = STATUS_OPTIONS.map((value) => {
    const display = t(`Advertising.Common.Filter.Status.${upperFirst(value)}`);
    return { display, value };
  });

  return (
    <div id={TARGETS}>
      <AdvertisingTable
        params={params}
        list={targets}
        columns={columns}
        accountId={accountId}
        recordType={TARGETS}
        keyField="advTargetId"
        marketplace={marketplace}
        campaignType={campaignType}
        selectedIds={selectedIds}
        onChangeParams={onUpdateParams}
        onChangeSelectedIds={setSelectedIds}
        searchClassName="lg:col-span-6"
        filtersClassName="lg:col-span-4"
        exportClassName="lg:col-span-2"
        searchPlaceholder={t('Advertising.Target.Filter.Expression')}
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
            display: t('Advertising.Target.Bid'),
            comparison: LESS_THAN,
            value: '',
          },
        ]}
      />
    </div>
  );
};

export default Targets;
