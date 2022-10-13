import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { selectProducts, getProductsAsync } from '../advertisingSlice';
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
import { productNameFormatter } from 'utils/table';

const Products = ({ campaignType, customAttributes }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const targets = useSelector(selectProducts);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'asin,sku,clicks,impressions,cost,attributedUnitsOrdered30d,attributedSales30d,cr,acos,cpc,ctr',
  });

  useEffect(() => {
    dispatch(
      getProductsAsync({
        ...params,
        ...selectedDates,
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
      })
    );
  }, [dispatch, account, marketplace, selectedDates, params]);

  const columns = [
    {
      dataField: 'Product.listings.title',
      text: 'Product',
      sort: true,
      headerStyle: {
        minWidth: '390px',
      },
      formatter: (cell, row) =>
        productNameFormatter(cell, {
          ...row,
          productName: row['Product.listings.title'],
          sellerSku: row.sku,
          thumbnail: row['Product.listings.thumbnail'],
        }),
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
            placeholder="Search asin or sku"
          />
        </div>

        <MetricsFilter onApplyFilter={setParams} params={params} />

        <ExportButton recordType="productAd" params={params} />
      </div>

      <Table
        keyField="sku"
        columns={columns}
        data={targets}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </div>
  );
};

export default Products;
