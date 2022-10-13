import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { EyeIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';

import Moment from 'react-moment';
import { range } from 'lodash';

import { selectReviews, getReviewsAsync } from './reviewsSlice';
import { setNoteEntity } from 'features/notes/notesSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../accounts/accountsSlice';

import { selectCurrentDateRange } from '../datePicker/datePickerSlice';

import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import DatePicker from 'features/datePicker/DatePicker';
import NotesModal from 'features/notes/NotesModal';

import PageHeader from 'components/PageHeader';
import { Card, Input, ProductsSlideOver, Table } from 'components';
import Filter from './Filter';

import { productNameFormatter } from 'utils/table';

const Reviews = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  const [productSlideOver, setProductSlideOver] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const selectedDates = useSelector(selectCurrentDateRange);
  const reviews = useSelector(selectReviews);

  useEffect(() => {
    dispatch(getReviewsAsync(params));
  }, [dispatch, params, account, marketplace, selectedDates]);

  const onShowNotes = async (review) => {
    const { reviewId } = review;
    await dispatch(setNoteEntity({ reviewId }));
    setShowNotes(true);
  };

  const onChangeNotes = () => {
    dispatch(getReviewsAsync(params));
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const onSelectProduct = ({ asin }) => {
    let newParams = { ...params, page: 1 };
    asin === 'All Products' ? delete newParams.asin : (newParams.asin = asin);
    setParams(newParams);
  };

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search: search };
    setParams(newParams);
  };

  const columns = [
    {
      dataField: 'Listing.title',
      text: 'Product',
      sort: true,
      headerStyle: {
        minWidth: '300px',
      },
      formatter: (cell, row) =>
        productNameFormatter(cell, {
          productName: row.Listing.title,
          asin: row.Listing.asin,
          thumbnail: row.Listing.thumbnail,
        }),
    },
    {
      dataField: 'reviewDate',
      text: 'Review Date',
      sort: true,
      headerStyle: {
        minWidth: '200px',
      },
      formatter: (cell) => <Moment format="lll">{cell}</Moment>,
    },
    {
      dataField: 'rating',
      text: 'Review Details',
      sort: true,
      formatter: (cell, { rating, title, body }) => {
        return (
          <div className="w-80 h-20 break-word">
            <div className="flex">
              {range(1, 6).map((i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 mt-1 text-${
                    rating >= i ? 'yellow' : 'gray'
                  }-400`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="mt-2">
              <span className="text-sm font-medium">{title}</span>
              <p className="break-all text-xs">{body.substring(0, 65)}</p>
            </div>
          </div>
        );
      },
    },
    {
      dataField: 'notesCount',
      text: 'Notes',
      sort: false,
    },
    {
      dataField: 'actions',
      text: 'Actions',
      formatter: (cell, row) => (
        <button>
          <EyeIcon onClick={() => onShowNotes(row)} className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Review.ReviewManager")} />

      <NotesModal
        open={showNotes}
        setOpen={setShowNotes}
        title="Review Notes"
        keyField="reviewId"
        onChange={onChangeNotes}
      />

      <ProductsSlideOver
        open={productSlideOver}
        setOpen={setProductSlideOver}
        onSelect={onSelectProduct}
      />

      <Card className="mb-8" flex>
        <div>
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
            <span>{params.asin || 'All Products'}</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
        </div>

        <Input
          label="Search"
          placeholder="Review Title & Description"
          onChangeInput={onSearch}
          className="ml-4"
        />

        <Filter params={params} setParams={setParams} />

        <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-3">
          <DatePicker />
        </div>
      </Card>

      <Table
        keyField="reviewId"
        columns={columns}
        data={reviews}
        onTableChange={onTableChange}
        page={params.page}
        pageSize={params.pageSize}
      />
    </DashboardLayout>
  );
};

export default Reviews;
