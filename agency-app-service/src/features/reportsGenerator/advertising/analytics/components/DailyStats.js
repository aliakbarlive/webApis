import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Legend,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { currencyFormatter, percentageFormatter } from 'utils/formatters';

const DailyStats = ({ records = [] }) => {
  const chartStyle = {
    fontSize: '12px',
  };

  return (
    <div className="w-full break-after-page font-body pagebreak h-screen">
      <div className="bg-black h-1/6 flex flex-col justify-center">
        <p className="text-sm ml-16 font-extrabold text-white">
          PPC Performance Report
        </p>
        <p
          className="ml-14 font-extrabold text-white mt-1"
          style={{ fontSize: '34px', lineHeight: '60px' }}
        >
          Overall Performance Section
        </p>
      </div>

      <div
        className="h-1/2 mx-24 mt-24"
        style={{ marginLeft: '6rem', marginRight: '6rem' }}
      >
        <ResponsiveContainer className="w-full" height="100%">
          <ComposedChart className="w-full" data={records}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={chartStyle} />
            <YAxis
              yAxisId="left"
              style={chartStyle}
              tickFormatter={(value) => currencyFormatter(value)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              style={chartStyle}
              tickFormatter={(value) => percentageFormatter(value)}
            />
            <Legend
              wrapperStyle={{ position: 'relative', marginTop: '10px' }}
            />

            <Line
              name="Sales"
              stroke="#002f5d"
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              strokeWidth={4}
              dot={false}
              legendType="square"
            />

            <Line
              name="Spend"
              stroke="#f9dc7d"
              yAxisId="left"
              type="monotone"
              dataKey="cost"
              strokeWidth={4}
              dot={false}
              legendType="square"
            />

            <Line
              name="ACoS"
              yAxisId="right"
              type="monotone"
              dataKey="acos"
              stroke="#fb426f"
              strokeWidth={4}
              dot={false}
              legendType="square"
            />
            <Line
              name="TACoS"
              stroke="#fee3e9"
              yAxisId="right"
              type="monotone"
              dataKey="tacos"
              strokeWidth={4}
              dot={false}
              legendType="square"
            />

            <Line
              name="Total Sales"
              stroke="#0369a1"
              yAxisId="left"
              type="monotone"
              dataKey="totalSales"
              strokeWidth={4}
              dot={false}
              legendType="square"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyStats;
