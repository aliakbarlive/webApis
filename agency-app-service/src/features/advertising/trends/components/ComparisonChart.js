import { startCase } from 'lodash';
import {
  Area,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const ComparisonChart = ({ title, data, color, dataKey, formatter }) => {
  const chartStyle = {
    fontSize: '0.65rem',
  };

  return (
    <div className="w-full h-48 mt-2">
      <p className="font-medium text-gray-800 text-sm">
        {title ? title : startCase(dataKey)}
      </p>

      <ResponsiveContainer className="w-full" height="100%">
        <ComposedChart className="w-full" data={data}>
          <defs>
            <linearGradient id={`${dataKey}Color`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor={color} stopOpacity={0.8} />
              <stop offset="90%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" style={chartStyle} />
          <YAxis yAxisId="right" orientation="right" style={chartStyle} />

          <Tooltip
            wrapperStyle={chartStyle}
            formatter={(value) => formatter(value)}
          />
          <Legend />

          <Legend
            verticalAlign="top"
            iconSize={14}
            wrapperStyle={{ fontSize: '10px' }}
          />

          <Area
            yAxisId={'right'}
            type="monotone"
            dataKey="current"
            strokeWidth={3}
            stroke={color}
            fillOpacity={1}
            fill={`url(#${dataKey}Color)`}
          />

          <Line
            yAxisId={'right'}
            type="basis"
            dataKey="previous"
            strokeWidth={3}
            strokeDasharray="5 5"
            stroke="#616161"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;
