import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getInventoryAsync, selectInventory } from './inventorySlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../../accounts/accountsSlice';

import DatePicker from 'features/datePicker/DatePicker';
import { Card, Input } from 'components';
import Table from 'components/Table';

import { floatFormatter } from 'utils/formatter';
import { productNameFormatter } from 'utils/table';

const Inventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(selectInventory);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    include: 'details',
    sort: 'productName:asc',
  });

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

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search: search };
    setParams(newParams);
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
      dataField: 'details.fulfillableQuantity',
      text: 'Current',
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
    },
    {
      dataField: 'salesVelocity',
      text: 'Sales Velocity',
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
      formatter: (cell) => floatFormatter(cell),
    },
    {
      dataField: 'leadTime',
      text: 'Lead Time',
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
    },
    {
      dataField: 'outOfStock',
      text: 'Days Remaining',
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
    },
    {
      dataField: 'reorder',
      text: 'Reorder',
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
    },
  ];

  return (
    <>
      <Card className="mb-4">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4">
            <Input label="Search" onChangeInput={onSearch} />
          </div>

          <div className="col-span-12 sm:col-span-6 xl:col-span-4">
            <DatePicker />
          </div>
        </div>
      </Card>
      <Table
        keyField="inventoryItemId"
        columns={columns}
        data={inventory}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </>
  );
};

export default Inventory;
