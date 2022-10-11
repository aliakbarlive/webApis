import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { selectOrderSummary, getOrderSummaryAsync } from '../ordersSlice';

const statuses = [
  'Pending',
  'Unshipped',
  'Shipping',
  'Shipped',
  'Delivered',
  'Returned',
  'Cancelled',
];

const OrderSummary = ({ params }) => {
  const dispatch = useDispatch();
  const summary = useSelector(selectOrderSummary);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const statusCount = (status) => {
    const statusSummary = summary.find((s) => s.orderStatus === status);

    return statusSummary ? statusSummary.count : 0;
  };

  useEffect(() => {
    dispatch(getOrderSummaryAsync(params));
  }, [dispatch, account, marketplace, params]);

  return (
    <div className="mb-5">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4 lg:grid-cols-7 text-center">
        {statuses.map((status) => (
          <div
            key={status}
            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            <dt className="text-sm font-medium text-gray-500 truncate">
              {status}
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {statusCount(status)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default OrderSummary;
