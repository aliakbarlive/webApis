import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import {
  selectStatistics,
  getStatisticAsync,
} from 'features/advertising/advertisingSlice';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  numberFormatter,
  currencyFormatter,
  percentageFormatter,
} from 'utils/formatter';

const Statistics = ({ url, campaignType, customAttributes }) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const statistics = useSelector(selectStatistics);
  const selectedDates = useSelector(selectCurrentDateRange);

  useEffect(() => {
    const params = {
      ...selectedDates,
      campaignType,
      accountId: account.accountId,
      marketplace: marketplace.details.countryCode,
    };
    dispatch(getStatisticAsync(url, params));
  }, [dispatch, account, marketplace, url, campaignType, selectedDates]);

  const stats = [
    [
      {
        name: 'Sales',
        stat: currencyFormatter(statistics[customAttributes.sales]),
      },
      { name: 'Spend', stat: currencyFormatter(statistics.cost) },
      {
        name: 'Profit',
        stat: currencyFormatter(
          statistics[customAttributes.sales] - statistics.cost
        ),
      },
      {
        name: 'ACoS',
        stat: percentageFormatter(statistics.acos),
      },
    ],
    [
      { name: 'CPC', stat: currencyFormatter(statistics.cpc) },
      {
        name: 'CTR',
        stat: percentageFormatter(statistics.ctr),
      },
      { name: 'Clicks', stat: numberFormatter(statistics.clicks) },
      {
        name: 'CR',
        stat: percentageFormatter(statistics.cr),
      },
    ],
  ];

  return (
    <div className="mt-4">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-4 ">
        {stats.map((items) =>
          items.map((item) => {
            return (
              <div
                key={item.name}
                className="px-2 py-6 bg-white shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {item.stat}
                </dd>
              </div>
            );
          })
        )}
      </dl>
    </div>
  );
};

export default Statistics;
