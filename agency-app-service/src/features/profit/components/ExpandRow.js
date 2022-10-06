import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';

import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';

import { currencyFormatter } from 'utils/formatters';

import {
  selectProductCosts,
  getProductCostsAsync,
  deleteProductCostAsync,
  setSelectedProductCost,
  selectSelectedProductCost,
} from '../costManagerSlice';

import { Table, ConfirmationModal } from 'components';
import CostSlideOver from './CostSlideOver';

const ExpandRow = ({ inventoryItemId, row }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const productCosts = useSelector(selectProductCosts);
  const selectedProductCost = useSelector(selectSelectedProductCost);
  const [costSlideOver, setCostSlideOver] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [params] = useState({
    page: 1,
    pageSize: 100,
  });

  useEffect(() => {
    dispatch(getProductCostsAsync(inventoryItemId, params));
  }, [dispatch, inventoryItemId, params]);

  const onEditClick = async (cost) => {
    await dispatch(setSelectedProductCost(cost));
    setCostSlideOver(true);
  };

  const onDeleteClick = async (cost) => {
    await dispatch(setSelectedProductCost(cost));
    setIsOpenDelete(true);
  };

  const onConfirmDelete = async () => {
    const { inventoryItemId, productCostId } = selectedProductCost;
    await dispatch(deleteProductCostAsync(inventoryItemId, productCostId));
    await dispatch(getProductCostsAsync(inventoryItemId, params));
    await dispatch(setSelectedProductCost({}));
    setIsOpenDelete(false);
  };

  const dateFormatter = (cell) => {
    return cell <= '1900-01-01T00:00:00.000Z' ? (
      t('CostManager.SinceProductLaunch')
    ) : cell >= '3000-01-01T00:00:00.000Z' ? (
      t('CostManager.Present')
    ) : (
      <Moment format="LL">{moment.utc(cell)}</Moment>
    );
  };

  const columns = [
    {
      dataField: 'cogsAmount',
      text: t('CostManager.CostOfGoodsPerUnit'),
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'shippingAmount',
      text: t('CostManager.ShippingPerUnit'),
      headerStyle: {
        minWidth: '50px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'miscAmount',
      text: t('CostManager.MiscCostPerUnit'),
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'startDate',
      text: t('CostManager.StartDate'),
      headerStyle: {
        minWidth: '130px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'endDate',
      text: t('CostManager.EndDate'),
      headerStyle: {
        minWidth: '130px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'Actions',
      text: t('CostManager.Actions'),
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell, row) => (
        <div className="flex">
          <button onClick={() => onEditClick(row)}>
            <PencilAltIcon className="h-5 w-5 mx-1" />
          </button>
          <button onClick={() => onDeleteClick(row)}>
            <TrashIcon className="h-5 w-5 mx-1" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-4">
      <CostSlideOver
        open={costSlideOver}
        setOpen={setCostSlideOver}
        inventory={row}
      />

      <ConfirmationModal
        title={t('CostManager.ConfirmDeleteRecord')}
        content=""
        open={isOpenDelete}
        setOpen={setIsOpenDelete}
        onOkClick={onConfirmDelete}
        onCancelClick={() => setIsOpenDelete(false)}
      />

      <div className="flex items-center mb-4 px-4 2xl:justify-between">
        <h4 className="text-lg font-medium text-gray-900">
          {t('CostManager.CostHistory')}
        </h4>
        <button
          onClick={() => setCostSlideOver(true)}
          className="ml-4 justify-center py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('CostManager.AddCost')}
        </button>
      </div>

      <Table
        columns={columns}
        data={productCosts}
        params={params}
        keyField="productCostId"
      />
    </div>
  );
};

export default ExpandRow;
