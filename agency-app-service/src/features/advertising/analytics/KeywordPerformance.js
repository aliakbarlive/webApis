import axios from 'axios';
import { useEffect, useState } from 'react';
import classNames from 'utils/classNames';

import TargetingList from '../components/sections/TargetingList';

const KeywordPerformance = ({ accountId, marketplace, endDate, startDate }) => {
  const [sortBy, setSortBy] = useState('desc');
  const [minSpend, setMinSpend] = useState(1);
  const [targetings, setTargetings] = useState({ rows: [] });

  useEffect(() => {
    let params = {
      page: 1,
      pageSize: 10,
      attributes:
        'advTargetingId,value,roas,cost,orders,impressions,cpcon,sales',
      startDate,
      endDate,
      accountId,
      marketplace,
      sort: `roas:${sortBy}`,
    };

    if (minSpend) {
      params.costGreaterThan = minSpend;
    }

    axios
      .get('/advertising/targetings', { params })
      .then((response) => setTargetings(response.data.data));
  }, [accountId, marketplace, startDate, endDate, sortBy, minSpend]);

  return (
    <div className="flex flex-col mt-12 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between rounded-t-xl">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Performance Breakdown by Campaign Type
        </p>

        <div className="mt-1 flex items-center">
          <span className="text-gray-500 text-sm mr-2">
            Enter minimum spend
          </span>
          <input
            type="number"
            value={minSpend}
            onChange={(e) => setMinSpend(e.target.value)}
            className="w-20 text-xs block px-3 py-2 rounded-md bg-gray-50 px-4 py-2 focus:outline-none appearance-none focus:ring-0 focus:border-none border-none"
          />
        </div>
      </div>

      <div className="flex px-6 py-4 justify-between items-center">
        <p className="text-gray-700 font-medium">
          10 {sortBy === 'asc' ? 'least' : 'most'} profitable keywords
        </p>
        <div className="flex items-center">
          <p className="text-xs mr-3 text-gray-700">Sort by</p>
          <div className="relative z-0 inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setSortBy('desc')}
              className={classNames(
                sortBy === 'desc'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-500',
                'relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-xs font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500'
              )}
            >
              Most
            </button>
            <button
              type="button"
              onClick={() => setSortBy('asc')}
              className={classNames(
                sortBy === 'asc'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-500',
                '-ml-px relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-xs font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500'
              )}
            >
              Least
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <TargetingList
          bgColor={`bg-${sortBy === 'asc' ? 'red' : 'green'}-500`}
          rows={targetings.rows}
        />
      </div>
    </div>
  );
};

export default KeywordPerformance;
