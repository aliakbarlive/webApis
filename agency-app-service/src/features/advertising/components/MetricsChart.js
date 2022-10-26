import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

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

import Select from 'components/Forms/Select';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const MetricsChart = ({
  url,
  accountId,
  marketplace,
  campaignType,
  customAttributes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [hiddenAttribute, setHiddenAttribute] = useState();
  const selectedDates = useSelector(selectCurrentDateRange);
  const [records, setRecords] = useState([]);
  const chartStyle = {
    fontSize: '0.8rem',
  };

  const metrics = [
    {
      label: t('Advertising.Metrics.Impressions'),
      value: 'impressions',
      formatter: numberFormatter,
    },
    {
      label: t('Advertising.Metrics.Clicks'),
      value: 'clicks',
      formatter: numberFormatter,
    },
    {
      label: t('Advertising.Metrics.Cost'),
      value: 'cost',
      formatter: currencyFormatter,
    },
    {
      label: t('Advertising.Metrics.Sales'),
      value: 'sales',
      formatter: currencyFormatter,
    },
    {
      label: t('Advertising.Metrics.Orders'),
      value: 'orders',
      formatter: numberFormatter,
    },
    {
      label: t('Advertising.Metrics.CostPerClick'),
      value: 'cpc',
      formatter: currencyFormatter,
    },
    {
      label: t('Advertising.Metrics.ClickThroughRate'),
      value: 'ctr',
      formatter: percentageFormatter,
    },
    {
      label: t('Advertising.Metrics.ConversionRate'),
      value: 'cr',
      formatter: percentageFormatter,
    },
    {
      label: t('Advertising.Metrics.ACOS'),
      value: 'acos',
      formatter: percentageFormatter,
    },
  ];

  const [selectedMetrics, setSelectedMetrics] = useState([
    metrics[0],
    metrics[1],
  ]);

  const onChangeMetric = (e) => {
    const { name, value } = e.target;
    let newSelectedMetrics = [...selectedMetrics];
    newSelectedMetrics[name] = metrics.find((m) => m.value === value);
    setSelectedMetrics(newSelectedMetrics);
  };

  useEffect(() => {
    const { startDate, endDate } = selectedDates;

    const params = {
      endDate,
      startDate,
      accountId,
      marketplace,
      campaignTypes: [campaignType],
      attributes: [
        'impressions',
        'clicks',
        'cost',
        'sales',
        'orders',
        'cpc',
        'ctr',
        'cr',
        'acos',
      ],
    };

    axios.get(url, { params }).then((response) => {
      let { data } = response.data;
      data = data.map((d) => {
        d.acos = (d.acos * 10000) / 100;
        d.ctr = (d.acos * 10000) / 100;
        d.cr = (d.acos * 10000) / 100;
        return d;
      });

      setRecords(data);
    });
  }, [dispatch, url, accountId, marketplace, campaignType, selectedDates]);

  const renderColorfulLegendText = (value, entry) => {
    const { color } = entry;

    return (
      <span
        style={{
          color,
          textDecoration: hiddenAttribute === value ? 'line-through' : '',
          opacity: hiddenAttribute === value ? 0.5 : 1,
        }}
      >
        {metrics.find((m) => m.value === value).label}
      </span>
    );
  };

  return (
    <div className="mt-4 xl:mt-0 xl:ml-4 bg-white shadow rounded-lg p-4 pb-0">
      <div className="md:grid md:grid-cols-5">
        <div className="flex items-center col-span-2">
          <p className="font-medium text-sm">Trend Comparison</p>
        </div>
        <div className="mt-2 md:mt-0 sm:grid sm:grid-cols-2 gap-2 col-span-3">
          {selectedMetrics.map((sm, i) => (
            <Select
              name={i}
              key={`metric-selection-${i}`}
              className="font-medium text-sm mb-2 md:mb-0"
              value={sm.value}
              onChange={onChangeMetric}
            >
              {metrics.map((option) => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </Select>
          ))}
        </div>
      </div>

      <div className="h-72 md:h-60 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="startDate" style={chartStyle} />

            <YAxis yAxisId="left" style={chartStyle} />
            <YAxis yAxisId="right" orientation="right" style={chartStyle} />

            <Tooltip
              wrapperStyle={chartStyle}
              formatter={function (value, name) {
                const metric = metrics.find((metric) => metric.value === name);

                return ['acos', 'ctr', 'cr'].includes(metric.value)
                  ? metric.formatter(value / 100)
                  : metric.formatter(value);
              }}
            />

            <Legend
              formatter={renderColorfulLegendText}
              onClick={(e) =>
                setHiddenAttribute(
                  hiddenAttribute === e.dataKey ? '' : e.dataKey
                )
              }
            />

            <Line
              dot={false}
              yAxisId="left"
              type="monotone"
              dataKey={selectedMetrics[0].value}
              stroke="#8884d8"
              strokeWidth={hiddenAttribute === selectedMetrics[0].value ? 0 : 3}
            />

            <Line
              dot={false}
              yAxisId="right"
              type="monotone"
              dataKey={selectedMetrics[1].value}
              stroke="#82ca9d"
              strokeWidth={hiddenAttribute === selectedMetrics[1].value ? 0 : 3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
