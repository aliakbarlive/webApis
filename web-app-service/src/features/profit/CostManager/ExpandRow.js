import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import Moment from 'react-moment';

import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';

import { currencyFormatter } from 'utils/formatter';

import {
  selectProductCosts,
  getProductCostsAsync,
  deleteProductCostAsync,
  setSelectedProductCost,
  selectSelectedProductCost,
} from './costManagerSlice';

import { Table, ConfirmationModal } from 'components';
import CostSlideOver from './CostSlideOver';

const ExpandRow = ({ inventoryItemId, row }) => {
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
      'Since Product Launch'
    ) : cell >= '3000-01-01T00:00:00.000Z' ? (
      'Present'
    ) : (
      <Moment format="LL">{moment.utc(cell)}</Moment>
    );
  };

  const columns = [
    {
      dataField: 'cogsAmount',
      text: 'Cost of Goods Per Unit',
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'shippingAmount',
      text: 'Shipping Per Unit',
      headerStyle: {
        minWidth: '50px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'miscAmount',
      text: 'Misc cost Per Unit',
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) =>
        cell ? currencyFormatter(cell) : currencyFormatter(0),
    },
    {
      dataField: 'startDate',
      text: 'Start Date',
      headerStyle: {
        minWidth: '130px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'endDate',
      text: 'End Date',
      headerStyle: {
        minWidth: '130px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'Actions',
      text: 'Actions',
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
        title="Do you want to delete this Record ?"
        content=""
        open={isOpenDelete}
        setOpen={setIsOpenDelete}
        onOkClick={onConfirmDelete}
        onCancelClick={() => setIsOpenDelete(false)}
      />

      <div className="flex items-center mb-4 px-4 2xl:justify-between">
        <h4 className="text-lg font-medium text-gray-900">Cost History</h4>
        <button
          onClick={() => setCostSlideOver(true)}
          className="ml-4 justify-center py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add Cost
        </button>
      </div>

      <Table
        columns={columns}
        data={productCosts}
        page={params.page}
        pageSize={params.pageSize}
        keyField="productCostId"
      />
    </div>
  );
};

export default ExpandRow;
