import React, { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

const MetricsFilter = ({
  onApplyFilter,
  params,
  additionalMetric = [],
  salesAttribute = 'attributedSales30d',
  ordersAttribute = 'attributedConversions30d',
}) => {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState([
    ...additionalMetric,
    { display: 'ACOS', key: 'acos', min: '', max: '' },
    {
      display: 'Impr.',
      key: 'impressions',
      min: '',
      max: '',
    },
    { display: 'Clicks', key: 'clicks', min: '', max: '' },
    { display: 'Spend', key: 'cost', min: '', max: '' },
    {
      display: 'Sales',
      key: salesAttribute,
      min: '',
      max: '',
    },
    {
      display: 'Orders',
      key: ordersAttribute,
      min: '',
      max: '',
    },
    { display: 'CPC', key: 'cpc', min: '', max: '' },
    { display: 'CTR', key: 'ctr', min: '', max: '' },
    { display: 'CR', key: 'cr', min: '', max: '' },
  ]);

  const applyFilter = () => {
    let newParams = { ...params, page: 1 };
    let metricsArray = [...metrics];

    metricsArray.forEach((metricFilter) => {
      const minQueryKey = `${metricFilter.key}GreaterThanOrEqualTo`;
      const maxQueryKey = `${metricFilter.key}LessThanOrEqualTo`;

      delete newParams[minQueryKey];
      delete newParams[maxQueryKey];

      if (metricFilter.min) {
        newParams[minQueryKey] = queryValue(metricFilter.key, metricFilter.min);
      }

      if (metricFilter.max) {
        newParams[maxQueryKey] = queryValue(metricFilter.key, metricFilter.max);
      }
    });
    onApplyFilter(newParams);
    setOpen(false);
  };

  const queryValue = (attr, value) => {
    if (attr === 'acos' || attr === 'ctr' || attr === 'cr') {
      return parseFloat(value) / 100;
    }
    return parseFloat(value);
  };

  const clearFilters = () => {
    let newMetrics = [...metrics];
    newMetrics.map((metric) => {
      metric.min = '';
      metric.max = '';
      return metric;
    });
    setMetrics(newMetrics);
    applyFilter();
  };

  const updateValue = (e) => {
    const [i, as] = e.target.id.split('-');
    let newMetrics = [...metrics];
    newMetrics[i][as] = e.target.value;
    setMetrics(newMetrics);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between py-2 px-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        >
          Metrics Filter
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            static
            className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="px-4 py-3">
              {metrics.map((metric, index) => {
                return (
                  <div key={index} className="flex mb-1">
                    <div className="flex flex-grow items-center">
                      <p className="text-xs">{metric.display}</p>
                    </div>
                    <div className="flex block">
                      <input
                        id={`${index}-min`}
                        type="number"
                        placeholder="min"
                        value={metric.min}
                        onChange={updateValue}
                        className="mr-1 text-xs appearance-none w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />

                      <input
                        id={`${index}-max`}
                        type="number"
                        placeholder="max"
                        value={metric.max}
                        onChange={updateValue}
                        className="text-xs appearance-none w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                );
              })}
              <div className="mt-4">
                <button
                  className="mr-1 py-1 px-2 border border-transparent rounded-md shadow-sm text-xs text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                  onClick={applyFilter}
                >
                  Apply filters
                </button>
                <button
                  className="py-1 px-2 border border-transparent rounded-md shadow-sm text-xs text-red-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  onClick={clearFilters}
                  disabled={!metrics.some((m) => m.min || m.max)}
                >
                  Clear filters
                </button>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </>
    </Menu>
  );
};
export default MetricsFilter;
