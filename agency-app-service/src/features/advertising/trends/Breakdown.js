import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import Checkbox from 'components/Forms/Checkbox';
import Navigation from './components/Navigation';
import GranularChart from './components/GranularChart';
import CampaignFilters from './components/CampaignFilters';

import classNames from 'utils/classNames';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';
import DatePicker from 'features/datePicker/DatePicker';

const Breakdown = ({ accountId, marketplace, query }) => {
  const selectedDates = useSelector(selectCurrentDateRange);

  const [granularity, setGranularity] = useState('month');
  const [records, setRecords] = useState([]);

  const [openFilters, setOpenFilters] = useState(false);
  const [viewOptions, setViewOptions] = useState(false);
  const [visibleStats, setVisibleStats] = useState([
    'ctr',
    'cpc',
    'roas',
    'acos',
    'tacos',
    'sales',
    'cost',
    'orders',
    'clicks',
    'impressions',
  ]);

  const [params, setParams] = useState({
    states: [],
    targetingTypes: [],
    campaignTypes: [],
    advCampaignIds: [],
    advPortfolioIds: [],
  });

  const onChangeVisibleStats = (e) => {
    const { id, checked } = e.target;
    setVisibleStats(
      checked ? [...visibleStats, id] : visibleStats.filter((s) => s !== id)
    );
  };

  const stats = [
    {
      key: 'ctr',
      name: 'CTR',
      formatter: (value) => percentageFormatter(value),
      axis: 'right',
      color: '#2661e0',
    },
    {
      key: 'cpc',
      name: 'CPC',
      formatter: (value) => currencyFormatter(value),
      axis: 'right',
      color: '#53a341',
    },
    {
      key: 'roas',
      name: 'ROAS',
      formatter: (value) => percentageFormatter(value),
      axis: 'right',
      color: '#662834',
    },
    {
      key: 'acos',
      name: 'ACOS',
      formatter: (value) => percentageFormatter(value),
      axis: 'right',
      color: '#BE4F2E',
    },
    {
      key: 'tacos',
      name: 'TACOS',
      formatter: (value) => percentageFormatter(value),
      axis: 'right',
      color: '#f1a615',
    },
    {
      key: 'sales',
      name: 'Sales',
      formatter: (value) => currencyFormatter(value),
      axis: 'left',
      color: '#FAD677',
    },
    {
      key: 'cost',
      name: 'Spend',
      formatter: (value) => currencyFormatter(value),
      axis: 'left',
      color: '#B6305D',
    },
    {
      key: 'orders',
      name: 'Orders',
      formatter: (value) => numberFormatter(value),
      axis: 'left',
      color: '#339EB1',
    },
    {
      key: 'clicks',
      name: 'Clicks',
      formatter: (value) => numberFormatter(value),
      axis: 'left',
      color: '#4CD8AE',
    },
    {
      key: 'impressions',
      name: 'Impressions',
      formatter: (value) => numberFormatter(value),
      axis: 'left',
      color: '#7744AD',
    },
  ];

  useEffect(() => {
    axios
      .get(`/advertising/analytics/${granularity}`, {
        params: { accountId, marketplace, ...params, ...selectedDates },
      })
      .then((response) => setRecords(response.data.data))
      .catch((err) => console.log(err));
  }, [accountId, marketplace, granularity, params, selectedDates]);

  return (
    <div>
      <Navigation
        accountId={accountId}
        query={query}
        title="Marketplace Breakdown"
      />

      <CampaignFilters
        params={params}
        open={openFilters}
        setParams={setParams}
        setOpen={setOpenFilters}
        accountId={accountId}
        marketplace={marketplace}
      />

      <Modal
        open={viewOptions}
        setOpen={setViewOptions}
        as={'div'}
        align="top"
        noOverlayClick={true}
        persistent={true}
      >
        <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader
            title="Show / Hide Metrics"
            titleClasses="text-sm font-normal"
            setOpen={setViewOptions}
          />
          <div className="my-4">
            <div>
              <ul>
                {stats.map((stat) => {
                  return (
                    <li key={stat.key}>
                      <Checkbox
                        id={stat.key}
                        classes="my-2 mx-3"
                        checked={visibleStats.includes(stat.key)}
                        onChange={onChangeVisibleStats}
                      />
                      <label className="text-xs font-medium text-gray-700 ml-3 w-full mt-2 cursor-pointer">
                        {stat.name}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex justify-between mt-3">
        <div>
          <DatePicker position="left" showLabel={false} />
        </div>
        <div>
          <button
            onClick={() => setOpenFilters(true)}
            className="mr-2 bg-gray-600 text-sm text-white px-3 py-2 rounded"
          >
            All Campaigns
          </button>
          <button
            onClick={() => setViewOptions(true)}
            className="bg-gray-600 text-sm text-white px-3 py-2 rounded"
          >
            Options
          </button>
        </div>
      </div>

      <GranularChart
        data={records}
        stats={stats}
        visibleStats={visibleStats}
        setVisibleStats={setVisibleStats}
      />

      <div className="flex justify-end">
        <span className="relative mt-4 z-0 inline-flex shadow-sm rounded-md">
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
              granularity === 'week'
                ? 'bg-red-600 text-white'
                : 'text-gray-700 bg-white'
            )}
            onClick={() => setGranularity('week')}
          >
            Weekly
          </button>
        </span>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-xs font-medium text-gray-900 sm:pl-6"
                    >
                      Period Begining
                    </th>
                    {stats.map((stat) => {
                      return (
                        <th
                          key={stat.key}
                          scope="col"
                          className="px-4 py-3.5 text-left text-xs font-medium text-gray-900"
                        >
                          {stat.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {records.map((record) => (
                    <tr
                      key={record.startDate}
                      className="divide-x divide-gray-200"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-xs font-medium text-gray-900 sm:pl-6">
                        {record.startDate} - {record.endDate}
                      </td>
                      {stats.map((stat) => {
                        return (
                          <td
                            key={stat.key}
                            className="whitespace-nowrap p-4 text-xs text-gray-500"
                          >
                            {stat.formatter(record[stat.key])}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breakdown;
