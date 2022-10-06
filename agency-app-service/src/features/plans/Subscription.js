import { Card } from 'components';
import { useSelector } from 'react-redux';
import {
  currencyFormatter,
  dateFormatter,
  strUnderscoreToSpace,
} from 'utils/formatters';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import Spinner from 'components/Spinner';
import classnames from 'classnames';
import Badge from 'components/Badge';
import ZohoPlanAddonsTable from './ZohoPlanAddonsTable';
import ScheduledChangesModal from './ScheduledChangesModal';
import useSubscription from 'hooks/useSubscription';
import { CANCELLED, EXPIRED, NON_RENEWING } from 'utils/subscriptions';

const Subscription = () => {
  const currentAccount = useSelector(selectCurrentAccount);
  const [subscription, setSubscription] = useState({});
  const status = useSubscription(subscription);
  const [scheduledChanges, setScheduledChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      setLoading(true);
      axios
        .get(`/accounts/${currentAccount.accountId}/subscription`)
        .then((res) => {
          setSubscription(res.data.subscription);
          setScheduledChanges(res.data.scheduledChanges);
          setLoading(false);
        });
    }
  }, [currentAccount]);

  const heading = (label, classes) => {
    return (
      <div className={`mb-2 border-b text-gray-700 uppercase ${classes ?? ''}`}>
        {label}
      </div>
    );
  };

  const row = (label, value) => {
    return (
      <div className="py-1 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {value}
        </dd>
      </div>
    );
  };

  return loading || !currentAccount ? (
    <Spinner />
  ) : (
    <Card>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        <div className="sm:col-span-1">
          {heading('details')}
          {row('Subscription Number', `#${subscription.subscription_number}`)}
          {row(
            'Status',
            <Badge
              color={classnames({
                green: status.live(),
                gray: status.nonRenewing(),
                yellow: status.cancelled(),
                red: status.expired(),
                blue: status.paused(),
              })}
              classes="uppercase"
              rounded="md"
            >
              {strUnderscoreToSpace(subscription.status)}
            </Badge>
          )}
          {row(
            'Activation Date',
            `${dateFormatter(subscription.activated_at)}`
          )}

          {heading('billing address', 'mt-4')}
          {subscription.customer.billing_address && (
            <>
              <span className=" block text-md text-gray-500">
                {subscription.customer.billing_address.street}
              </span>
              {subscription.customer.billing_address.street2 && (
                <span className=" block text-md text-gray-500">
                  {subscription.customer.billing_address.street2}
                </span>
              )}
              <span className=" block text-md text-gray-500">
                {[
                  subscription.customer.billing_address.city,
                  subscription.customer.billing_address.state,
                  subscription.customer.billing_address.zip,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
              <span className=" block text-md text-gray-500">
                {subscription.customer.billing_address.country}
              </span>
            </>
          )}

          {heading('payment method', 'mt-4')}
          {subscription.card ? (
            <>
              {row(
                'Card Number',
                <>
                  {subscription.card.last_four_digits}&nbsp;
                  <em className="text-gray-400 text-xs">(last four digits)</em>
                </>
              )}
              {row(
                'Expires On',
                `${subscription.card.expiry_month} / ${subscription.card.expiry_year}`
              )}
              {row('Gateway', subscription.card.payment_gateway)}
              {row('Funding', subscription.card.funding)}
            </>
          ) : (
            <span className="text-red-500 text-sm">
              No payment method specified
            </span>
          )}

          {heading('subscription options', 'mt-4')}
          {row('Subscription ID', subscription.subscription_id)}
        </div>

        <div className="sm:col-span-2 sm:border-l">
          <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:px-5">
            <div className="flex flex-col sm:px-5 pb-2">
              <span className="text-sm text-gray-500">Subscription Amount</span>
              <span>{currencyFormatter(subscription.amount)}</span>
            </div>
            <div className="flex flex-col sm:px-5 pb-2">
              <span className="text-sm text-gray-500">Next Billing Date</span>
              {status.live() && (
                <span>{dateFormatter(subscription.next_billing_at)}</span>
              )}
              {status.hasAny([NON_RENEWING, EXPIRED, CANCELLED]) ? (
                <span>-</span>
              ) : (
                ''
              )}
            </div>
            <div className="flex flex-col sm:px-5 pb-2">
              <span className="text-sm text-gray-500">Last Billing Date</span>
              <span>{dateFormatter(subscription.last_billing_at)}</span>
            </div>
            <div className="flex flex-col sm:px-5 pb-2">
              {status.live() && (
                <>
                  {subscription.remaining_billing_cycles < 0 ? (
                    <>
                      <span className="text-sm text-green-500">&nbsp;</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-500">
                        Renewals remaining
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
                  <span className="text-sm text-yellow-500">
                    Cancellation Date
                  </span>
                  {dateFormatter(subscription.scheduled_cancellation_date)}
                </>
              )}
              {status.cancelled() && (
                <>
                  <span className="text-sm text-yellow-500">
                    Cancelled Date
                  </span>
                  {dateFormatter(subscription.cancelled_at)}
                </>
              )}
            </div>
          </div>

          {scheduledChanges && scheduledChanges.code === 0 && (
            <ScheduledChangesModal
              open={isOpen}
              setOpen={setIsOpen}
              scheduledChanges={scheduledChanges}
            />
          )}
          <div className="sm:p-5">
            <ZohoPlanAddonsTable subscription={subscription} />
          </div>
        </div>
      </div>
    </Card>
  );
};
export default Subscription;
