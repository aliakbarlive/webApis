import Select from 'components/Forms/Select';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { dateFormatter, strUnderscoreToSpace } from 'utils/formatters';
import { columnClasses, headerClasses } from 'utils/table';
import EventDetailsSlideOver from './EventDetailsSlideOver';
import EventsTable from './EventsTable';
import { setCurrentPage } from '../invoicesSlice';
import { useDispatch } from 'react-redux';
import useQuery from 'hooks/useQuery';

const Events = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();
  const [params, setParams] = useState({
    page: query.get('page') ?? 1,
    sizePerPage: query.get('sizePerPage') ?? 25,
    status: query.get('status') ?? 'All',
  });
  const [zohoEvent, setZohoEvent] = useState(null);
  const [isOpenEventDetails, setIsOpenEventDetails] = useState(false);

  useEffect(() => {
    dispatch(setCurrentPage('Events'));
  }, []);

  const statuses = [
    { label: 'All', value: 'All' },
    { label: 'SUBSCRIPTION', value: '', disabled: true },
    { label: 'New Subscription', value: 'subscription_created' },
    { label: 'Subscription Activation', value: 'subscription_activation' },
    { label: 'Upgrade Subscription', value: 'subscription_upgraded' },
    { label: 'Downgrade Subscription', value: 'subscription_downgraded' },
    { label: 'Subscription Renewal', value: 'subscription_renewed' },
    { label: 'Cancel Subscription', value: 'subscription_cancelled' },
    { label: 'Reactivate Subscription', value: 'subscription_reactivated' },
    { label: 'Subscription Expired', value: 'subscription_expired' },
    { label: 'Subscription Renewal Ahead', value: 'subscription_ahead' },
    {
      label: 'Subscription Cancellation Scheduled',
      value: 'subscription_cancellation_scheduled',
    },
    {
      label: 'Subscription Scheduled Cancellation Removed',
      value: 'subscription_scheduled_cancellation_removed',
    },
    { label: 'Subscription Marked as Unpaid', value: 'subscription_unpaid' },
    { label: 'Subscription Deleted', value: 'subscription_deleted' },
    { label: 'Billing Date Changed', value: 'billing_date_changed' },
    { label: 'Subscription Paused', value: 'subscription_paused' },
    { label: 'Subscription Resumed', value: 'subscription_resumed' },
    { label: 'PAYMENT', value: '', disabled: true },
    { label: 'Payment Thank-You', value: 'payment_thankyou' },
    { label: 'Payment Failure', value: 'payment_declined' },
    { label: 'Payment Refund', value: 'payment_refunded' },
    { label: 'INVOICE', value: '', disabled: true },
    { label: 'Invoice Notification', value: 'invoice_notification' },
    { label: 'Invoice Updated', value: 'invoice_updated' },
    { label: 'Invoice Voided', value: 'invoice_voided' },
    { label: 'EXPIRY & CANCELLATION', value: '', disabled: true },
    { label: 'Trial About to Expire', value: 'trial_expiring' },
    {
      label: 'Subscription about to be Cancelled',
      value: 'subscription_cancelling',
    },
    { label: 'Subscription About to Expire', value: 'subscription_expiring' },
    { label: 'Card about to Expire', value: 'card_expiring' },
    { label: 'EXPIRED', value: '', disabled: true },
    { label: 'Card Expired', value: 'card_expired' },
    { label: 'CARD', value: '', disabled: true },
    { label: 'Card Deleted', value: 'card_deleted' },
    { label: 'CREDIT NOTE', value: '', disabled: true },
    { label: 'Credit Note Added', value: 'creditnote_added' },
    { label: 'Credit Note Refunded', value: 'creditnote_refunded' },
    { label: 'Credit Note Deleted', value: 'creditnote_deleted' },
    { label: 'PAYMENT METHOD', value: '', disabled: true },
    { label: 'Payment Method Added', value: 'payment_method_added' },
    { label: 'Payment Method Deleted', value: 'payment_method_deleted' },
    { label: 'Payment Method Updated', value: 'payment_method_updated' },
    { label: 'UNBILLED CHARGES', value: '', disabled: true },
    { label: 'Unbilled charges added', value: 'unbilled_charges_added' },
    { label: 'Unbilled charges updated', value: 'unbilled_charges_updated' },
    { label: 'Unbilled charges invoiced', value: 'unbilled_charges_invoiced' },
    { label: 'Unbilled charges deleted', value: 'unbilled_charges_deleted' },
  ];

  const tableColumns = [
    {
      dataField: 'event_time',
      text: 'Occurred At',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell, 'DD MMM YYYY HH:MM a')}</span>;
      },
    },
    {
      dataField: 'event_id',
      text: 'Event Id',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <button
            className="capitalize text-red-600 font-normal"
            onClick={() => onClickEventDetails(row)}
          >
            {cell}
          </button>
        );
      },
    },
    {
      dataField: 'event_type',
      text: 'Event Type',
      sort: false,
      headerClasses,
      classes: `${columnClasses} capitalize`,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => {
        return strUnderscoreToSpace(cell);
      },
    },

    {
      dataField: 'event_source',
      text: 'Source',
      sort: false,
      headerClasses,
      classes: `${columnClasses} capitalize`,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => {
        return cell === 'api' ? <span>API</span> : strUnderscoreToSpace(cell);
      },
    },
  ];

  const onClickEventDetails = (row) => {
    setIsOpenEventDetails(true);
    setZohoEvent(row);
  };

  const updateStatus = (status) => {
    let newParams = {
      ...params,
      status,
      page: 1,
      sizePerPage: query.get('sizePerPage') ?? 25,
    };
    setParams(newParams);
    query.set('status', status);
    query.set('page', 1);
    query.set('sizePerPage', newParams.sizePerPage);
    history.push(window.location.pathname + '?' + query.toString());
  };

  return (
    <>
      <div className="sm:flex items-center py-2 my-3">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 pb-1 pr-3"
        >
          Status
        </label>
        <div className="sm:w-max">
          <Select
            id="status"
            label="status"
            value={params.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {statuses.map((status, i) => (
              <option
                key={i}
                value={status.value}
                disabled={status.disabled ?? ''}
                className={status.disabled ? 'bg-red-50' : ''}
              >
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <EventsTable
        history={history}
        tableColumns={tableColumns}
        params={params}
        setParams={setParams}
      />
      <EventDetailsSlideOver
        open={isOpenEventDetails}
        setOpen={setIsOpenEventDetails}
        zohoEvent={zohoEvent}
      />
    </>
  );
};
export default Events;
