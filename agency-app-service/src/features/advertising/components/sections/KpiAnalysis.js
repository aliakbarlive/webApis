import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts';

import {
  currencyFormatter,
  numberFormatter,
  percentageFormatter,
} from 'utils/formatters';

const KpiAnalysis = ({ url, listUrl }) => {
  const [data, setData] = useState([]);
  const [targetings, setTargetings] = useState({ rows: [] });
  const [attribute, setAttribute] = useState('impressions');

  const metrics = [
    {
      key: 'impressions',
      name: 'Impressions',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'clicks',
      name: 'Clicks',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'orders',
      name: 'Orders',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'sales',
      name: 'Sales',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'cost',
      name: 'Ad Spend',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'unitsSold',
      name: 'Units',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'ctr',
      name: 'CTR',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'cr',
      name: 'Conversion Rate',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'acos',
      name: 'ACoS',
      formatter: (value) => percentageFormatter(value),
    },
    {
      key: 'cpm',
      name: 'CPM',
      formatter: (value) => numberFormatter(value),
    },
    {
      key: 'cpc',
      name: 'Cost per Click',
      formatter: (value) => currencyFormatter(value),
    },
    {
      key: 'cpcon',
      name: 'Cost per Conversion',
      formatter: (value) => currencyFormatter(value),
    },
  ];

  useEffect(() => {
    axios
      .get(url, { params: { attribute } })
      .then((response) => setData(response.data.data));

    axios
      .get(listUrl, {
        params: {
          attributes: `advTargetingId,value,${attribute}`,
          sort: attribute,
          pageSize: 15,
        },
      })
      .then((response) => setTargetings(response.data.data));
  }, [url, listUrl, attribute]);

  return (
    <div className="flex flex-col mt-12 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between rounded-t-xl">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          KPI Analysis
        </p>
        <select
          className="text-xs text-gray-700"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
        >
          {metrics.map((metric) => (
            <option key={metric.key} value={metric.key}>
              {metric.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 sm:px-6 py-6">
        <div>
          <p className="text-gray-600 font-medium text-sm leading-6">
            Distribution
          </p>

          <div className="h-96 mt-4">
            <ResponsiveContainer height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="end"
                  style={{
                    fontSize: '0.7rem',
                  }}
                  tickFormatter={(value) =>
                    metrics.find((m) => m.key === attribute).formatter(value)
                  }
                />
                <YAxis
                  dataKey="count"
                  tickFormatter={(value) => numberFormatter(value)}
                  style={{
                    fontSize: '0.7rem',
                  }}
                />
                <Tooltip
                  formatter={(value) => numberFormatter(value)}
                  style={{
                    fontSize: '0.7rem',
                  }}
                />
                <Bar dataKey="count" fill="#FF89A6 " />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-gray-600 font-medium text-sm leading-6">
            By Keyword
          </p>

          <div className="my-4 h-96">
            <ResponsiveContainer width={'100%'} height="100%" debounce={50}>
              <BarChart
                data={targetings.rows}
                layout="vertical"
                margin={{ left: 75 }}
                barCategoryGap={1}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  axisLine={false}
                  type="number"
                  style={{
                    fontSize: '0.7rem',
                  }}
                  tickFormatter={(value) => numberFormatter(value)}
                />
                <YAxis
                  yAxisId={0}
                  dataKey={'value'}
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  style={{
                    fontSize: '0.7rem',
                  }}
                />

                <Bar
                  dataKey={attribute}
                  minPointSize={2}
                  barSize={15}
                  fill="#FF89A6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiAnalysis;
