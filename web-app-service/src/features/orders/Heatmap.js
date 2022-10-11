import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@heroicons/react/outline';

import DatePicker from 'features/datePicker/DatePicker';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../accounts/accountsSlice';

import { selectOrderStates, getStatesAsync } from './ordersSlice';
import { selectCurrentDateRange } from '../datePicker/datePickerSlice';

import { Card, ProductsSlideOver } from 'components';
import Filter from './components/Filter';
import MapChart from './components/MapChart';

const Heatmap = () => {
  const dispatch = useDispatch();

  const states = useSelector(selectOrderStates);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [content, setContent] = useState('');
  const [productSlideOver, setProductSlideOver] = useState(false);
  const [params, setParams] = useState({});

  let totalOrders = 0;
  if (states != null) {
    for (let i = 0; i < states.length; i++) {
      totalOrders += parseInt(states[i].stateCount);
    }
  }

  useEffect(() => {
    dispatch(getStatesAsync(params));
  }, [dispatch, selectedDates, params, account, marketplace]);

  const onSelectProduct = ({ asin }) => {
    let newParams = { ...params };
    asin === 'All Products' ? delete newParams.asin : (newParams.asin = asin);
    setParams(newParams);
  };
  return (
    <div>
      <ProductsSlideOver
        open={productSlideOver}
        setOpen={setProductSlideOver}
        onSelect={onSelectProduct}
      />

      {/* Filters */}
      <Card className="mb-8" flex>
        <div>
          <label
            htmlFor="productOption"
            className="block text-sm font-medium text-gray-700 pb-1"
          >
            Product
          </label>
          <button
            className="flex justify-between w-40 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
            onClick={() => setProductSlideOver(true)}
          >
            <span>{params.asin || 'All Products'}</span>
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          </button>
        </div>

        <Filter params={params} setParams={setParams} />

        <div className="ml-4 col-span-12 sm:col-span-4 xl:col-span-3">
          <DatePicker />
        </div>
      </Card>

      {/* HeatMap */}
      <div className="flex flex-col bg-white rounded border shadow px-48">
        {states ? (
          <>
            <MapChart
              setTooltipContent={setContent}
              states={states}
              totalOrders={totalOrders}
            />
            <ReactTooltip html={true}>{content}</ReactTooltip>
          </>
        ) : (
          <strong>Loading....</strong>
        )}
      </div>
    </div>
  );
};

export default Heatmap;
