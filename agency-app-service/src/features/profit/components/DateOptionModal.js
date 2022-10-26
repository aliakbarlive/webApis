import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Modal from 'components/Modal';

const DateOptionModal = ({ open, setOpen, column, onSelectDate }) => {
  const { t } = useTranslation();
  const preDefinedDates = [
    {
      title: t('Snapshots.DateOptionModal.Yesterday'),
      value: {
        endDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
        startDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.Today'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.LastWeek'),
      value: {
        endDate: moment().subtract(1, 'w').endOf('week').format('YYYY-MM-DD'),
        startDate: moment()
          .subtract(1, 'w')
          .startOf('week')
          .format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.Last7Days'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.Last30Days'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.MonthToDate'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
      },
    },
    {
      title: t('Snapshots.DateOptionModal.LastMonth'),
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
      title: t('Snapshots.DateOptionModal.YearToDate'),
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('year').format('YYYY-MM-DD'),
      },
    },
  ];

  const onPreDefinedDateClick = ({ title, value }) => {
    onSelectDate({ column, title, value });
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-md md:w-full">
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-red rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">
              {t('Snapshots.DateOptionModal.Close')}
            </span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 md:px-6 border-b-2 pb-3">
          <h3 className="text-md leading-6 font-medium text-gray-800">
            {t('Snapshots.DateOptionModal.DateOptions')}
          </h3>
        </div>

        <div className="px-6 py-5 bg-gray-50 grid grid-cols-2 gap-3 min-w-max">
          {preDefinedDates.map(({ title, value }) => (
            <button
              key={title}
              className="p-2.5  rounded-md text-sm text-gray-900 bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-150"
              onClick={() => onPreDefinedDateClick({ title, value })}
            >
              <span>{title}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DateOptionModal;
