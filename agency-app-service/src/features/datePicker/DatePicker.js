import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setRange, selectDateRange } from './datePickerSlice';
import { Popover, Transition } from '@headlessui/react';
import DayPicker, { DateUtils } from 'react-day-picker';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import { CalendarIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'utils/classNames';
import 'react-day-picker/lib/style.css';

const DatePicker = ({ showLabel = true, position = 'right' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector(selectDateRange);

  const [open, setOpen] = useState(false);

  const preDefinedDates = [
    {
      title: t('DatePicker.Yesterday'),
      value: {
        endDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
        startDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.Today'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.LastWeek'),
      value: {
        endDate: moment().subtract(1, 'w').endOf('week').format('YYYY-MM-DD'),
        startDate: moment()
          .subtract(1, 'w')
          .startOf('week')
          .format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.Last7Days'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.Last30Days'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.MonthToDate'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.LastMonth'),
      value: {
        endDate: moment()
          .subtract(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD'),
        startDate: moment()
          .subtract(1, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
      },
    },
    {
      title: t('DatePicker.YearToDate'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('year').format('YYYY-MM-DD'),
      },
    },
  ];

  const toggle = () => setOpen(!open);

  const onDayClick = (day) => {
    const dateRange = DateUtils.addDayToRange(day, {
      from: startDate,
      to: endDate,
    });

    if (dateRange.to && dateRange.from) {
      dispatch(
        setRange({
          endDate: moment(dateRange.to).format('YYYY-MM-DD'),
          startDate: moment(dateRange.from).format('YYYY-MM-DD'),
        })
      );
    }
  };

  const onPreDefinedDateClick = (value) => {
    dispatch(setRange(value));
  };

  const modifiers = { start: startDate, end: endDate };

  return (
    <>
      <label
        htmlFor="date"
        className={classNames(
          showLabel ? 'block' : 'hidden',
          'text-sm font-medium text-gray-700'
        )}
      >
        Date
      </label>
      <Popover className="relative mt-1">
        {() => (
          <>
            <button
              className="flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
              onClick={toggle}
            >
              <span>
                {moment(startDate).format('ll') ===
                moment(endDate).format('ll') ? (
                  <Moment format="LL" className="mr-2">
                    {startDate}
                  </Moment>
                ) : (
                  <div>
                    <Moment format="ll" className="mr-2">
                      {startDate}
                    </Moment>{' '}
                    -{' '}
                    <Moment format="ll" className="mr-2 ml-2">
                      {endDate}
                    </Moment>
                  </div>
                )}
              </span>
              <CalendarIcon
                className={classNames(
                  open ? 'text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
            </button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className={`absolute z-10 ${position}-0 mt-3 px-2 w-auto sm:px-0`}
              >
                <div className="min-w-max rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div
                    className="flex justify-end py-2 pr-6 cursor-pointer min-w-max bg-gray-50"
                    onClick={toggle}
                  >
                    <XCircleIcon className="w-6 h-6 text-gray-400 hover:text-gray-500" />
                  </div>
                  <div className="flex justify-center bg-white pb-2 min-w-max">
                    <DayPicker
                      className="Selectable"
                      numberOfMonths={2}
                      selectedDays={[
                        startDate,
                        { from: startDate, to: endDate },
                      ]}
                      modifiers={modifiers}
                      onDayClick={onDayClick}
                    />
                  </div>

                  <div className="px-6 py-5 bg-gray-50 grid grid-cols-4 gap-3 min-w-max">
                    {preDefinedDates.map(({ title, value }) => (
                      <button
                        key={title}
                        className="p-2.5  rounded-md text-sm text-gray-900 bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-150"
                        onClick={() => onPreDefinedDateClick(value)}
                      >
                        <span>{title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default DatePicker;
