import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { selectCampaigns, getCampaignsAsync } from '../advertisingSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import Table from 'components/Table';
import SearchBar from './SearchBar';
import SelectFilter from './SelectFilter';
import MetricsFilter from './MetricsFilter';
import ExportButton from './ExportButton';

import {
  stateFormatter,
  numberFormatter,
  currencyFormatter,
  percentageFormatter,
} from 'utils/formatter';

const Campaigns = ({ campaignType, customAttributes }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const campaigns = useSelector(selectCampaigns);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advCampaignId,name,targetingType,dailyBudget,budget,state,clicks,impressions,cost,cr,acos,attributedSales30d,attributedSales14d,attributedUnitsOrdered30d,attributedUnitsOrdered14d,cpc,ctr',
  });

  useEffect(() => {
    dispatch(
      getCampaignsAsync({
        ...params,
        ...selectedDates,
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
      })
    );
  }, [dispatch, account, marketplace, selectedDates, params]);

  const columns = [
    {
      dataField: 'name',
      text: 'Campaign',
      sort: true,
      headerStyle: {
        minWidth: '275px',
      },
      formatter: (cell, row) => (
        <NavLink
          className="hover:text-red-500"
          to={`/advertising/${customAttributes.subPath}/campaigns/${row.advCampaignId}`}
        >
          {cell}
        </NavLink>
      ),
    },
    {
      dataField: 'targetingType',
      text: 'Targeting',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      headerClasses:
        campaignType === 'sponsoredProducts'
          ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          : 'hidden',
      classes:
        campaignType === 'sponsoredProducts'
          ? 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500'
          : 'hidden',
    },
    {
      dataField: customAttributes.budget,
      text: 'Budget',
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell, row) => stateFormatter(cell),
    },
    {
      dataField: 'cost',
      text: 'Spend',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: customAttributes.sales,
      text: 'Sales',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      text: 'ACoS',
      dataField: 'acos',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      dataField: 'impressions',
      text: 'Impressions',
      sort: true,
      headerStyle: {
        minWidth: '155px',
      },
      formatter: (cell, row) => numberFormatter(cell),
    },
    {
      dataField: 'clicks',
      text: 'Clicks',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell, row) => numberFormatter(cell),
    },
    {
      text: 'CPC',
      dataField: 'cpc',
      sort: true,
      headerStyle: {
        minWidth: '100px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      text: 'CTR',
      dataField: 'ctr',
      sort: true,
      headerStyle: {
        minWidth: '100px',
      },
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      text: 'CR',
      dataField: 'cr',
      sort: true,
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      dataField: customAttributes.orders,
      text: 'Orders',
      sort: true,
      headerStyle: {
        minWidth: '125px',
      },
    },
  ];

  // Handle table change.
  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    setParams(newParams);
  };

  return (
    <div className="my-4">
      <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div
          className={`col-span-${
            campaignType === 'sponsoredProducts' ? '1' : '2'
          }`}
        >
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search name"
          />
        </div>

        <div className={campaignType === 'sponsoredProducts' ? '' : 'hidden'}>
          <SelectFilter
            name="targetingType"
            placeholder="All Targeting Type"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'auto', display: 'Auto' },
              { value: 'manual', display: 'Manual' },
            ]}
          />
        </div>

        <SelectFilter
          name="state"
          placeholder="All Status"
          onApplyFilter={setParams}
          params={params}
          options={[
            { value: 'enabled', display: 'Enabled' },
            { value: 'paused', display: 'Paused' },
            { value: 'archived', display: 'Archived' },
          ]}
        />

        <MetricsFilter onApplyFilter={setParams} params={params} />

        <ExportButton recordType="campaign" params={params} />
      </div>
      <Table
        keyField="advCampaignId"
        columns={columns}
        data={campaigns}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default Campaigns;
