import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNetRevenueAsync, selectNetRevenue } from '../profitSlice';
import Breakdown from './components/Breakdown';

const NetRevenue = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const netRevenue = useSelector(selectNetRevenue);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getNetRevenueAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        <Breakdown
          metric="Net Revenue"
          breakdown={netRevenue && netRevenue.breakdown}
        />
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        {/* <Chart data={netRevenue && netRevenue.history} metric="Net Revenue" unit="$" /> */}
      </div>
    </div>
  );
};

export default NetRevenue;
