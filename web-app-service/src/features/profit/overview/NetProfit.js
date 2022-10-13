import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNetProfitAsync, selectNetProfit } from '../profitSlice';
import Breakdown from './components/Breakdown';
import Chart from './components/Chart';

const NetProfit = ({ currentAccount, currentMarketplace, selectedDates }) => {
  const dispatch = useDispatch();

  const netProfit = useSelector(selectNetProfit);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getNetProfitAsync(selectedDates));
    }
  }, [selectedDates, currentMarketplace, currentAccount, dispatch]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-5">
      <div className="col-span-5 sm:col-span-2">
        <Breakdown
          metric="Net Profit"
          breakdown={netProfit && netProfit.breakdown}
        />
      </div>

      <div className="col-span-5 h-96 bg-white shadow rounded-lg px-4 py-5 sm:p-6 sm:col-span-3">
        <Chart
          data={netProfit && netProfit.history}
          metric="Net Profit"
          unit="$"
        />
      </div>
    </div>
  );
};

export default NetProfit;

/* <Disclosure as="div" key="question" className="pt-6">
          {({ open }) => (
            <>
              <dt className="text-base">
                <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                  <div className="flex items-center">
                    <span className="h-7 flex items-center">
                      <ChevronDownIcon
                        className={classNames(
                          open ? '-rotate-180' : 'rotate-0',
                          'h-4 w-4 transform'
                        )}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-2 font-medium text-gray-900">
                      Net Revenue
                    </span>
                  </div>

                  <span>$300.00</span>
                </Disclosure.Button>
              </dt>
              <Disclosure.Panel as="dd" className="mt-2 pr-12">
                <p className="text-base text-gray-500">Answer</p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure> */
