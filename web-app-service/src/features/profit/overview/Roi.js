import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoiAsync, selectRoi } from '../profitSlice';
import Breakdown from './components/Breakdown';
import Chart from './components/Chart';

const Roi = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const Roi = useSelector(selectRoi);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getRoiAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        <Breakdown
          metric="Return on Investment"
          breakdown={Roi && Roi.breakdown}
        />
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        <Chart
          data={Roi && Roi.history}
          metric="Return on Investment"
          unit="%"
        />
      </div>
    </div>
  );
};

export default Roi;
