import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon, ChatIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import Moment from 'react-moment';
import { range } from 'lodash';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { setNoteEntity } from 'features/notes/notesSlice';
import { getReviewsAsync, selectReviewList } from './reviewsSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import AccountAndMarketplacePicker from 'components/AccountAndMarketplacePicker';
import ProductsSlideOver from 'components/ProductsSlideOver';
import DatePicker from 'features/datePicker/DatePicker';
import ProductPreview from 'components/ProductPreview';
import NotesModal from 'features/notes/NotesModal';
import { Card, Input, Table } from 'components';
import Filter from './components/Filter';

const ReviewManager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const reviews = useSelector(selectReviewList);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [productSlideOver, setProductSlideOver] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
  });

  useEffect(() => {
    if (account && marketplace) {
      dispatch(
        getReviewsAsync({
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
          ...params,
        })
      );
    }
  }, [dispatch, account, marketplace, params, selectedDates]);

  const onShowNotes = async (review) => {
    const { reviewId } = review;
    await dispatch(setNoteEntity({ reviewId }));
    setShowNotes(true);
  };

  const columns = [
    {
      dataField: 'Listing.title',
      text: t('Reviews.Table.Column.Product'),
      sort: true,
      headerStyle: {
        minWidth: '300px',
      },
      formatter: (cell, row) => (
        <ProductPreview
          productName={row.Listing.title}
          asin={row.Listing.asin}
          imageUrl={row.Listing.thumbnail}
        />
      ),
    },
    {
      dataField: 'reviewDate',
      text: t('Reviews.Table.Column.Date'),
      sort: true,
      headerStyle: {
        minWidth: '200px',
      },
      formatter: (cell) => <Moment format="lll">{cell}</Moment>,
    },
    {
      dataField: 'rating',
      text: t('Reviews.Table.Column.Details'),
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
              <span className="text-xs font-medium">{title}</span>
              <p className="break-all text-xs">
                {body ? body.substring(0, 65) : ''}
              </p>
            </div>
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
  ];

  const onSearch = (search) => {
    let newParams = { ...params, page: 1, search };
    setParams(newParams);
  };

  const onSelectProduct = ({ asin }) => {
    let newParams = { ...params, page: 1 };
    asin === 'All Products' ? delete newParams.asin : (newParams.asin = asin);
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

  const onChangeNotes = () => {
    dispatch(
      getReviewsAsync({
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
        ...selectedDates,
        ...params,
      })
    );
  };

  return (
    <div className="block">
      <NotesModal
        open={showNotes}
        setOpen={setShowNotes}
        title={t('Orders.OrderNotes')}
        keyField="reviewId"
        onChange={onChangeNotes}
      />

      <ProductsSlideOver
        open={productSlideOver}
        setOpen={setProductSlideOver}
        onSelect={onSelectProduct}
      />

      <div className="grid grid-cols-12 py-5">
        <h2 className="col-span-12 mb-4 lg:col-span-5 xl:mb-0 xl:col-span-7 text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate border-b-2 border-transparent capitalize">
          {t('Reviews.PageHeader')}
        </h2>
        <div className="col-span-12 lg:col-span-7 xl:col-span-5 grid grid-cols-5 gap-4">
          <AccountAndMarketplacePicker
            accountClass="col-span-5 sm:col-span-3"
            marketplaceClass="col-span-5 sm:col-start-4 col-span-2 sm:row-start-1"
          />
        </div>
      </div>

      <Card className="mb-4" overflowHidden={false} flex>
        <div className="form-group">
          <label
            htmlFor="productOption"
            className="block text-sm font-medium text-gray-700 pb-1"
          >
            {t('Reviews.Filter.Product')}
          </label>
          <button
            className="flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            onClick={() => setProductSlideOver(true)}
          >
            <span>{params.asin || t('Reviews.Filter.AllProduct')}</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
        <Input
          label={t('Reviews.Search.Label')}
          placeholder={t('Reviews.Search.Placeholder')}
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
        params={params}
      />
    </div>
  );
};

export default ReviewManager;
