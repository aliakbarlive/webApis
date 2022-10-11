import React from 'react';
import { currencyFormatter, percentageFormatter } from 'utils/formatter';

const Statistic = ({ title, value, type }) => (
  <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
    <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
    <dd className="mt-1 text-2xl font-semibold text-gray-900">
      {' '}
      {type === 'currency'
        ? currencyFormatter(value)
        : type === 'percentage'
        ? percentageFormatter(value)
        : value}
    </dd>
  </div>
);

export default Statistic;
