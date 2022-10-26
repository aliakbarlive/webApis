import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ChatIcon, ChevronDownIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';

import DatePicker from 'features/datePicker/DatePicker';
import NotesModal from 'features/notes/NotesModal';

import { setNoteEntity } from 'features/notes/notesSlice';

import { selectCurrentDateRange } from '../datePicker/datePickerSlice';

import {
  selectOrders,
  getOrdersAsync,
  getOrderDetailsAsync,
  selectSelectedOrder,
} from './ordersSlice';

import { Input, Table } from 'components';
import OrderSlideOver from './components/OrderSlideOver';
import OrderSummary from './components/OrderSummary';
import ProductsSlideOver from 'components/ProductsSlideOver';
import Filter from './components/Filter';

const Overview = ({ account, marketplace }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const order = useSelector(selectSelectedOrder);
  const orders = useSelector(selectOrders);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [orderModal, setOrderModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [productSlideOver, setProductSlideOver] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const [summaryParams, setSummaryParams] = useState({});

  useEffect(() => {
    const newParams = { ...params };
    delete newParams.page;
    delete newParams.pageSize;
    delete newParams.sort;
    setSummaryParams(newParams);
  }, [dispatch, params, selectedDates]);

  useEffect(() => {
    dispatch(getOrdersAsync(params));
  }, [dispatch, account, marketplace, params, selectedDates]);

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search };
    setParams(newParams);
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const onOrderSelect = async (orderId) => {
    await dispatch(getOrderDetailsAsync(orderId));
    setOrderModal(!orderModal);
  };

  const onShowNotes = async ({ amazonOrderId }) => {
    await dispatch(setNoteEntity({ amazonOrderId }));
    setShowDetails(true);
  };

  const columns = [
    {
      dataField: 'fulfillmentChannel',
      text: t('Orders.Type'),
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell) => {
        const color = cell === 'AFN' ? 'gray' : 'indigo';
        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-${color}-100 text-${color}-800`}
          >
            {cell === 'AFN' ? 'FBA' : 'FBM'}
          </div>
        );
      },
    },
    {
      dataField: 'purchaseDate',
      text: t('Orders.PurchaseDate'),
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
      formatter: (cell) => {
        return <Moment format="lll">{cell}</Moment>;
      },
    },
    {
      dataField: 'amazonOrderId',
      text: t('Orders.OrderNumber'),
      sort: true,
      headerStyle: {
        minWidth: '200px',
      },
      formatter: (cell) => {
        return (
          <button className="text-red-500" onClick={() => onOrderSelect(cell)}>
            {cell}
          </button>
        );
      },
    },
    {
      dataField: 'orderStatus',
      text: t('Orders.Status'),
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => {
        let color;
        switch (cell) {
          case 'Shipped':
            color = 'green';
            break;
          case 'Pending':
            color = 'yellow';
            break;
          case 'Cancelled':
            color = 'red';
            break;
          default:
            color = 'gray';
            break;
        }

        return (
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-${color}-100 text-${color}-800`}
          >
            {cell}
          </div>
        );
      },
    },
    {
      dataField: 'notesCount',
      text: t('Orders.Notes'),
      formatter: (cell, row) => {
        return (
          <div
            className="flex items-center cursor-pointer text-gray-600"
            onClick={() => onShowNotes(row)}
          >
            <ChatIcon className="w-6  mr-1" />
            <span className="text-md">{cell}</span>
          </div>
        );
      },
    },
    {
      dataField: 'lastUpdateDate',
      text: t('LastUpdateDate'),
      sort: true,
      headerStyle: {
        minWidth: '175px',
      },
      formatter: (cell) => {
        return <Moment format="lll">{cell}</Moment>;
      },
    },
  ];

  const onSelectProduct = ({ asin }) => {
    let newParams = { ...params, page: 1 };
    asin === 'All Products' ? delete newParams.asin : (newParams.asin = asin);
    setParams(newParams);
  };

  const onChangeNotes = () => {
    dispatch(getOrdersAsync({ ...params, ...selectedDates }));
  };

  return (
    <>
      {/* Modals */}
      <OrderSlideOver open={orderModal} setOpen={setOrderModal} order={order} />

      <NotesModal
        open={showDetails}
        setOpen={setShowDetails}
        title={t('Orders.OrderNotes')}
        keyField="amazonOrderId"
        onChange={onChangeNotes}
      />

      <ProductsSlideOver
        open={productSlideOver}
        setOpen={setProductSlideOver}
        onSelect={onSelectProduct}
      />

      {/* Filters and Sort Section */}
      <div className="flex xl:grid-cols-12 gap-5 mb-4 bg-white shadow rounded-lg p-4">
        <div>
          <label
            htmlFor="productOption"
            className="block text-sm font-medium text-gray-700 pb-1"
          >
            {t('Orders.Product')}
          </label>
          <button
            className="flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            onClick={() => setProductSlideOver(true)}
          >
            <span>{params.asin || t('Orders.AllProducts')}</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
        <Input
          label={t('Orders.Search')}
          placeholder="Order #"
          onChangeInput={onSearch}
          className="ml-4 w-52"
        />

        <Filter params={params} setParams={setParams} />

        <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-3">
          <DatePicker />
        </div>
      </div>

      <OrderSummary params={summaryParams} />

      {/*  Orders Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {orders ? (
                <Table
                  select
                  selectType="checkbox"
                  keyField="amazonOrderId"
                  columns={columns}
                  data={orders}
                  onTableChange={onTableChange}
                  params={params}
                />
              ) : (
                <strong>{t('Loading')}</strong>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
