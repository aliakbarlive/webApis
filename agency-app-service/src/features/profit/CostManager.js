import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';

import {
  getInventoryAsync,
  selectInventory,
} from 'features/products/inventory/inventorySlice';

import { Card, Table, Input } from 'components';

import { currencyFormatter } from 'utils/formatters';
import { productNameFormatter } from 'utils/table';
import classNames from 'utils/classNames';

import ExpandRow from './components/ExpandRow';

const CostManager = ({ account, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    include: 'costs',
    sort: 'productName:asc',
  });

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

  const dateFormatter = (cell) => {
    return cell ? (
      cell === '1900-01-01T00:00:00.000Z' ? (
        t('CostManager.SinceProductLaunch')
      ) : cell >= '3000-01-01T00:00:00.000Z' ? (
        t('CostManager.Present')
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
      text: t('CostManager.Product'),
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
      text: t('CostManager.ProductCost'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'shippingAmount',
      text: t('CostManager.ShippingCost'),
      sort: true,
      headerStyle: {
        minWidth: '170px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'miscAmount',
      text: t('CostManager.MiscCost'),
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'totalAmount',
      text: t('CostManager.TotalCost'),
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'costStartDate',
      text: t('CostManager.StartDate'),
      sort: true,
      headerStyle: {
        minWidth: '145px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'costEndDate',
      text: t('CostManager.EndDate'),
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
      formatter: dateFormatter,
    },
  ];

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search: search };
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

  return (
    <>
      <Card className="mb-8" flex>
        <Input
          label={t('CostManager.Search')}
          placeholder={t('CostManager.SearchPlaceHolder')}
          onChangeInput={onSearch}
          className="ml-4"
        />
      </Card>
      <Table
        columns={columns}
        data={inventory}
        onTableChange={onTableChange}
        params={params}
        keyField="inventoryItemId"
        expandRow={expandRow}
      />
    </>
  );
};

export default CostManager;
