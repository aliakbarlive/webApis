import axios from 'axios';
import { useTranslation } from 'react-i18next';
import React, { useMemo, useState, useEffect } from 'react';

import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  Bar,
} from 'recharts';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

let ctx;

export const measureText14HelveticaNeue = (text) => {
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d');
    ctx.font = "0.8rem 'Helvetica Neue";
  }

  return ctx.measureText(text).width;
};

const BAR_AXIS_SPACE = 10;

const BiggestChangesByKeyword = ({
  accountId,
  marketplace,
  startDate,
  endDate,
  campaignType,
}) => {
  const { t } = useTranslation();
  const [attribute, setAttribute] = useState('profit');
  const [keywords, setKeywords] = useState({ rows: [] });
  const [params, setParams] = useState({ page: 1, pageSize: 10 });

  const metrics = [
    { label: 'Revenue', value: 'profit', formatter: currencyFormatter },
    { label: 'Avg. Order value', value: 'aov', formatter: currencyFormatter },
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

  const chartStyle = {
    fontSize: '0.8rem',
  };

  useEffect(() => {
    axios
      .get('/ppc/analytics/keyword-changes', {
        params: {
          ...params,
          accountId,
          marketplace,
          startDate,
          endDate,
          attribute,
          campaignType,
        },
      })
      .then((response) => {
        let { data } = response.data;
        data.rows = data.rows.map((row) => {
          row.name = `${row.keywordText} (${row.matchType})`;
          return row;
        });
        setKeywords(data);
      });
  }, [
    accountId,
    marketplace,
    campaignType,
    attribute,
    startDate,
    endDate,
    params,
  ]);

  const maxTextWidth = useMemo(
    () =>
      keywords.rows.reduce((acc, cur) => {
        const value = cur['difference'];
        const width = measureText14HelveticaNeue(value);
        if (width > acc) {
          return width;
        }
        return acc;
      }, 0),
    [keywords.rows]
  );

  const onPrevPage = () => {
    const newParams = { ...params, page: params.page - 1 };
    setParams(newParams);
  };

  const onNextPage = () => {
    const newParams = { ...params, page: params.page + 1 };
    setParams(newParams);
  };

  return (
    <div className="relative border border-gray-300 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center px-4 py-5 border-b border-gray-200 sm:px-6 rounded-t-md">
        <p className="text-sm leading-6 font-medium text-gray-700">
          Biggest Changes By{' '}
          {campaignType === 'sponsoredProducts' ? 'SP' : 'SB'} Keywords
        </p>
        <select
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md disabled:bg-gray-100 text-sm text-gray-700  w-48"
        >
          {metrics.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="m-4 mb-16">
        <ResponsiveContainer
          width={'100%'}
          height={50 * keywords.rows.length}
          debounce={50}
        >
          <BarChart
            data={keywords.rows}
            layout="vertical"
            margin={{ left: 20, right: maxTextWidth + (BAR_AXIS_SPACE + 12) }}
          >
            <CartesianGrid strokeDasharray="4" />
            <XAxis
              axisLine={false}
              type="number"
              style={chartStyle}
              tickFormatter={(value) => {
                const metric = metrics.find((m) => m.value === attribute);
                return metric.formatter(value);
              }}
            />
            <YAxis
              yAxisId={0}
              dataKey={'name'}
              type="category"
              axisLine={false}
              tickLine={false}
              style={chartStyle}
              width={180}
              tickFormatter={(value) =>
                value.length > 70 ? value.substr(0, 70) + '...' : value
              }
            />
            <YAxis
              orientation="right"
              yAxisId={1}
              dataKey={'difference'}
              type="category"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value, index) => {
                const keyword = keywords.rows[index];
                const metric = metrics.find((m) => m.value === attribute);
                let formattedValue = metric.formatter(value);

                if (keyword.previous) {
                  const percentage = value / Math.abs(keyword.previous);

                  formattedValue = `${formattedValue} (${percentageFormatter(
                    percentage
                  )})`;
                }

                return formattedValue;
              }}
              mirror
              style={chartStyle}
              tick={{
                transform: `translate(${
                  maxTextWidth + BAR_AXIS_SPACE + 20
                }, 0)`,
              }}
            />

            <Bar dataKey={'difference'} minPointSize={2} barSize={15}>
              {keywords.rows.map((d) => {
                const color = d['difference'] > 0 ? '#5487B1' : '#B5D0EA';
                return <Cell key={d['name']} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <nav
        className="absolute w-full bottom-0 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{keywords.from}</span> to{' '}
            <span className="font-medium">{keywords.to}</span> of{' '}
            <span className="font-medium">{keywords.count}</span> results
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button
            disabled={!!!keywords.prevPage}
            onClick={onPrevPage}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            disabled={!!!keywords.nextPage}
            onClick={onNextPage}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BiggestChangesByKeyword;
