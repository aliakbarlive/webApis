import axios from 'axios';
import moment from 'moment';
import { isObject } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import Navigation from './components/Navigation';

import {
  selectCurrentDateRange,
  setRange,
} from 'features/datePicker/datePickerSlice';

import ComparisonChart from './components/ComparisonChart';
import CampaignFilters from './components/CampaignFilters';
import DatePicker from 'features/datePicker/DatePicker';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

import classNames from 'utils/classNames';

const Snapshot = ({ accountId, marketplace, query }) => {
  const dispatch = useDispatch();
  const selectedDates = useSelector(selectCurrentDateRange);

  const [granularity, setGranularity] = useState('month');
  const [loading, setLoading] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRecords, setChartRecords] = useState({});

  const [selectedMonth, setSelectedMonth] = useState('July');

  const [performance, setPerformance] = useState({
    previous: { data: {}, dateRange: {} },
    current: { data: {}, dateRange: {} },
  });

  const [params, setParams] = useState({
    states: [],
    targetingTypes: [],
    campaignTypes: [],
    advCampaignIds: [],
    advPortfolioIds: [],
  });

  const monthOptions = [
    {
      value: 'Jan',
      dateRange: { startDate: '2022-01-01', endDate: '2022-01-31' },
    },
    {
      value: 'Feb',
      dateRange: { startDate: '2022-02-01', endDate: '2022-02-28' },
    },
    {
      value: 'Mar',
      dateRange: { startDate: '2022-03-01', endDate: '2022-03-31' },
    },
    {
      value: 'Apr',
      dateRange: { startDate: '2022-04-01', endDate: '2022-04-30' },
    },
    {
      value: 'May',
      dateRange: { startDate: '2022-05-01', endDate: '2022-05-31' },
    },
    {
      value: 'June',
      dateRange: { startDate: '2022-06-01', endDate: '2022-06-30' },
    },
    {
      value: 'July',
      dateRange: { startDate: '2022-07-01', endDate: '2022-07-31' },
    },
  ];

  const stats = [
    {
      key: 'ctr',
      name: 'CTR',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'cpc',
      name: 'CPC',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'roas',
      name: 'ROAS',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'acos',
      name: 'ACOS',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'tacos',
      name: 'TACOS',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'sales',
      name: 'Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'cost',
      name: 'Spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'orders',
      name: 'Orders',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'clicks',
      name: 'Clicks',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'impressions',
      name: 'Impressions',
      formatter: (value) => numberFormatter(value),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setChartLoading(true);

    setChartRecords({});

    setPerformance({
      previous: { data: {}, dateRange: {} },
      current: { data: {}, dateRange: {} },
    });

    const dates =
      granularity === 'custom'
        ? selectedDates
        : monthOptions.find((m) => m.value === selectedMonth).dateRange;

    const fetchData = async () => {
      const response = await axios.get('/advertising/analytics/overall', {
        params: {
          accountId,
          marketplace,
          getDiffInMonth: granularity === 'month',
          ...dates,
          ...params,
        },
      });

      const { data } = response.data;

      setPerformance(data);
      setLoading(false);

      const { dateRange } = data.previous;

      const attributes = [
        'acos',
        'sales',
        'cost',
        'orders',
        'clicks',
        'impressions',
      ];

      const [currentRecords, previousRecords] = await Promise.all(
        [
          selectedDates,
          {
            endDate: moment(dateRange.endDate).format('YYYY-MM-DD'),
            startDate: moment(dateRange.startDate).format('YYYY-MM-DD'),
          },
        ].map(async ({ startDate, endDate }) => {
          let apiRecords = [];

          if (granularity === 'custom') {
            const dailyRecordsResponse = await axios.get(
              '/advertising/campaigns/records',
              {
                params: {
                  endDate,
                  startDate,
                  accountId,
                  marketplace,
                  attributes: [...attributes, 'date'],
                  ...params,
                },
              }
            );

            const apiData = dailyRecordsResponse.data.data;
            let ref = moment(startDate);
            while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
              const date = ref.format('YYYY-MM-DD');
              let data = { date };

              const value = apiData.find((r) => r.date === date);

              attributes.forEach((metric) => {
                let metricValue =
                  isObject(value) && metric in value ? value[metric] : 0;

                data[metric] = ['acos', 'ctr', 'cr', 'tacos'].includes(metric)
                  ? parseFloat((parseFloat(metricValue) * 100).toFixed(2))
                  : metricValue;
              });

              apiRecords.push(data);
              ref.add(1, 'd');
            }
          }

          if (granularity === 'month') {
            const weeklyRecordsResponse = await axios.get(
              '/advertising/campaigns/weekly-records',
              {
                params: {
                  endDate,
                  startDate,
                  accountId,
                  marketplace,
                  attributes: [...attributes, 'date'],
                  ...params,
                },
              }
            );

            const weeklyRecords = weeklyRecordsResponse.data.data;
            weeklyRecords.forEach((record) => {
              apiRecords.push(record);
            });
          }
          return apiRecords;
        })
      );

      setChartLoading(false);
      let records = {};

      attributes.forEach((attr) => {
        records[attr] = [];
        currentRecords.forEach((r, i) => {
          records[attr][i] = {};
          records[attr][i]['current'] = r[attr];
          if (previousRecords[i]) {
            records[attr][i]['previous'] = previousRecords[i][attr];
          }
          records[attr][i]['date'] = r['date'];
        });
      });

      setChartRecords(records);
    };

    fetchData();
  }, [accountId, marketplace, selectedDates, params, granularity]);

  const onSelectMonth = (e) => {
    const { value } = e.target;
    const ref = monthOptions.find((m) => m.value === value);

    setSelectedMonth(value);
    dispatch(setRange(ref.dateRange));
  };

  return (
    <div>
      <CampaignFilters
        accountId={accountId}
        marketplace={marketplace}
        params={params}
        open={openFilters}
        setParams={setParams}
        setOpen={setOpenFilters}
      />

      <Navigation
        accountId={accountId}
        query={query}
        title="Marketplace Snapshot"
      />

      <div className="grid xl:grid-cols-2 gap-5 my-4 bg-white shadow rounded-lg p-4">
        <div>
          {granularity === 'custom' ? (
            <DatePicker position="left" showLabel={false} />
          ) : (
            <select
              className="border border-gray-300 text-sm font-medium focus:outline-none"
              value={selectedMonth}
              onChange={onSelectMonth}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.value} 2022
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end">
          <span className="relative mr-2 z-0 inline-flex shadow-sm rounded-md">
            <button
              type="button"
              className={classNames(
                'relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:outline-none',
                granularity === 'month'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 bg-white'
              )}
              onClick={() => setGranularity('month')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={classNames(
                '-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:outline-none',
                granularity === 'custom'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 bg-white'
              )}
              onClick={() => setGranularity('custom')}
            >
              Custom
            </button>
          </span>

          <button
            onClick={() => setOpenFilters(true)}
            className="bg-gray-600 text-sm text-white px-4 font-medium py-2 rounded"
          >
            All Campaigns
          </button>
        </div>
      </div>

      {'startDate' in performance.previous.dateRange && (
        <div className="mt-5 overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6 lg:pl-8"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  className="text-center px-3 py-3.5 text-left text-sm font-semibold text-gray-800"
                >
                  {moment(performance.current.dateRange.startDate).format(
                    'MMMM Do YYYY'
                  )}{' '}
                  -{' '}
                  {moment(performance.current.dateRange.endDate).format(
                    'MMMM Do YYYY'
                  )}
                </th>
                <th
                  scope="col"
                  className="text-center px-3 py-3.5 text-left text-sm font-semibold text-gray-800"
                >
                  {moment(performance.previous.dateRange.startDate).format(
                    'MMMM Do YYYY'
                  )}{' '}
                  -{' '}
                  {moment(performance.previous.dateRange.endDate).format(
                    'MMMM Do YYYY'
                  )}
                </th>
                <th
                  scope="col"
                  className="text-center py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6 lg:pl-8"
                >
                  Difference
                </th>
                <th
                  scope="col"
                  className="text-center py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-800 sm:pl-6 lg:pl-8"
                >
                  Percentage Change
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {stats.map((stat) => (
                <tr key={stat.key} className="divide-x divide-gray-200">
                  <td className="text-center whitespace-nowrap font-medium py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                    {stat.name}
                  </td>
                  <td className="text-center whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6 lg:pl-8">
                    {stat.formatter(performance.current.data[stat.key])}
                  </td>
                  <td className="text-center whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6 lg:pl-8">
                    {stat.formatter(performance.previous.data[stat.key])}
                  </td>
                  <td className="text-center whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6 lg:pl-8">
                    {stat.formatter(
                      performance.current.data[stat.key] -
                        performance.previous.data[stat.key]
                    )}
                  </td>
                  <td className="text-center whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6 lg:pl-8">
                    {performance.previous.data[stat.key]
                      ? percentageFormatter(
                          (performance.current.data[stat.key] -
                            performance.previous.data[stat.key]) /
                            Math.abs(performance.previous.data[stat.key])
                        )
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(chartRecords).length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { key: 'clicks', color: '#4CD8AE', formatter: numberFormatter },
            { key: 'sales', color: '#FAD677', formatter: currencyFormatter },
            { key: 'cost', color: '#B6305D', formatter: currencyFormatter },
            { key: 'orders', color: '#339EB1', formatter: numberFormatter },
            {
              key: 'impressions',
              color: '#7744AD',
              formatter: numberFormatter,
            },
            {
              key: 'acos',
              color: '#BE4F2E',
              title: 'ACOS',
              formatter: percentageFormatter,
            },
          ].map((attr) => (
            <ComparisonChart
              key={attr.key}
              dataKey={attr.key}
              data={chartRecords[attr.key]}
              color={attr.color}
              title={attr.title}
              formatter={attr.formatter}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Snapshot;
