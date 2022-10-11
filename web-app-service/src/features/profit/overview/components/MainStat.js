import React from 'react';
import classNames from 'utils/classNames';
import { currencyFormatter, percentageFormatter } from 'utils/formatter';

const MainStat = ({ title, value, active, type, onClick }) => (
  // <div className="px-4 py-5 bg-white rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 hover:text-gray-900 sm:p-6">
  <div
    className={classNames(
      active ? 'bg-red-50' : 'bg-white hover:bg-gray-50 hover:text-gray-900',
      'group px-4 py-5 bg-white rounded-lg overflow-hidden cursor-pointer sm:p-6'
    )}
    onClick={onClick}
  >
    <dt
      className={classNames(
        active ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-500',
        'text-sm font-medium truncate '
      )}
    >
      {title}
    </dt>
    <dd
      className={classNames(
        active ? 'text-red-600' : 'text-gray-900 group-hover:text-gray-900',
        'mt-1 text-2xl font-semibold '
      )}
    >
      {type === 'currency'
        ? currencyFormatter(value)
        : type === 'percentage'
        ? percentageFormatter(value)
        : value}
    </dd>
  </div>
);

export default MainStat;
