import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import axios from 'axios';
import moment from 'moment';
import { isObject, uniq } from 'lodash';

import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  numberFormatter,
  percentageFormatter,
  currencyFormatter,
} from 'utils/formatters';

const MetricsChart = ({ accountId, marketplace, selectedMetrics }) => {
  const { t } = useTranslation();
  const selectedDates = useSelector(selectCurrentDateRange);
  const [records, setRecords] = useState([]);
  const chartStyle = {
    fontSize: '0.8rem',
  };

  const metrics = [
    { label: t('Advertising.Metrics.Impressions'), value: 'impressions' },
    { label: t('Advertising.Metrics.Clicks'), value: 'clicks' },
    { label: t('Advertising.Metrics.Cost'), value: 'cost' },
    {
      label: t('Advertising.Metrics.Sales'),
      value: 'sales',
    },
    {
      label: t('Advertising.Metrics.Orders'),
      value: 'orders',
    },
    { label: t('Advertising.Metrics.CostPerClick'), value: 'cpc' },
    { label: t('Advertising.Metrics.ClickThroughRate'), value: 'ctr' },
    { label: t('Advertising.Metrics.ConversionRate'), value: 'cr' },
    { label: t('Advertising.Metrics.ACOS'), value: 'acos' },
  ];

  useEffect(() => {
    const { startDate, endDate } = selectedDates;
    const params = {
      endDate,
      startDate,
      accountId,
      marketplace,
      attributes: [...selectedMetrics, 'date'],
    };

    let apiRecords = [];

    axios.get('/advertising/campaigns/records', { params }).then((response) => {
      const apiData = response.data.data;

      let ref = moment(startDate);

      while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
        const date = ref.format('YYYY-MM-DD');
        let data = { date };

        const value = apiData.find((r) => r.date === date);

        selectedMetrics.forEach((metric) => {
          let metricValue =
            isObject(value) && metric in value ? value[metric] : 0;

          data[metric] = ['acos', 'ctr', 'cr', 'tacos'].includes(metric)
            ? parseFloat((parseFloat(metricValue) * 100).toFixed(2))
            : metricValue;
        });

        apiRecords.push(data);
        ref.add(1, 'd');
      }
      setRecords(apiRecords);
    });
  }, [accountId, marketplace, selectedDates, selectedMetrics]);

  const sortedSelectedMetrics = (metrics) => {
    return uniq(metrics);
  };

  const setAxisId = (index) => {
    if (index == 0) {
      return 'left';
    }
    if (index == 1) {
      if (
        selectedMetrics[index] == selectedMetrics[2] &&
        selectedMetrics[index] != selectedMetrics[0]
      )
        return 'right';

      if (
        selectedMetrics[index] != selectedMetrics[0] &&
        selectedMetrics[index] != selectedMetrics[2]
      ) {
        if (selectedMetrics[0] == selectedMetrics[2]) return 'right';
        else return 'left';
      } else return 'left';
    }
    if (index == 2) {
      if (selectedMetrics[index] == selectedMetrics[0]) return 'left';
      else return 'right';
    }
  };

  return (
    <div
      id="metrics-chart"
      className="w-full mt-4 bg-white shadow rounded-lg p-4 pb-0"
    >
      <div className="w-full h-72 md:h-60 mt-2">
        <ResponsiveContainer className="w-full" height="100%">
          <ComposedChart className="w-full" data={records}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={chartStyle} />
            <YAxis yAxisId="left" style={chartStyle} />
            <YAxis yAxisId="right" orientation="right" style={chartStyle} />
            <Tooltip
              wrapperStyle={chartStyle}
              formatter={function (value, name) {
                const metric = metrics.find(
                  (metric) => metric.value.toLowerCase() === name.toLowerCase()
                );

                return ['acos', 'ctr', 'cr'].includes(metric.value)
                  ? percentageFormatter(value / 100)
                  : ['cpc', 'cost', 'sales'].includes(metric.value)
                  ? currencyFormatter(value)
                  : numberFormatter(value);
              }}
            />
            <Legend />

            {sortedSelectedMetrics(selectedMetrics).map((metric, index) => {
              return metric === 'impressions' ? (
                <Bar
                  key={`bar-chart-${index}`}
                  yAxisId={setAxisId(index)}
                  fill={
                    index === 2
                      ? '#f9dc7d'
                      : index === 1
                      ? '#82ca9d'
                      : '#8884d8'
                  }
                  type="monotone"
                  dataKey={metric}
                  strokeWidth={3}
                />
              ) : (
                <Line
                  name={metric == 'acos' ? 'ACoS' : metric}
                  key={`line-chart-${index}`}
                  yAxisId={setAxisId(index)}
                  stroke={
                    index === 2
                      ? '#f9dc7d'
                      : index === 1
                      ? '#82ca9d'
                      : '#8884d8'
                  }
                  type="monotone"
                  dataKey={metric}
                  strokeWidth={3}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
