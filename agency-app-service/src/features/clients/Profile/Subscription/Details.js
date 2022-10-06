import React, { Fragment, useState } from 'react';

import {
  currencyFormatter,
  dateFormatter,
  strUnderscoreToSpace,
} from 'utils/formatters';
import classnames from 'classnames';
import Badge from 'components/Badge';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { PlayIcon, PauseIcon, ExclamationIcon } from '@heroicons/react/solid';
import { updateCustomField } from 'features/clients/subscriptionsSlice';
import { useDispatch } from 'react-redux';
import usePermissions from 'hooks/usePermissions';
import useSubscription from 'hooks/useSubscription';
import { LIVE, DUNNING, FUTURE, UNPAID } from 'utils/subscriptions';

const Details = ({
  subscription,
  termination,
  changeAutoCollect,
  updateCardDetails,
  setIsOpenTerminate,
  cycleDate,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const status = useSubscription(subscription);
  const [chargeAdminFee, setChargeAdminFee] = useState(
    subscription.custom_field_hash.cf_charge_admin_fee
      ? subscription.custom_field_hash.cf_charge_admin_fee === 'yes'
        ? true
        : false
      : false
  );
  const { SubscriptionCycleDates } = cycleDate;
  let startCycleDate = '';
  let endCycleDate = '';
  let activatedAt = subscription.activated_at;
  if (SubscriptionCycleDates && SubscriptionCycleDates.length > 0) {
    const { subscriptionStartDate, subscriptionValidUntilDate } =
      SubscriptionCycleDates[0];
    const parseStartDate = subscriptionStartDate.split('T');
    activatedAt = parseStartDate[0];
    const parseEndDate = subscriptionValidUntilDate.split('T');
    const monthDiff = moment().diff(parseStartDate[0], 'months');
    startCycleDate = moment(parseStartDate[0]).add(monthDiff, 'months');
    endCycleDate = moment(parseEndDate[0])
      .add(monthDiff, 'months')
      .subtract(1, 'day')
      .format();
  } else {
    // for offline subscriptions
    const subscriptionStartDate = activatedAt;
    const subscriptionValidUntilDate = subscription.next_billing_at;
    const monthDiff = moment().diff(subscriptionStartDate, 'months');
    startCycleDate = moment(subscriptionStartDate).add(monthDiff, 'months');
    endCycleDate = moment(subscriptionValidUntilDate)
      .add(monthDiff, 'months')
      .subtract(1, 'day')
      .format();
  }

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

  const onChargeAdminFee = () => {
    let state = !chargeAdminFee;
    setChargeAdminFee(state);
    let charge_admin_fee = state === true ? 'yes' : 'no';
    dispatch(
      updateCustomField(
        subscription.subscription_id,
        'charge_admin_fee',
        charge_admin_fee
      )
    );
  };

  return (
    <div className="sm:col-span-1 mt-4 sm:mt-0">
      {heading('details')}
      {row('Client', subscription.customer.display_name)}
      {row(
        t('Profile.Subscription.SubscriptionNumber'),
        `#${subscription.subscription_number}`
      )}
      {row(
        t('Profile.Subscription.Status'),
        <Badge
          color={classnames({
            green: status.live(),
            gray: status.nonRenewing(),
            yellow: status.cancelled(),
            red: status.expired(),
            blue: status.paused(),
            indigo: status.hasAny([UNPAID, DUNNING]),
            pink: status.future(),
          })}
          classes="uppercase"
          rounded="md"
        >
          {strUnderscoreToSpace(subscription.status)}
        </Badge>
      )}
      {row(
        t('Profile.Subscription.ActivationDate'),
        `${dateFormatter(activatedAt)}`
      )}
      {startCycleDate &&
        row(
          t('Profile.Subscription.StartDate'),
          `${dateFormatter(startCycleDate)}`
        )}
      {endCycleDate &&
        row(
          t('Profile.Subscription.ValidUntilDate'),
          `${dateFormatter(endCycleDate)}`
        )}
      {row('Sales Person', subscription.salesperson_name)}

      {heading('Contact', 'mt-4')}
      {row('Email', subscription.customer.email)}
      {row(
        'Contact Person',
        `${subscription.customer.first_name} ${subscription.customer.last_name}`
      )}

      {heading('billing address', 'mt-4')}
      {Object.values(subscription.customer.billing_address).some(
        (prop) => prop !== ''
      ) ? (
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
      ) : (
        <span className="text-gray-500 text-sm">No address specified</span>
      )}

      {heading('payment method', 'mt-4')}
      {subscription.card ? (
        <>
          {row(
            'Card Number',
            <Fragment>
              {subscription.card.last_four_digits}&nbsp;
              <em className="text-gray-400 text-xs">(last four digits)</em>
            </Fragment>
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

      {subscription.card &&
        status.hasAny([LIVE, FUTURE, UNPAID, DUNNING]) &&
        userCan('clients.subscription.card.update') && (
          <div className="py-1 text-sm">
            <button className="text-red-600" onClick={changeAutoCollect}>
              Change to {subscription.auto_collect ? 'Offline' : 'Online'} Mode
            </button>
            <span className="px-2 text-gray-400 inline-block">|</span>
            <button className="text-red-600" onClick={updateCardDetails}>
              Update Card
            </button>
          </div>
        )}

      {heading('subscription options', 'mt-4')}
      {row('Subscription ID', subscription.subscription_id)}
      {row(
        'Convert On Cycle',
        subscription.custom_field_hash.cf_convert_on_cycle
      )}
      {row(
        'Convert On Cycle Date',
        subscription.custom_field_hash.cf_convert_on_cycle
          ? `${dateFormatter(
              subscription.custom_field_hash
                .cf_convert_on_cycle_date_unformatted
            )}`
          : ''
      )}
      {row(
        'Retainer After Convert',
        subscription.custom_field_hash.cf_retainer_after_convert_unformatted
          ? `${currencyFormatter(
              subscription.custom_field_hash
                .cf_retainer_after_convert_unformatted
            )}`
          : ''
      )}
      {row('Pause Collect', subscription.custom_field_hash.cf_pause_collect)}
      {!subscription.auto_collect &&
        userCan('clients.subscription.adminfee.update') &&
        row(
          'Charge 3% Admin Fee',
          <div className="flex">
            <span className="">{chargeAdminFee ? 'yes' : 'no'}</span>
            <button type="button" onClick={onChargeAdminFee} className="ml-2">
              {chargeAdminFee ? (
                <PauseIcon className="w-5 h-5 text-red-500" />
              ) : (
                <PlayIcon className="w-5 h-5 text-green-500" />
              )}
            </button>
          </div>
        )}
    </div>
  );
};

export default Details;
