import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startCase, camelCase } from 'lodash';

import { ChevronDownIcon } from '@heroicons/react/outline';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';
import { getAlertsAsync, selectAlertHistory } from './alertsSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  Pagination,
  Card,
  ProductsSlideOver,
  MultipleFilter,
} from 'components';

import DatePicker from 'features/datePicker/DatePicker';
import ActionButton from './components/ActionButton';
import ShowMoreButton from './components/ShowMoreButton';

const History = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(selectAlertHistory);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const selectedDates = useSelector(selectCurrentDateRange);
  const [productSlideOver, setProductSlideOver] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [filters, setFilters] = useState({ type: [], scope: [] });
  const [resolveChanges, setResolveChanges] = useState(false);

  const filterOptions = {
    type: [
      { value: 'listingTitleChanged', display: 'Title Changed' },
      { value: 'listingDescriptionChanged', display: 'Description Changed' },
      { value: 'listingPriceChanged', display: 'Price Changed' },
      {
        value: 'listingFeatureBulletsChanged',
        display: 'Feature Bullets Changed',
      },
      {
        value: 'listingImagesChanged',
        display: 'Images Changed',
      },
      {
        value: 'listingCategoriesChanged',
        display: 'Categories Changed',
      },
      {
        value: 'listingBuyBoxWinnerChanged',
        display: 'BuyBox Winner Changed',
      },
      {
        value: 'newReview',
        display: 'Review',
      },
      {
        value: 'lowStock',
        display: 'Low Stock',
      },
      {
        value: 'rating',
        display: 'Rating',
      },
    ],
    scope: ['resolved', 'unresolved'],
  };

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sort: 'createdAt:desc',
  });

  const onPageChange = (page) => {
    let newParams = { ...params };
    newParams.page = page;
    setParams(newParams);
  };

  const onSelectProduct = (product) => {
    setSelectedProduct(product.asin === 'All Products' ? '' : product.asin);
  };

  useEffect(() => {
    let query = {
      ...params,
      ...selectedDates,
      accountId: account.accountId,
      marketplace: marketplace.details.countryCode,
    };

    if (filters.type.length) query.type = filters.type.join(',');
    if (filters.scope.length && filters.scope.length !== 2)
      query.scope = filters.scope.join(',');

    if (selectedProduct) query['listing.asin'] = selectedProduct;

    dispatch(getAlertsAsync(query));
  }, [
    dispatch,
    account,
    marketplace,
    params,
    selectedProduct,
    filters,
    resolveChanges,
    selectedDates,
  ]);

  return (
    alerts && (
      <div>
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
              <span>{selectedProduct || 'All Products'}</span>
              <ChevronDownIcon className="ml-2 h-5 w-5" />
            </button>
          </div>

          <MultipleFilter
            className="text-sm mx-4"
            label="Alert Types"
            options={filterOptions}
            noSelectedText="No Filters selected"
            selected={filters}
            setSelected={setFilters}
          />

          <div className="col-span-12 sm:col-span-4 xl:col-span-3">
            <DatePicker />
          </div>
        </Card>

        <div className="bg-white rounded pb-4">
          <ul className="px-4 py-4 sm:px-6">
            {alerts.count ? (
              alerts.rows.map((alert) => (
                <li
                  key={alert.alertId}
                  className="flex p-4 border mb-2 rounded"
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={alert.listing.thumbnail}
                    alt={alert.listing.asin}
                  />
                  <div className="ml-3 flex items-center flex-1">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {startCase(camelCase(alert.type))}
                      </p>
                      <p className="text-sm text-gray-600">{alert.title}</p>
                    </div>
                    <div>
                      <ShowMoreButton alertId={alert.alertId} />

                      <ActionButton
                        alertId={alert.alertId}
                        resolvedAt={alert.resolvedAt}
                        onChange={() => setResolveChanges(!resolveChanges)}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-gray-700 text-center">
                No data to display
              </div>
            )}
          </ul>

          {alerts.count ? (
            <Pagination
              page={alerts.page ?? 1}
              dataSize={alerts.count ?? 0}
              sizePerPage={alerts.pageSize ?? 10}
              onPageChange={onPageChange}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    )
  );
};

export default History;
