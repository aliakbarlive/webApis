import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { InformationCircleIcon, PencilIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';

import { setAlert } from '../../alerts/alertsSlice';
import {
  getInventoryAsync,
  selectInventory,
  updateInventoryAsync,
} from './inventorySlice';

import DatePicker from 'features/datePicker/DatePicker';
import Input from 'components/Forms/Input';
import Table from 'components/Table';

import { floatFormatter } from 'utils/formatters';
import ProductPreview from 'components/ProductPreview';

const Inventory = ({ account, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inventory = useSelector(selectInventory);
  const [openLeadTime, setOpenLeadTime] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    include: 'details',
    sort: 'productName:asc',
  });

  useEffect(() => {
    dispatch(getInventoryAsync(params));
  }, [dispatch, account, marketplace, params]);

  const valWithTooltipFormatter = (cell, id, data) => (
    <div className="flex">
      {cell}
      <button data-tip data-for={id}>
        <InformationCircleIcon className="ml-2 mt-1 h-4 w-4" />
      </button>
      <ReactTooltip
        id={id}
        place="top"
        className="max-w-xs text-black"
        backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
        textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
      >
        <ul>
          {Object.keys(data).map((key) => (
            <li key={key}>
              {t(`Products.Inventory.${key}`)} : {data[key]}
            </li>
          ))}
        </ul>
      </ReactTooltip>
    </div>
  );

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

  const onChangeLeadTime = (leadTime) => {
    let newSelectedRow = { ...selectedRow, leadTime };
    setSelectedRow(newSelectedRow);
  };

  const onUpdate = async () => {
    await dispatch(updateInventoryAsync(selectedRow));
    await dispatch(getInventoryAsync(params));
    setOpenLeadTime(false);
    dispatch(setAlert('success', t('Products.Inventory.LeadTimeUpdated')));
  };

  const columns = [
    {
      dataField: 'productName',
      text: t('Products.Inventory.Product'),
      headerStyle: {
        minWidth: '390px',
      },
      sort: true,
      formatter: (cell, row) => (
        <ProductPreview
          productName={cell}
          asin={row.asin}
          sku={row.sellerSku}
          imageUrl={row.Listing.thumbnail}
        />
      ),
    },
    {
      dataField: 'details.fulfillableQuantity',
      text: t('Products.Inventory.Current'),
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell, row) =>
        valWithTooltipFormatter(
          cell,
          `${row.inventoryItemId}-current`,
          row.details.reservedQuantity
        ),
    },
    {
      dataField: 'details.inboundReceivingQuantity',
      text: t('Products.Inventory.Incoming'),
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell, row) =>
        valWithTooltipFormatter(
          cell,
          `${row.inventoryItemId}-incoming`,
          row.details.futureSupplyQuantity
        ),
    },
    {
      dataField: 'salesVelocity',
      text: t('Products.Inventory.SalesVelocity'),
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
      formatter: (cell) => floatFormatter(cell),
    },
    {
      dataField: 'leadTime',
      text: t('Products.Inventory.LeadTime'),
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
      style: { cursor: 'pointer' },
      events: {
        onClick: (e, column, columnIndex, row) => {
          setSelectedRow(row);
          setOpenLeadTime(true);
        },
      },
      formatter: (cell) => {
        return (
          <div className="flex">
            <p className="text-gray-700">{cell}</p>
            <PencilIcon className="ml-2 mt-1 h-4 w-4" />
          </div>
        );
      },
    },
    {
      dataField: 'outOfStock',
      text: t('Products.Inventory.DaysRemaining'),
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
    },
    {
      dataField: 'reorder',
      text: t('Products.Inventory.Reorder'),
      sort: true,
      headerStyle: {
        minWidth: '140px',
      },
    },
  ];

  return (
    <>
      <div className="grid grid-cols-12 gap-5 mb-4 bg-white shadow rounded-lg p-4">
        <div className="col-span-12 sm:col-span-6 xl:col-span-4">
          <label
            htmlFor="Search"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Search')}
          </label>
          <Input
            name="Search"
            onChange={(e) => onSearch(e.target.value)}
            classes="border mt-1 px-3 py-2 placeholder-gray-400 focus:outline-none border-grey-300"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 xl:col-span-4">
          <DatePicker />
        </div>
      </div>
      <Modal
        open={openLeadTime}
        setOpen={setOpenLeadTime}
        noOverlayClick={true}
      >
        <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-md md:w-full">
          <ModalHeader
            title={`Asin: ${selectedRow.asin} Sku: ${selectedRow.sellerSku}`}
            setOpen={setOpenLeadTime}
          />
          <div className="py-4 px-6 h-40">
            <label
              htmlFor="leadTime"
              className="block text-sm font-medium text-gray-700"
            >
              {t('Products.Inventory.LeadTime')}
            </label>
            <Input
              type="number"
              name="leadTime"
              defaultValue={selectedRow.leadTime}
              classes="border px-3 py-2 placeholder-gray-400 focus:outline-none border-grey-300 rounded-md"
              onChange={(e) => onChangeLeadTime(e.target.value)}
            />
            <div className="text-right my-5">
              <button
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
                onClick={() => onUpdate()}
              >
                {t('Update')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Table
        keyField="inventoryItemId"
        columns={columns}
        data={inventory}
        onTableChange={onTableChange}
        params={params}
      />
    </>
  );
};

export default Inventory;
