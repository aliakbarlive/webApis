import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';
import moment from 'moment-timezone';

import {
  getInventoryAsync,
  selectInventory,
} from 'features/products/inventory/inventorySlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { Card, Table, Input } from 'components';
import ExpandRow from './ExpandRow';

import { currencyFormatter } from 'utils/formatter';
import { productNameFormatter } from 'utils/table';
import classNames from 'utils/classNames';

const CostManager = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    include: 'costs',
    sort: 'productName:asc',
  });

  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const inventory = useSelector(selectInventory);

  useEffect(() => {
    dispatch(getInventoryAsync(params));
  }, [dispatch, account, marketplace, params]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const expandRow = {
    renderer: (row) => (
      <ExpandRow inventoryItemId={row.inventoryItemId} row={row} />
    ),
    onlyOneExpanding: true,
    showExpandColumn: true,
    expandHeaderColumnRenderer: () => {
      return '';
    },
    expandColumnRenderer: ({ expanded }) => {
      return (
        <span className="pl-4 flex items-center">
          <ChevronDownIcon
            className={classNames(
              expanded ? '-rotate-180' : 'rotate-0',
              'h-6 w-6 transform'
            )}
            aria-hidden="true"
          />
        </span>
      );
    },
  };

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search: search };
    setParams(newParams);
  };

  const dateFormatter = (cell) => {
    return cell ? (
      cell === '0001-01-01T00:00:00.000Z' ? (
        'Since Product Launch'
      ) : cell >= '8999-12-30T00:00:00.000Z' ? (
        'Present'
      ) : (
        <Moment format="LL">{moment.utc(cell)}</Moment>
      )
    ) : (
      ''
    );
  };

  const columns = [
    {
      dataField: 'productName',
      text: 'Product',
      sort: true,
      headerStyle: {
        minWidth: '390px',
      },
      formatter: (cell, row) => {
        return productNameFormatter(cell, {
          productName: cell,
          asin: row.asin,
          sellerSku: row.sellerSku,
          thumbnail: row.Listing.thumbnail,
        });
      },
    },
    {
      dataField: 'cogsAmount',
      text: 'Product Cost',
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'shippingAmount',
      text: 'Shipping Cost',
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'miscAmount',
      text: 'Misc Cost',
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'totalAmount',
      text: 'Total Cost',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'startDate',
      text: 'Start Date',
      sort: true,
      headerStyle: {
        minWidth: '145px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'endDate',
      text: 'End Date',
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
      formatter: dateFormatter,
    },
  ];

  return (
    <>
      <Card className="mb-8" flex>
        <Input
          label="Search"
          placeholder="Name, ASINs, or SKUs"
          onChangeInput={onSearch}
          className="ml-4"
        />
      </Card>

      <Table
        columns={columns}
        data={inventory}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
        keyField="inventoryItemId"
        expandRow={expandRow}
      />
    </>
  );
};

export default CostManager;
