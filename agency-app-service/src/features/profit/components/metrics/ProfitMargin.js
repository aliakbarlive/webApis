import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMarginAsync, selectMargin } from '../../profitSlice';
import Breakdown from '../Breakdown';
import Chart from '../Chart';
import { useTranslation } from 'react-i18next';

const Margin = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const profitMargin = useSelector(selectMargin);
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getMarginAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        {profitMargin && profitMargin.breakdown ? (
          <Breakdown
            metric={t('Profit.ProfitMargin')}
            breakdown={profitMargin && profitMargin.breakdown}
            unit="%"
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {profitMargin && profitMargin.history ? (
          <Chart
            data={profitMargin && profitMargin.history}
            metric={t('Profit.ProfitMargin')}
            unit="%"
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>
    </div>
  );
};

export default Margin;
