import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoiAsync, selectRoi } from '../../profitSlice';
import Breakdown from '../Breakdown';
import Chart from '../Chart';
import { useTranslation } from 'react-i18next';

const Roi = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const Roi = useSelector(selectRoi);
  const { t } = useTranslation();
  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getRoiAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        {Roi && Roi.breakdown ? (
          <Breakdown
            metric={t('Profit.ROI')}
            breakdown={Roi && Roi.breakdown}
          />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {Roi && Roi.history ? (
          <Chart data={Roi && Roi.history} metric={t('Profit.ROI')} unit="%" />
        ) : (
          <p>{t('Loading')}</p>
        )}
      </div>
    </div>
  );
};

export default Roi;
