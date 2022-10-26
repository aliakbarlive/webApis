import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectStatistics,
  getStatisticAsync,
} from 'features/advertising/advertisingSlice';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  numberFormatter,
  currencyFormatter,
  percentageFormatter,
} from 'utils/formatters';

const Statistics = ({ url, accountId, campaignType, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const statistics = useSelector(selectStatistics);
  const selectedDates = useSelector(selectCurrentDateRange);

  useEffect(() => {
    const params = {
      campaignType,
      accountId,
      marketplace,
      ...selectedDates,
    };
    dispatch(getStatisticAsync(url, params));
  }, [dispatch, accountId, marketplace, url, campaignType, selectedDates]);

  const stats = [
    [
      {
        name: t('Advertising.Metrics.Sales'),
        stat: currencyFormatter(statistics.sales),
      },
      {
        name: t('Advertising.Metrics.Spend'),
        stat: currencyFormatter(statistics.cost),
      },
      {
        name: t('Advertising.Metrics.Profit'),
        stat: currencyFormatter(statistics.profit),
      },
      {
        name: t('Advertising.Metrics.ACOS'),
        stat: percentageFormatter(statistics.acos),
      },
    ],
    [
      {
        name: t('Advertising.Metrics.CPC'),
        stat: currencyFormatter(statistics.cpc),
      },
      {
        name: t('Advertising.Metrics.CTR'),
        stat: percentageFormatter(statistics.ctr),
      },
      {
        name: t('Advertising.Metrics.Clicks'),
        stat: numberFormatter(statistics.clicks),
      },
      {
        name: t('Advertising.Metrics.CR'),
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
