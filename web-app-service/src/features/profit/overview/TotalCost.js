import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCostAsync, selectTotalCost } from '../profitSlice';
import Breakdown from './components/Breakdown';
import Chart from './components/Chart';

const TotalCost = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const totalCost = useSelector(selectTotalCost);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getTotalCostAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        <Breakdown
          metric="Total Cost"
          breakdown={totalCost && totalCost.breakdown}
        />
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        <Chart
          data={totalCost && totalCost.history}
          metric="Total Cost"
          unit="$"
          reversed={true}
        />
      </div>
    </div>
  );
};

export default TotalCost;
