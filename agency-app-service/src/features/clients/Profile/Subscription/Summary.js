import React from 'react';
import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import ChangeBillingDatePicker from './ChangeBillingDatePicker';
import usePermissions from 'hooks/usePermissions';
import useSubscription from 'hooks/useSubscription';
import {
  CANCELLED,
  EXPIRED,
  LIVE,
  NON_RENEWING,
  UNPAID,
} from 'utils/subscriptions';

const Summary = ({
  subscription,
  setIsOpenExtendBillingCycle,
  getSubscription,
}) => {

  const { userCan } = usePermissions();
  const status = useSubscription(subscription);
  return (
    <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:px-5">
      <div className="flex flex-col sm:px-5 pb-2">
        <span className="text-sm text-gray-500">Subscription Amount</span>
        <span>{currencyFormatter(subscription.amount)}</span>
      </div>
      <div className="flex flex-col sm:px-5 pb-2">
        <span className="text-sm text-gray-500">Next Billing Date</span>
        {status.hasAny([LIVE, UNPAID]) && (
          <>
            <span>{dateFormatter(subscription.next_billing_at)}</span>
            {userCan('clients.subscription.billing.update') && (
              <ChangeBillingDatePicker
                title="Change"
                subscription={subscription}
                getSubscription={getSubscription}
              />
            )}
          </>
        )}
        {status.hasAny([NON_RENEWING, EXPIRED, CANCELLED]) ? (
          <span>-</span>
        ) : (
          ''
        )}
      </div>
      <div className="flex flex-col sm:px-5 pb-2">
        <span className="text-sm text-gray-500">Last Billing Date</span>
        <span>
          {!subscription.last_billing_at
            ? null
            : dateFormatter(subscription.last_billing_at)}
        </span>
      </div>
      <div className="flex flex-col sm:px-5 pb-2">
        {status.live() && (
          <>
            {subscription.remaining_billing_cycles < 0 ? (
              <span className="text-sm text-green-500">&nbsp;</span>
            ) : (
              <>
                <span className="text-sm text-gray-500">
                  Renewals remaining
                </span>
                <span className="flex">
                  {subscription.remaining_billing_cycles} cycles
                  {userCan('clients.subscription.update') && (
                    <button
                      className="ml-2"
                      onClick={() => setIsOpenExtendBillingCycle(true)}
                    >
                      <PencilIcon className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </span>
                <span className="text-sm text-gray-500">
                  Expires on {dateFormatter(subscription.expires_at)}
                </span>
              </>
            )}
          </>
        )}
        {status.nonRenewing() && (
          <>
            <span className="text-sm text-yellow-500">Cancellation Date</span>
            {dateFormatter(subscription.scheduled_cancellation_date)}
          </>
        )}
        {status.cancelled() && (
          <>
            <span className="text-sm text-red-500">Cancelled Date</span>
            {dateFormatter(subscription.cancelled_at)}
          </>
        )}
        {status.expired() && (
          <>
            <span className="text-sm text-red-500">Expiry Date</span>
            {dateFormatter(subscription.expires_at)}
          </>
        )}
      </div>
    </div>
  );
};
export default Summary;
