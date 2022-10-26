import React, { useRef, useState } from 'react';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Popover } from '@headlessui/react';
import './ChangeBillingDatePicker.css';
import { dateFormatter } from 'utils/formatters';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import ButtonLink from 'components/ButtonLink';
import { postponeRenewal } from 'features/clients/subscriptionsSlice';

const ChangeBillingDatePicker = ({ title, subscription, getSubscription }) => {
  const { last_billing_at, next_billing_at, subscription_id } = subscription;
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(next_billing_at);
  const closeRef = useRef();
  const dispatch = useDispatch();

  const dateVal = new Date(selectedDate);
  const initial = moment(last_billing_at).clone().add(1, 'month').toDate();

  const past = { before: initial };
  const selectedDays = { highlighted: dateVal };
  const modifiers = {
    highlighted: dateVal,
    initial: initial,
  };

  const onChangeBillingDate = () => {
    const renewalAt = moment.utc(selectedDate).format('YYYY-MM-DD');
    setSaving(true);
    dispatch(postponeRenewal(subscription_id, renewalAt)).then((res) => {
      if (res.output.code === 0) {
        closeRef.current?.click();
        getSubscription();
      }
      setSaving(false);
    });
  };

  return (
    <Popover className="relative leading-none">
      <Popover.Button ref={closeRef} className="text-red-400 text-xs italic">
        {title}
      </Popover.Button>
      <Popover.Panel className="tail absolute z-10 shadow-md border bg-white text-sm rounded-md">
        <div className="text-xs pt-5 pb-3 px-4 text-gray-600 border-b">
          This subscription will be renewed on{' '}
          <b>{dateFormatter(next_billing_at)}</b>. If you change it, Zoho
          Subscriptions will not make any pro rated credit or charge for the
          affected period.
        </div>
        <div className="px-2 text-sm">
          <DayPicker
            showOutsideDays
            disabledDays={past}
            modifiers={modifiers}
            selectedDays={selectedDays}
            fromMonth={initial}
            initialMonth={initial}
            onDayClick={(day) => setSelectedDate(day)}
          />
        </div>
        <div className="text-xs border-t pt-3 pb-5 px-5 flex justify-center">
          <ButtonLink
            onClick={onChangeBillingDate}
            loading={saving}
            showLoading={true}
            color="white"
            classes="bg-red-500 hover:bg-red-700 py1 px-3 rounded-md"
            textSize="xs"
          >
            Save
          </ButtonLink>
          <Popover.Button
            as="button"
            className="rounded-md bg-gray-100 hover:bg-gray-400 py-1 px-3 ml-2"
          >
            Cancel
          </Popover.Button>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
export default ChangeBillingDatePicker;
