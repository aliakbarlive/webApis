import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { selectSearchTerms, getSearchTermsAsync } from '../advertisingSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import Table from 'components/Table';
import SearchBar from './SearchBar';
import MetricsFilter from './MetricsFilter';
import ExportButton from './ExportButton';

import {
  numberFormatter,
  currencyFormatter,
  percentageFormatter,
} from 'utils/formatter';

const SearchTerms = ({ campaignType, customAttributes }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const searchTerms = useSelector(selectSearchTerms);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advSearchTermId,query,clicks,impressions,cost,attributedUnitsOrdered30d,attributedSales30d,cr,acos,cpc,ctr',
  });

  useEffect(() => {
    dispatch(
      getSearchTermsAsync({
        ...params,
        ...selectedDates,
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
      })
    );
  }, [dispatch, account, marketplace, selectedDates, params]);

  const columns = [
    {
      dataField: 'query',
      text: 'Query',
      sort: true,
      headerStyle: {
        minWidth: '200px',
      },
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
        <div className="col-span-1 lg:col-span-3">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search query"
          />
        </div>

        <MetricsFilter onApplyFilter={setParams} params={params} />

        <ExportButton recordType="searchTerm" params={params} />
      </div>

      <Table
        keyField="advSearchTermId"
        columns={columns}
        data={searchTerms}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default SearchTerms;
