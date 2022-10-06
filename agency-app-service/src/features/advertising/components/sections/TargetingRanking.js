import { useState, useEffect } from 'react';

import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import classNames from 'utils/classNames';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const TargetingRanking = ({ targetings }) => {
  const [selected, setSelected] = useState({});

  const metrics = [
    {
      key: 'impressionsPerSpend',
      text: 'Impressions per $1 spend',
      formatter: numberFormatter,
    },
    {
      key: 'ctr',
      text: 'CTR',
      formatter: percentageFormatter,
    },
    {
      key: 'cr',
      text: 'Conversion Rate',
      formatter: percentageFormatter,
    },
    {
      key: 'unitsPerOrder',
      text: 'Units per order',
      formatter: numberFormatter,
    },
  ];

  useEffect(() => {
    if (!selected.advTargetingId && targetings.rows.length) {
      setSelected(targetings.rows[0]);
    }
  }, [targetings]);

  return (
    <div className="flex flex-col mt-12 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between rounded-t-xl">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          Keywords Ranking
        </p>

        <div className="mt-1 flex items-center">
          <span className="text-gray-600 text-xs mr-2">
            Choose a keyword to compare
          </span>

          <select
            value={selected.advTargetingId}
            onChange={(e) =>
              setSelected(
                targetings.rows.find((t) => t.advTargetingId === e.target.value)
              )
            }
            className="text-xs block px-3 py-2 rounded-md focus:outline-none appearance-none focus:ring-0 focus:border-gray-300 border-gray-300"
          >
            {targetings.rows.map((targeting) => (
              <option
                key={targeting.advTargetingId}
                value={targeting.advTargetingId}
              >
                {targeting.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected.advTargetingId ? (
        <>
          <div className="">
            <p className="my-6 text-center font-bold text-gray-600">
              How does <span className="text-si-pink">{selected.value}</span>{' '}
              rank versus other keywords ?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16 px-4 sm:px-6 py-6 w-full">
            <div className="w-full h-72">
              <ResponsiveContainer height="100%">
                <BarChart
                  data={metrics.map(({ key, text }) => {
                    return {
                      text,
                      ranking: selected[`${key}Ranking`],
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3" vertical={false} />

                  <XAxis dataKey="text" style={{ fontSize: '0.75rem' }} />

                  <YAxis
                    tickFormatter={(value) => numberFormatter(value)}
                    style={{ fontSize: '0.6rem' }}
                  />

                  <Bar dataKey="ranking" fill="#FF89A6" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <td className="py-2.5" colSpan={3}></td>
                    <td className="py-2.5">Value</td>
                    <td className="py-2.5">Relative Rank</td>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...metrics,
                    {
                      key: 'costPerConvertedUnit',
                      text: 'Total Cost per converted unit',
                      formatter: currencyFormatter,
                    },
                  ].map((metric, index) => {
                    return (
                      <tr key={metric.key} className="text-gray-500 text-xs">
                        <td
                          className={classNames(
                            'py-3 px-2',
                            index === 4 ? 'font-bold border-t pt-8' : ''
                          )}
                          colSpan={3}
                        >
                          {metric.text}
                        </td>
                        <td
                          className={classNames(
                            'py-3',
                            index === 4 ? 'font-bold border-t pt-8' : ''
                          )}
                        >
                          {metric.formatter(selected[metric.key])}
                        </td>
                        <td
                          className={classNames(
                            'py-3',
                            index === 4 ? 'font-bold border-t pt-8' : ''
                          )}
                        >
                          {numberFormatter(selected[`${metric.key}Ranking`])}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        'Please'
      )}
    </div>
  );
};

export default TargetingRanking;
