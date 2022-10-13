import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { selectTargets, getTargetsAsync } from '../advertisingSlice';
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

const Targets = ({ campaignType, customAttributes }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const targets = useSelector(selectTargets);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advTargetId,targetingText,clicks,impressions,cost,attributedSales30d,attributedSales14d,attributedUnitsOrdered30d,attributedUnitsOrdered14d,cr,acos,cpc,ctr,state,bid',
  });

  useEffect(() => {
    dispatch(
      getTargetsAsync({
        ...params,
        ...selectedDates,
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
      })
    );
  }, [dispatch, account, marketplace, selectedDates, params]);

  const columns = [
    {
      dataField: 'targetingText',
      text: 'Target',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => stateFormatter(cell),
    },
    {
      dataField: 'bid',
      text: 'Bid',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'cost',
      text: 'Spend',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: customAttributes.sales,
      text: 'Sales',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      text: 'ACoS',
      dataField: 'acos',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => percentageFormatter(cell),
    },
    {
      dataField: 'impressions',
      text: 'Impressions',
      sort: true,
      headerStyle: {
        minWidth: '155px',
      },
      formatter: (cell) => numberFormatter(cell),
    },
    {
      dataField: 'clicks',
      text: 'Clicks',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => numberFormatter(cell),
    },
    {
      text: 'CPC',
      dataField: 'cpc',
      sort: true,
      headerStyle: {
        minWidth: '100px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },

    {
      text: 'CTR',
      dataField: 'ctr',
      sort: true,
      headerStyle: {
        minWidth: '100px',
      },
      formatter: (cell) => percentageFormatter(cell),
    },
    {
      text: 'CR',
      dataField: 'cr',
      sort: true,
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell) => percentageFormatter(cell),
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
        <div className="col-span-1 lg:col-span-2">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search expression"
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

        <ExportButton recordType="target" params={params} />
      </div>
      <Table
        keyField="advTargetId"
        columns={columns}
        data={targets}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default Targets;
