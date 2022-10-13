import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XIcon,
  ArrowSmDownIcon,
  ArrowSmUpIcon,
} from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { Card } from 'components';
import Chart from './Chart.js';
import GraphSwitcher from './GraphSwitcher.js';
import { Toggle, Checkbox } from 'components/form';
import Modal from 'components/Modal';
import DatePicker from 'features/datePicker/DatePicker';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  getMetricsAsync,
  getProfitGraphAsync,
  selectMetrics,
  selectPrevMetrics,
  selectProfitGraph,
  selectPrevProfitGraph,
} from '../../profitSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import statTypes from '../data/stat-types.json';

const PerformanceGraphModal = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const metrics = useSelector(selectMetrics);
  const prevMetrics = useSelector(selectPrevMetrics);
  const profitGraph = useSelector(selectProfitGraph);
  const prevProfitGraph = useSelector(selectPrevProfitGraph);
  const selectedDates = useSelector(selectCurrentDateRange);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);
  const [filters, setFilters] = useState([]);
  const [prevDates, setPrevDates] = useState(null);
  const statOptions = [
    {
      title: t('Snapshots.PerformanceGraphModal.UnitsSold'),
      index: 'unitSold',
      prevValue: prevMetrics && prevMetrics.totalUnits,
      value: metrics && metrics.totalUnits,
      type: statTypes.number,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Orders'),
      index: 'order',
      prevValue: prevMetrics && prevMetrics.totalOrders,
      value: metrics && metrics.totalOrders,
      type: statTypes.number,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Revenues'),
      index: 'netRevenue',
      prevValue: prevMetrics && prevMetrics.netRevenue,
      value: metrics && metrics.netRevenue,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Promotions'),
      index: 'promotion',
      prevValue: prevMetrics && prevMetrics.promotions,
      value: metrics && metrics.promotions,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Refunds'),
      index: 'refund',
      prevValue: prevMetrics && prevMetrics.refunds,
      value: metrics && metrics.refunds,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Fees'),
      index: 'cost',
      prevValue: prevMetrics && prevMetrics.totalCost,
      value: metrics && metrics.totalCost,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.COGs'),
      index: 'cogs',
      prevValue: prevMetrics && prevMetrics.cogs,
      value: metrics && metrics.cogs,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.PPC'),
      index: 'ppc',
      prevValue:
        prevMetrics && (prevMetrics.ppcSales + prevMetrics.ppcSpend).toFixed(2),
      value: metrics && (metrics.ppcSales + metrics.ppcSpend).toFixed(2),
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Profit'),
      index: 'netProfit',
      prevValue: prevMetrics && prevMetrics.netProfit,
      value: metrics && metrics.netProfit,
      type: statTypes.currency,
    },
    {
      title: t('Snapshots.PerformanceGraphModal.Margins'),
      index: 'profitMargin',
      prevValue: prevMetrics && (prevMetrics.profitMargin * 100).toFixed(2),
      value: metrics && (metrics.profitMargin * 100).toFixed(2),
      type: statTypes.percent,
    },
  ];

  const [graphType, setGraphType] = useState(false);
  const onToggleGraphType = (graph) => {
    setGraphType(graph);
  };

  const [compare, setCompare] = useState(false);
  const onToggleCompare = () => {
    setCompare(!compare);
  };

  const onSelectStats = (e) => {
    const { checked, value } = e.target;

    let newFilters = [];
    if (filters.includes(value) === false) {
      newFilters = filters;
      if (checked) {
        newFilters.push(value);
      }
    } else if (!checked) {
      newFilters = filters.filter((filter) => {
        return value !== filter;
      });
    }
    setFilters([...newFilters]);
  };

  useEffect(() => {
    if (compare === true || selectedDates) {
      const { startDate, endDate } = selectedDates;
      const start = moment(startDate);
      const end = moment(endDate);
      const days = end.diff(start, 'days');
      const prevStart = start.subtract(1, 'year');
      const prevDates = {
        startDate: prevStart.format('YYYY-MM-DD'),
        endDate: prevStart.add(days, 'days').format('YYYY-MM-DD'),
      };
      setPrevDates(prevDates);
    }
  }, [selectedDates, compare]);

  useEffect(() => {
    dispatch(getMetricsAsync(selectedDates));
  }, [selectedDates, dispatch, currentAccount, currentMarketplace]);

  useEffect(() => {
    if (prevDates) {
      dispatch(getMetricsAsync(prevDates, true));
    }
  }, [prevDates, dispatch, currentAccount, currentMarketplace]);

  useEffect(() => {
    if (selectedDates && currentMarketplace && currentAccount) {
      dispatch(getProfitGraphAsync(selectedDates, filters));
    }
  }, [dispatch, selectedDates, currentMarketplace, currentAccount, filters]);

  useEffect(() => {
    if (prevDates && currentMarketplace && currentAccount) {
      dispatch(getProfitGraphAsync(prevDates, filters, true));
    }
  }, [
    dispatch,
    prevDates,
    currentMarketplace,
    currentAccount,
    filters,
    compare,
  ]);

  const formatValue = ({ type, value, prevValue }) => {
    let result = '';
    switch (type) {
      case statTypes.currency:
        result = '$' + parseFloat(value).toFixed(2);
        break;
      case statTypes.number:
        result = value;
        break;
      case statTypes.percent:
        result = parseFloat(value).toFixed(2) + '%';
        break;
      default:
        result = value;
        break;
    }
    let arrow = <ArrowSmDownIcon className="w-4 float-left" />;
    let A = prevValue;
    let B = value;
    if (prevValue < value) {
      arrow = <ArrowSmUpIcon className="w-4 float-left" />;
      A = value;
      B = prevValue;
    }

    A = A > 0 ? A : A * -1;
    B = B > 0 ? B : B * -1;
    let percDiff = 0;
    if (A !== 0 && B !== 0) {
      percDiff = (100 * Math.abs((A - B) / ((A + B) / 2))).toFixed(2);
    }
    let prefix = (
      <>
        {percDiff !== 0 ? arrow : ''}
        <span className="text-xs float-left mr-1">{percDiff}%</span>
      </>
    );

    return (
      <>
        {percDiff !== 'NaN' && compare ? prefix : ''}
        <span className="font-bold">{result}</span>
      </>
    );
  };
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-6xl md:w-full">
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-red rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">
              {t('Snapshots.PerformanceGraphModal.Close')}
            </span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 md:px-6 border-b-2 pb-3">
          <h3 className="text-md leading-6 font-medium text-gray-800">
            {t('Snapshots.PerformanceGraphModal.PerformanceGraph')}
          </h3>
        </div>

        {/* Data Controls */}
        <Card className="mb-8" flex>
          <div className="mr-5">
            <label
              htmlFor="productOption"
              className="block text-sm font-medium text-gray-700 pb-1 mr-5"
            >
              {t('Snapshots.PerformanceGraphModal.GraphType')}
            </label>
            <GraphSwitcher
              graphType={graphType}
              onToggleGraphType={onToggleGraphType}
            />
          </div>
          <div>
            <label
              htmlFor="comparePrevious"
              className="block text-sm font-medium text-gray-700 pb-1 mr-5 mb-2"
            >
              Compare Previous
            </label>
            <Toggle
              id="comparePrevious"
              checked={compare === true}
              onChange={() => onToggleCompare()}
            />
          </div>
          <div className="col-span-12 sm:col-span-4 xl:col-span-3">
            <DatePicker position="left" />
          </div>
        </Card>

        {/* Stat Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {statOptions ? (
            statOptions.map((stat) => (
              <div
                key={stat.index}
                className="relative bg-white px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <div className="flex-1 min-w-0">
                  <Checkbox
                    id={stat.index}
                    value={stat.index}
                    defaultChecked={filters.includes(stat.index)}
                    className="focus:outline-none mr-2"
                    onChange={onSelectStats}
                  />
                  <label htmlFor={stat.index} className="text-xs font-bold">
                    {stat.title}
                  </label>
                  <span className="float-right text-xs mt-2">
                    {formatValue(stat)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>{t('Loading')}</p>
          )}
        </div>

        {/* Graph Display */}
        <div className="col-span-5 h-96 bg-white px-4 py-5 sm:p-6 sm:col-span-3">
          {profitGraph ? (
            <Chart
              data={profitGraph}
              graphType={graphType}
              prevData={prevProfitGraph}
              showPrev={compare}
            />
          ) : (
            <p>{t('Loading')}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PerformanceGraphModal;
