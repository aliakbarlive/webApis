import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNetProfitAsync, selectNetProfit } from '../../profitSlice';
import Breakdown from '../Breakdown';
import Chart from '../Chart';
import { useTranslation } from 'react-i18next';

const NetProfit = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const netProfit = useSelector(selectNetProfit);
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getNetProfitAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        {netProfit && netProfit.breakdown ? (
          <Breakdown
            metric={t('Profit.NetProfit')}
            breakdown={netProfit && netProfit.breakdown}
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {netProfit && netProfit.history ? (
          <Chart
            data={netProfit && netProfit.history}
            metric={t('Profit.NetProfit')}
            unit="$"
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>
    </div>
  );
};

export default NetProfit;
