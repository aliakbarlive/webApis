import axios from 'axios';
import { useState, useEffect } from 'react';
import TargetingList from 'features/advertising/components/sections/TargetingList';

const KeywordsPerformaceTable = ({ reportId }) => {
  const [minSpend, setMinSpend] = useState(1);
  const [mostProfitable, setMostProfitable] = useState({ rows: [] });
  const [leastProfitable, setLeastProfitable] = useState({ rows: [] });

  useEffect(() => {
    let params = {
      attributes: 'advTargetingId,value,roas,orders,impressions,cpcon,cost',
    };

    if (minSpend) {
      params.costGreaterThanOrEqualTo = minSpend;
    }

    axios
      .get(`/advertising/reports/${reportId}/targetings`, {
        params: { ...params, sort: 'roas:desc' },
      })
      .then((resposne) => setMostProfitable(resposne.data.data));

    axios
      .get(`/advertising/reports/${reportId}/targetings`, {
        params: { ...params, sort: 'roas:asc' },
      })
      .then((resposne) => setLeastProfitable(resposne.data.data));
  }, [reportId, minSpend]);

  return (
    <div className="flex flex-col mt-12 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between rounded-t-xl">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Keywords Performance
        </p>

        <div className="mt-1 flex items-center">
          <span className="text-gray-600 text-sm mr-2">
            Enter minimum spend
          </span>
          <input
            type="number"
            value={minSpend}
            onChange={(e) => setMinSpend(e.target.value)}
            className="w-24 text-xs block px-3 py-2 rounded-md focus:outline-none appearance-none focus:ring-0 focus:border-gray-300 border-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-4 sm:px-6 py-6 w-full">
        <div className="w-full">
          <p className="text-gray-600 font-medium text-sm leading-6 mb-2">
            10 most profitable keywords
          </p>

          <TargetingList bgColor="bg-green-500" rows={mostProfitable.rows} />
        </div>
        <div>
          <p className="text-gray-600 font-medium text-sm leading-6 mb-2">
            10 least profitable keywords
          </p>

          <TargetingList bgColor="bg-red-500" rows={leastProfitable.rows} />
        </div>
      </div>
    </div>
  );
};

export default KeywordsPerformaceTable;
