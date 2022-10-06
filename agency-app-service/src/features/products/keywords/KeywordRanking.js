import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import KeywordChart from './KeywordChart';
import KeywordAddModal from './KeywordAddModal';
import Table from 'components/Table';
import Toggle from 'components/Toggle';
import DatePicker from 'features/datePicker/DatePicker';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import ProductsSlideOver from 'components/ProductsSlideOver';
import Input from 'components/Input';
import { setAlert } from '../../alerts/alertsSlice';

import {
  selectKeywordRankings,
  getKeywordRankingsAsync,
  updateKeywordAsync,
} from './keywordSlice';

import { selectCurrentDateRange } from '../../datePicker/datePickerSlice';

import ProductPreview from 'components/ProductPreview';

const KeywordRanking = ({ account, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const keywordRankings = useSelector(selectKeywordRankings);
  const dateRange = useSelector(selectCurrentDateRange);
  const [productSlideOver, setProductSlideOver] = useState(false);
  const [openKeywordChart, setOpenKeywordChart] = useState(false);
  const [openKeywordAdd, setOpenKeywordAdd] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    scope: 'topRanked',
    include: 'records',
  });

  useEffect(() => {
    dispatch(
      getKeywordRankingsAsync({
        ...params,
        ...dateRange,
      })
    );
  }, [dispatch, account, marketplace, params, dateRange]);

  const stats = [
    { name: 'Keywords Tracked', stat: '28' },
    { name: 'Maximum Keywords', stat: '50' },
    { name: 'Top Page Keywords', stat: '4' },
    { name: "Amazon's Choice", stat: '2' },
  ];

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

  const onSelectProduct = ({ asin }) => {
    let newParams = { ...params, page: 1 };
    asin === 'All Products' ? delete newParams.asin : (newParams.asin = asin);
    setParams(newParams);
    setProductSlideOver(false);
  };

  const onToggleStatus = async (keyword) => {
    const { keywordId, status } = keyword;

    await dispatch(
      updateKeywordAsync(keywordId, {
        status: status === 'active' ? 'inactive' : 'active',
      })
    );

    await dispatch(
      getKeywordRankingsAsync({
        ...params,
        ...dateRange,
      })
    );
  };

  const onKeywordAdd = async () => {
    if (!params.asin) {
      dispatch(setAlert('info', 'Select Product First'));
    } else {
      setOpenKeywordAdd(true);
    }
  };

  const columns = [
    {
      dataField: 'keywordText',
      text: t('Products.Keywords.Keyword'),
      headerStyle: {
        minWidth: '220px',
      },
      sort: true,
    },
    {
      dataField: 'listing.title',
      text: t('Products.Keywords.Product'),
      headerStyle: {
        minWidth: '390px',
      },
      sort: true,
      formatter: (cell, row) => (
        <ProductPreview
          productName={cell}
          asin={row.listing.asin}
          imageUrl={row.listing.thumbnail}
        />
      ),
    },
    {
      dataField: 'currentPage',
      text: t('Products.Keywords.Page'),
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
    },
    {
      dataField: 'position',
      text: t('Products.Keywords.Position'),
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'records',
      text: t('Products.Keywords.Trend'),
      sort: true,
      headerStyle: {
        width: '250px',
      },
      style: { cursor: 'pointer' },
      classes: 'cursorPointer',
      events: {
        onClick: (e, column, columnIndex, row) => {
          setSelectedRow(row);
          setOpenKeywordChart(true);
        },
      },
      formatter: (cell, row) => (
        <KeywordChart row={row} height="20" width="48" td={true} />
      ),
    },
    {
      dataField: 'updatedAt',
      text: t('Products.Keywords.LastUpdate'),
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => moment(cell).format('YYYY-MM-DD'),
    },
    {
      dataField: 'status',
      text: t('Products.Keywords.Status'),
      headerStyle: {
        minWidth: '90px',
      },
      formatter: (cell, row) => (
        <Toggle
          checked={cell === 'active'}
          onChange={() => onToggleStatus(row)}
        />
      ),
    },
  ];

  return (
    <>
      <ProductsSlideOver
        open={productSlideOver}
        setOpen={setProductSlideOver}
        onSelect={onSelectProduct}
      />
      <Modal
        open={openKeywordChart}
        setOpen={setOpenKeywordChart}
        align="top"
        as={'div'}
        noOverlayClick={true}
      >
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader title="Keyword Trend" setOpen={setOpenKeywordChart} />
          <div className="py-4 px-6 h-80 w-full">
            <KeywordChart row={selectedRow} height="full" width="full" />
          </div>
        </div>
      </Modal>

      <KeywordAddModal
        open={openKeywordAdd}
        setOpen={setOpenKeywordAdd}
        asin={params.asin}
        params={params}
        dateRange={dateRange}
      />

      <div className="flex xl:grid-cols-12 gap-5 mb-4 bg-white shadow rounded-lg p-4">
        <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-1">
          <label
            htmlFor="productOption"
            className="block text-sm font-medium text-gray-700 pb-1"
          >
            Product
          </label>
          <button
            className="flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            onClick={() => setProductSlideOver(true)}
          >
            <span>{params.asin || t('All Products')}</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
        <div className="col-span-12 sm:col-span-4 xl:col-span-2">
          <Input
            label={t('Products.Keywords.Search')}
            placeholder={t('Products.Keywords.SearchForKeywords')}
            onChangeInput={onSearch}
          />
        </div>

        <div className="col-span-12 sm:col-span-4 xl:col-span-2">
          <DatePicker />
        </div>
      </div>

      <div className="mb-5  ">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {item.name}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-8">
        <button
          onClick={() => onKeywordAdd()}
          className="col-start-8 col-span-1 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Products.Keywords.AddKeyword')}
        </button>
      </div>

      <Table
        columns={columns}
        data={keywordRankings}
        onTableChange={onTableChange}
        params={params}
        keyField="keywordId"
      />
    </>
  );
};

export default KeywordRanking;
