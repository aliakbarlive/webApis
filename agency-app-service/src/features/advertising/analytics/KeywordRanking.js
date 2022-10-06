import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const KeywordRanking = ({ accountId, marketplace, startDate, endDate }) => {
  const [selectedKeyword, setSelectedKeyword] = useState({});
  const [keywords, setKeywords] = useState({ rows: [] });

  useEffect(() => {
    axios
      .get('/advertising/keywords', {
        params: {
          accountId,
          marketplace,
          startDate,
          endDate,
          attributes:
            'advKeywordId,keywordText,cr,ctr,ipc,unitsPerOrder,costPerConvertedUnit',
          sort: 'cost:desc',
          include: ['metricsRanking'],
        },
      })
      .then((response) => {
        const { data } = response.data;
        setKeywords(data);

        if (data.count) {
          setSelectedKeyword(data.rows[0]);
        }
      });
  }, [accountId, marketplace, startDate, endDate]);

  return (
    <div className="my-8 border border-gray-300 bg-white rounded-md shadow-md mx-4">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-md">
        <p className="text-sm leading-6 font-medium text-gray-700">{`How does "${
          'keywordText' in selectedKeyword
            ? selectedKeyword.keywordText
            : 'Keyword'
        }" rank versus other keywords?`}</p>

        <div className="flex text-sm text-gray-700 items-center">
          <p className="mr-4">Select Keyword:</p>
          <select
            className="mt-3 text-xs text-gray-700"
            value={selectedKeyword.advKeywordId}
            onChange={(e) =>
              setSelectedKeyword(
                keywords.rows.find((k) => k.advKeywordId === e.target.value)
              )
            }
          >
            {keywords.rows.map((row) => (
              <option key={row.advKeywordId} value={row.advKeywordId}>
                {row.keywordText}
              </option>
            ))}
          </select>
        </div>
      </div>

      {'advKeywordId' in selectedKeyword && (
        <div>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={[
                  {
                    subject: 'Impressions per $1 ad spend',
                    value: selectedKeyword.ipcRanking,
                  },
                  {
                    subject: 'CTR',
                    value: selectedKeyword.ctrRanking,
                  },
                  {
                    subject: 'Conversion Rate',
                    value: selectedKeyword.crRanking,
                  },
                  {
                    subject: 'Relative Rank',
                    value: selectedKeyword.unitsPerOrderRanking,
                  },
                ]}
              >
                <PolarGrid gridType="circle" />

                <PolarAngleAxis
                  dataKey="subject"
                  style={{ fontSize: '0.65rem' }}
                />

                <PolarRadiusAxis />
                <Radar
                  name={selectedKeyword.keywordText}
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-4 px-4">
            <div className="col-span-2 text-xs">
              <p className="font-medium mb-2">Metrics</p>
              <p className="mb-1">Impressions per $1 ad spend</p>
              <p className="mb-1">CTR</p>
              <p className="mb-1">Conversion Rate</p>
              <p className="mb-1">Units per order</p>
              <p className="mb-1">Total cost per converted unit</p>
            </div>

            <div className="text-xs">
              <p className="font-medium mb-2">Value</p>
              <p className="mb-1">{currencyFormatter(selectedKeyword.ipc)}</p>
              <p className="mb-1">{percentageFormatter(selectedKeyword.ctr)}</p>
              <p className="mb-1">{percentageFormatter(selectedKeyword.cr)}</p>
              <p className="mb-1">
                {numberFormatter(selectedKeyword.unitsPerOrder)}
              </p>
              <p className="mb-1">
                {currencyFormatter(selectedKeyword.costPerConvertedUnit)}
              </p>
            </div>

            <div className="text-xs">
              <p className="font-medium mb-2">Relative rank</p>
              <p className="mb-1">{selectedKeyword.ipcRanking}</p>
              <p className="mb-1">{selectedKeyword.ctrRanking}</p>
              <p className="mb-1">{selectedKeyword.crRanking}</p>
              <p className="mb-1">{selectedKeyword.unitsPerOrderRanking}</p>
              <p className="mb-1">
                {selectedKeyword.costPerConvertedUnitRanking}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordRanking;
