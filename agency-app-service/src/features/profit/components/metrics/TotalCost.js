import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCostAsync, selectTotalCost } from '../../profitSlice';
import Breakdown from '../Breakdown';
import Chart from '../Chart';
import { useTranslation } from 'react-i18next';

const TotalCost = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const totalCost = useSelector(selectTotalCost);
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getTotalCostAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        {totalCost && totalCost.breakdown ? (
          <Breakdown
            metric={t('Profit.TotalCost')}
            breakdown={totalCost && totalCost.breakdown}
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {totalCost && totalCost.history ? (
          <Chart
            data={totalCost && totalCost.history}
            metric={t('Profit.TotalCost')}
            unit="$"
            reversed={true}
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>
    </div>
  );
};

export default TotalCost;
