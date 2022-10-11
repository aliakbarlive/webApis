import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMarginAsync, selectMargin } from '../profitSlice';
import Breakdown from './components/Breakdown';

const Margin = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const profitMargin = useSelector(selectMargin);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getMarginAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        <Breakdown
          metric="Profit Margin"
          breakdown={profitMargin && profitMargin.breakdown}
          unit="%"
        />
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {/* <Chart
          data={profitMargin && profitMargin.history}
          metric="Profit Margin"
          unit="%"
        /> */}
      </div>
    </div>
  );
};

export default Margin;
