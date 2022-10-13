import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isObject } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { numberFormatter, percentageFormatter } from 'utils/formatter';
import Select from 'components/form/Select';

const MetricsChart = ({ url, campaignType, customAttributes }) => {
  const selectedDates = useSelector(selectCurrentDateRange);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const [data, setData] = useState([]);
  const chartStyle = {
    fontSize: '0.8rem',
  };

  const metrics = [
    {
      label: 'Impressions',
      value: 'impressions',
    },
    { label: 'Clicks', value: 'clicks' },
    { label: 'Spend', value: 'cost' },
    {
      label: 'Sales',
      value: customAttributes['sales'],
    },
    {
      label: 'Orders',
      value: customAttributes['orders'],
    },
    { label: 'Cost per Click', value: 'cpc' },
    { label: 'Click through rate', value: 'ctr' },
    { label: 'Conversion Rate', value: 'cr' },
    { label: 'ACOS', value: 'acos' },
  ];

  const [selectedMetrics, setSelectedMetrics] = useState([
    metrics[0],
    metrics[1],
  ]);

  const onChangeMetric = (e) => {
    const { id, value } = e.target;
    let newSelectedMetrics = [...selectedMetrics];
    newSelectedMetrics[id] = metrics.find((m) => m.value === value);
    setSelectedMetrics(newSelectedMetrics);
  };

  useEffect(() => {
    const { startDate, endDate } = selectedDates;
    const attributes = selectedMetrics.map((m) => m.value).join(',');
    const params = {
      endDate,
      startDate,
      attributes,
      campaignType,
      accountId: account.accountId,
      marketplace: marketplace.details.countryCode,
    };

    axios
      .get(url, {
        params,
      })
      .then((res) => {
        const apiData = res.data.data;
        const chartData = [];

        let ref = moment(startDate);
        while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
          const date = ref.format('YYYY-MM-DD');
          const value = apiData.find((r) => r.date === date);
          let data = { date };
          selectedMetrics.forEach((metric) => {
            let metricValue =
              isObject(value) && metric.value in value
                ? value[metric.value]
                : 0;

            data[metric.label] = ['acos', 'ctr', 'cr'].includes(metric.value)
              ? (parseFloat(metricValue) * 100).toFixed(2)
              : metricValue;
          });

          chartData.push(data);
          ref.add(1, 'd');
        }
        setData(chartData);
      });
  }, [account, marketplace, url, campaignType, selectedDates, selectedMetrics]);

  return (
    <div className="mt-4 xl:mt-0 xl:ml-4 bg-white shadow rounded-lg p-4 pb-0">
      <div className="md:grid md:grid-cols-5">
        <div className="flex items-center col-span-2">
          <p className="font-medium text-sm">Trend Comparison</p>
        </div>
        <div className="mt-2 md:mt-0 sm:grid sm:grid-cols-2 gap-2 col-span-3">
          {selectedMetrics.map((sm, i) => (
            <Select
              id={i}
              key={`metric-selection-${i}`}
              className="font-medium text-sm mb-2 md:mb-0"
              options={metrics}
              value={sm.value}
              onChange={onChangeMetric}
            />
          ))}
        </div>
      </div>

      <div className="h-72 md:h-60 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={chartStyle} />
            <YAxis yAxisId="left" style={chartStyle} />
            <YAxis yAxisId="right" orientation="right" style={chartStyle} />
            <Tooltip
              wrapperStyle={chartStyle}
              formatter={function (value, name) {
                const metric = metrics.find((metric) => metric.label === name);

                return ['acos', 'ctr', 'cr'].includes(metric.value)
                  ? percentageFormatter(value / 100)
                  : numberFormatter(value);
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={selectedMetrics[0].label}
              stroke="#8884d8"
              strokeWidth={3}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={selectedMetrics[1].label}
              stroke="#82ca9d"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
