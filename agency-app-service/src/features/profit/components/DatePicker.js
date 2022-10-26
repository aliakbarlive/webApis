import { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import DayPicker from 'react-day-picker';
import Moment from 'react-moment';
import moment from 'moment-timezone';
import { CalendarIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'utils/classNames';
import 'react-day-picker/lib/style.css';
import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

const DatePicker = ({ onSetStartDate, startDate: prevStartDate }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    prevStartDate && prevStartDate >= '1900-01-01T00:00:00.000Z'
      ? prevStartDate
      : undefined
  );
  const [enableSinceStartDate, setEnableSinceStartDate] = useState(
    prevStartDate && prevStartDate <= '1900-01-01T00:00:00.000Z' ? true : false
  );

  const toggle = () => setOpen(!open);

  const onDayClick = (day) => {
    const formattedDay = moment.utc(day).format('YYYY-MM-DD');
    onSetStartDate(formattedDay);
    setStartDate(formattedDay);
    setOpen(false);
  };

  const onSwitch = () => {
    if (!enableSinceStartDate) {
      onSetStartDate('');
      setStartDate(undefined);
    }
    setEnableSinceStartDate(!enableSinceStartDate);
  };

  return (
    <>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        {t('CostManager.EffectiveDate')}
      </label>
      <Popover className="relative mt-2">
        {() => (
          <>
            <button
              className="flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
              onClick={toggle}
            >
              <span>
                {!enableSinceStartDate && startDate && (
                  <Moment format="LL" className="mr-2">
                    {moment(startDate)}
                  </Moment>
                )}
                {enableSinceStartDate && t('CostManager.SinceProductLaunch')}
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
                className={`absolute z-10 right-0 mt-3 px-2 w-auto sm:px-0`}
              >
                <div className="min-w-max rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div
                    className="flex justify-end py-2 pr-6 cursor-pointer min-w-max bg-gray-50"
                    onClick={toggle}
                  >
                    <XCircleIcon className="w-6 h-6 text-gray-400 hover:text-gray-500" />
                  </div>

                  <div className="p-3">
                    <Switch.Group as="div" className="flex items-center">
                      <Switch
                        checked={enableSinceStartDate}
                        onChange={onSwitch}
                        className={classNames(
                          enableSinceStartDate
                            ? 'bg-indigo-600'
                            : 'bg-gray-200',
                          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            enableSinceStartDate
                              ? 'translate-x-5'
                              : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                          )}
                        />
                      </Switch>
                      <Switch.Label as="span" className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          {t('CostManager.SinceProductLaunch')}
                        </span>
                      </Switch.Label>
                    </Switch.Group>
                  </div>

                  <div className="flex justify-center bg-white pb-2 min-w-max">
                    {!enableSinceStartDate && (
                      <DayPicker
                        className="Selectable"
                        selectedDays={startDate}
                        onDayClick={onDayClick}
                      />
                    )}
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
